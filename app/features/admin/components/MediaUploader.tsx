"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@shared/components/ui";
import { isVideoUrl } from "@shared/utils";
import ConfirmDialog from "./ConfirmDialog";

interface MediaUploaderProps {
  files: File[];
  existingMedia: { media_id: string; file_url: string; cover_image: boolean }[];
  onFilesAdd: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  onRemoveExisting: (mediaId: string) => void;
  onSetCover: (mediaId: string | null, index: number | null) => void;
  coverSource: { type: "existing"; id: string } | { type: "new"; index: number } | null;
}

interface MediaTileProps {
  src?: string;
  isVideo: boolean;
  isNew: boolean;
  name?: string;
  isCover: boolean;
  onToggleCover: () => void;
  onDelete: () => void;
}

function MediaTile({ src, isVideo, isNew, name, isCover, onToggleCover, onDelete }: MediaTileProps) {
  return (
    <div
      className="relative group rounded-lg overflow-hidden aspect-square"
      style={{
        border: isCover ? "2px solid var(--primary)" : "1px solid var(--border-color)",
        backgroundColor: "var(--surface)",
      }}
    >
      {src &&
        (isVideo ? (
          // #t=0.1 hace que el navegador muestre el primer fotograma como miniatura.
          <video
            src={`${src}#t=0.1`}
            preload="metadata"
            muted
            playsInline
            tabIndex={-1}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name ?? "Imagen de la propiedad"} className="w-full h-full object-cover" />
        ))}

      {isVideo && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 text-white text-lg pl-1"
              aria-hidden="true"
            >
              ▶
            </span>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white bg-black/70">
            Video
          </div>
        </>
      )}

      {isNew && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-medium bg-white text-black">
          Nuevo
        </div>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col sm:flex-row items-center justify-center gap-2 p-2">
        {!isVideo && (
          <button
            type="button"
            onClick={onToggleCover}
            className="w-full sm:w-auto px-4 py-2 sm:px-2 sm:py-1 text-sm sm:text-xs rounded bg-white text-black font-medium"
          >
            {isCover ? "Quitar cover" : "Portada"}
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="w-full sm:w-auto px-4 py-2 sm:px-2 sm:py-1 text-sm sm:text-xs rounded bg-red-500 text-white font-medium"
        >
          Eliminar
        </button>
      </div>

      {isCover && (
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Portada
        </div>
      )}
    </div>
  );
}

export default function MediaUploader({
  files,
  existingMedia,
  onFilesAdd,
  onRemoveNew,
  onRemoveExisting,
  onSetCover,
  coverSource,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "existing"; id: string } | { type: "new"; index: number } | null
  >(null);

  // Una URL temporal por archivo nuevo; se liberan al cambiar la lista o desmontar.
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    // Sincroniza con un recurso del navegador (blob URLs): crearlas en render o con useMemo
    // las dejaria revocadas tras el remonte de StrictMode.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdd(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "existing") {
      onRemoveExisting(deleteTarget.id);
    } else {
      onRemoveNew(deleteTarget.index);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Imagenes y videos
        </label>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Agregar archivos
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {existingMedia.map((media) => {
          const isCover = coverSource?.type === "existing" && coverSource.id === media.media_id;
          return (
            <MediaTile
              key={media.media_id}
              src={media.file_url}
              isVideo={isVideoUrl(media.file_url)}
              isNew={false}
              isCover={isCover}
              onToggleCover={() => onSetCover(isCover ? null : media.media_id, null)}
              onDelete={() => setDeleteTarget({ type: "existing", id: media.media_id })}
            />
          );
        })}

        {files.map((file, index) => {
          const isCover = coverSource?.type === "new" && coverSource.index === index;
          return (
            <MediaTile
              key={`new-${index}`}
              src={previews[index]}
              isVideo={file.type.startsWith("video/")}
              isNew
              name={file.name}
              isCover={isCover}
              onToggleCover={() => onSetCover(null, isCover ? null : index)}
              onDelete={() => setDeleteTarget({ type: "new", index })}
            />
          );
        })}
      </div>

      <p className="text-xs" style={{ color: "var(--muted)" }}>
        La portada solo puede ser una imagen. Los videos se muestran en la galeria de la propiedad.
      </p>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Eliminar archivo"
        message="¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
