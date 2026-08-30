"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  name: string; // hidden input name that will hold the final URL
  label: string;
  defaultValue?: string;
}

/**
 * Uploads an image to /api/upload (which saves it under /public/uploads)
 * and stores the returned URL in a hidden input so it submits normally
 * as part of the surrounding <form action={serverAction}>.
 */
export function ImageUploader({ name, label, defaultValue }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <Label>{label}</Label>
      {/* This hidden input is what the surrounding <form> actually submits */}
      <input type="hidden" name={name} value={preview} />

      {preview ? (
        <div className="relative h-40 w-full overflow-hidden rounded-md border border-slate-200">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <UploadCloud className="mb-2 h-6 w-6" />
              <span className="text-sm">Click to upload image</span>
              <span className="text-xs text-slate-400">JPG, PNG or WEBP, max 5MB</span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
