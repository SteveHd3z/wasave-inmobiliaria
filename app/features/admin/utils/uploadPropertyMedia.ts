import { createBrowserClient } from "@shared/utils/supabase";

const BUCKET = "property-media";

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>;

export interface UploadProgress {
  percent: number;
  current: number;
  total: number;
  fileName: string;
}

function putWithProgress(
  url: string,
  file: File,
  headers: Record<string, string>,
  onProgress: (loaded: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
    };
    xhr.onerror = () => reject(new Error("Error de red al subir el archivo"));
    xhr.onabort = () => reject(new Error("Subida cancelada"));
    xhr.send(file);
  });
}

/**
 * Sube los archivos de una propiedad uno a uno (en orden) y registra cada uno en
 * property_media. Reporta el avance total en bytes. Devuelve la cantidad de errores.
 */
export async function uploadPropertyMedia({
  supabase,
  propertyId,
  files,
  coverFile,
  startOrder,
  onProgress,
}: {
  supabase: SupabaseBrowserClient;
  propertyId: string;
  files: File[];
  coverFile: File | null;
  startOrder: number;
  onProgress: (progress: UploadProgress) => void;
}): Promise<number> {
  if (files.length === 0) return 0;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    console.error("Sin sesion activa para subir archivos");
    return files.length;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0) || 1;
  let doneBytes = 0;
  let errors = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop();
    const path = `${propertyId}/${Date.now()}-${i}.${ext}`;
    const report = (loaded: number) =>
      onProgress({
        percent: Math.min(100, Math.round(((doneBytes + loaded) / totalBytes) * 100)),
        current: i + 1,
        total: files.length,
        fileName: file.name,
      });

    report(0);

    try {
      await putWithProgress(
        `${baseUrl}/storage/v1/object/${BUCKET}/${path}`,
        file,
        {
          Authorization: `Bearer ${session.access_token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          "Content-Type": file.type,
          "x-upsert": "false",
          "cache-control": "max-age=3600",
        },
        report
      );
    } catch (err) {
      console.error("Error al subir archivo:", file.name, err);
      errors++;
      doneBytes += file.size;
      continue;
    }

    doneBytes += file.size;
    report(0);

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const { error: insertError } = await supabase.from("property_media").insert({
      file_url: publicUrl,
      cover_image: coverFile === file,
      display_order: startOrder + i,
      property_id: propertyId,
    });

    if (insertError) {
      console.error("Error al guardar registro de media:", insertError);
      errors++;
    }
  }

  return errors;
}
