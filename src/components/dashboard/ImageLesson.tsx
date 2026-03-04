"use client";

interface ImageLessonProps {
  imageUrl: string;
  altText: string;
  caption?: string;
}

export function ImageLesson({ imageUrl, altText, caption }: ImageLessonProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg overflow-hidden border bg-muted/30">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full max-h-[600px] object-contain mx-auto"
        />
      </div>
      {caption && (
        <p className="text-center text-sm text-muted-foreground italic">
          {caption}
        </p>
      )}
    </div>
  );
}
