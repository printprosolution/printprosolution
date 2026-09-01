"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  name: string; // hidden input name that will hold the final image value
  label: string;
  defaultValue?: string;
  required?: boolean; // shows a note that an image must be selected
}

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB (base64 stored directly in DB)

/**
 * Converts the selected image to a base64 data URL entirely in the
 * browser and stores it in a hidden input, so it submits as part of the
 * surrounding <form action={serverAction}>.
 *
 * Why base64 instead of saving a file: on Vercel, serverless functions
 * cannot write to the filesystem (it's read-only in production and reset
 * on every deploy), so a "save to /public/uploads" API route fails there
 * with a non-JSON error page — that's the "Unexpected JSON input" error.
 * Storing the image directly in the database sidesteps that limitation
 * completely and works identically on Vercel, a VPS, or locally.
 */
export function ImageUploader({ name, label, defaultValue, required }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(defaultValue || "");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be smaller than 4MB.");
      return;
    }

    setProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setProcessing(false);
    };
    reader.onerror = () => {
      setError("Could not read that image, please try another.");
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </Label>
      {/* This hidden input is what the surrounding <form> actually submits */}
      <input type="hidden" name={name} value={preview} required={required && !preview} />

      {preview ? (
        <div className="relative h-40 w-full overflow-hidden rounded-md border border-slate-200">
          <Image src={preview} alt="Preview" fill unoptimized className="object-cover" />
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
          {processing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <UploadCloud className="mb-2 h-6 w-6" />
              <span className="text-sm">Click to upload image</span>
              <span className="text-xs text-slate-400">JPG, PNG or WEBP, max 4MB</span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={processing}
          />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {required && !preview && !error && (
        <p className="mt-1 text-xs text-slate-500">An image is required.</p>
      )}
    </div>
  );
}
