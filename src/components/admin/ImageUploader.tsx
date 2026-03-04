"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/constants";

interface ImageUploaderProps {
  onUpload: (data: {
    base64: string;
    mimeType: string;
    filename: string;
    altText: string;
    sizeBytes: number;
    width?: number;
    height?: number;
  }) => void;
  currentImageUrl?: string | null;
  label?: string;
}

export function ImageUploader({
  onUpload,
  currentImageUrl,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null
  );
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
      setError("Invalid file type. Use PNG, JPG, WebP, GIF, or SVG.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image must be 2MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Extract base64 from data URL (data:image/png;base64,xxx)
      const base64 = dataUrl.split(",")[1];
      setPreview(dataUrl);

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        onUpload({
          base64,
          mimeType: file.type,
          filename: file.name,
          altText: altText || file.name,
          sizeBytes: file.size,
          width: img.width,
          height: img.height,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleClear() {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative border rounded-md p-2">
          <img
            src={preview}
            alt={altText || "Preview"}
            className="max-h-48 rounded object-contain mx-auto"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            {dragging ? (
              <ImageIcon className="h-8 w-8 text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              Click or drag & drop an image
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP, GIF, SVG (max 2MB)
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-2">
        <Label htmlFor="altText">Alt Text (required)</Label>
        <Input
          id="altText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image for accessibility"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
