"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface MultiImageUploaderProps {
  name: string; // hidden input name (repeated for each image)
  label: string;
  defaultValues?: string[];
}

const MAX_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES = 8;

/** Same base64-in-browser approach as ImageUploader, but for a gallery of
 * several extra product photos. Each image becomes its own hidden input
 * with the same `name`, so formData.getAll(name) returns the full list. */
export function MultiImageUploader({ name, label, defaultValues = [] }: MultiImageUploaderProps) {
  const [images, setImages] = useState<string[]>(defaultValues);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError(null);

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`You can add up to ${MAX_IMAGES} extra photos.`);
      return;
    }

    const toProcess = files.slice(0, remaining);
    setProcessing(true);
    let done = 0;
    const results: string[] = [];

    toProcess.forEach((file) => {
      if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
        done++;
        if (done === toProcess.length) finish();
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("Some images were skipped — max 4MB each.");
        done++;
        if (done === toProcess.length) finish();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        results.push(reader.result as string);
        done++;
        if (done === toProcess.length) finish();
      };
      reader.onerror = () => {
        done++;
        if (done === toProcess.length) finish();
      };
      reader.readAsDataURL(file);
    });

    function finish() {
      setImages((prev) => [...prev, ...results]);
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemove(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <Label>{label}</Label>
      {images.map((img, i) => (
        <input key={i} type="hidden" name={name} value={img} />
      ))}

      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative h-20 w-full overflow-hidden rounded-md border border-slate-200">
            <Image src={img} alt={`Photo ${i + 1}`} fill unoptimized className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < MAX_IMAGES && (
          <label className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:bg-slate-100">
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={processing}
            />
          </label>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">Up to {MAX_IMAGES} extra photos — shown as a gallery on the product page.</p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
