"use client";

import { MarkdownEditor } from "./MarkdownEditor";

interface DocumentEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: () => void;
}

export function DocumentEditor({
  value,
  onChange,
  onImageUpload,
}: DocumentEditorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Write your document content in markdown. Documents typically contain
        longer-form content such as project briefs, reference materials, or
        detailed guides.
      </p>
      <MarkdownEditor
        value={value}
        onChange={onChange}
        onImageUpload={onImageUpload}
        placeholder="Write your document content in markdown..."
        minRows={20}
      />
    </div>
  );
}
