"use client";

import { useRef } from "react";
import { Button } from "@shared/components/ui";

interface MediaUploaderProps {
  files: File[];
  existingMedia: { media_id: string; file_url: string; cover_image: boolean }[];
  onFilesAdd: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  onRemoveExisting: (mediaId: string) => void;
  onSetCover: (mediaId: string | null, index: number | null) => void;
  coverSource: { type: "existing"; id: string } | { type: "new"; index: number } | null;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdd(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Imagenes y videos
        </label>
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Agregar archivos
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {existingMedia.map((media) => {
          const isCover =
            coverSource?.type === "existing" && coverSource.id === media.media_id;
          return (
            <div
              key={media.media_id}
              className="relative group rounded-lg overflow-hidden aspect-square"
              style={{ border: isCover ? "2px solid var(--primary)" : "1px solid var(--border-color)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.file_url}
                alt="Media"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    onSetCover(
                      isCover ? null : media.media_id,
                      null
                    )
                  }
                  className="px-2 py-1 text-xs rounded bg-white text-black font-medium"
                >
                  {isCover ? "Quitar cover" : "Portada"}
                </button>
                <button
                  onClick={() => onRemoveExisting(media.media_id)}
                  className="px-2 py-1 text-xs rounded bg-red-500 text-white font-medium"
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
        })}

        {files.map((file, index) => {
          const isCover = coverSource?.type === "new" && coverSource.index === index;
          const url = URL.createObjectURL(file);
          return (
            <div
              key={`new-${index}`}
              className="relative group rounded-lg overflow-hidden aspect-square"
              style={{ border: isCover ? "2px solid var(--primary)" : "1px solid var(--border-color)" }}
            >
              {file.type.startsWith("video/") ? (
                <video src={url} className="w-full h-full object-cover" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={url} alt={file.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => onSetCover(null, isCover ? null : index)}
                  className="px-2 py-1 text-xs rounded bg-white text-black font-medium"
                >
                  {isCover ? "Quitar cover" : "Portada"}
                </button>
                <button
                  onClick={() => onRemoveNew(index)}
                  className="px-2 py-1 text-xs rounded bg-red-500 text-white font-medium"
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
        })}
      </div>
    </div>
  );
}
