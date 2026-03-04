"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";

interface ImageLessonData {
  base64: string;
  mimeType: string;
  altText: string;
  caption: string;
}

interface ImageLessonEditorProps {
  value: ImageLessonData;
  onChange: (value: ImageLessonData) => void;
}

export function ImageLessonEditor({
  value,
  onChange,
}: ImageLessonEditorProps) {
  return (
    <div className="space-y-4">
      <ImageUploader
        label="Lesson Image"
        currentImageUrl={
          value.base64
            ? `data:${value.mimeType};base64,${value.base64}`
            : null
        }
        onUpload={(data) => {
          onChange({
            ...value,
            base64: data.base64,
            mimeType: data.mimeType,
            altText: data.altText || value.altText,
          });
        }}
      />

      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input
          value={value.altText}
          onChange={(e) =>
            onChange({ ...value, altText: e.target.value })
          }
          placeholder="Describe the image for accessibility"
        />
      </div>

      <div className="space-y-2">
        <Label>Caption</Label>
        <Textarea
          value={value.caption}
          onChange={(e) =>
            onChange({ ...value, caption: e.target.value })
          }
          placeholder="Optional caption displayed below the image"
          rows={2}
        />
      </div>

      {value.base64 && (
        <div className="border rounded-md p-4">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <img
            src={`data:${value.mimeType};base64,${value.base64}`}
            alt={value.altText}
            className="max-h-64 rounded object-contain mx-auto"
          />
          {value.caption && (
            <p className="text-center text-sm text-muted-foreground mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
