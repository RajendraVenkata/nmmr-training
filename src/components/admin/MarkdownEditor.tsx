"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Bold,
  Italic,
  Heading2,
  List,
  Code,
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: () => void;
  placeholder?: string;
  minRows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  onImageUpload,
  placeholder = "Write your content in markdown...",
  minRows = 15,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<string>("write");

  function insertAtCursor(before: string, after = "") {
    const textarea = document.getElementById(
      "markdown-editor-textarea"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selected +
      after +
      value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  }

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          {tab === "write" && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => insertAtCursor("**", "**")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => insertAtCursor("*", "*")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => insertAtCursor("\n## ", "\n")}
                title="Heading"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => insertAtCursor("\n- ", "")}
                title="List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => insertAtCursor("\n```\n", "\n```\n")}
                title="Code block"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => insertAtCursor("[", "](url)")}
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              {onImageUpload && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onImageUpload}
                  title="Insert image"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-2">
          <Textarea
            id="markdown-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
            className="font-mono text-sm"
          />
          <div className="flex justify-end gap-3 mt-1 text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div className="prose prose-sm dark:prose-invert max-w-none border rounded-md p-4 min-h-[300px]">
            {value ? (
              <ReactMarkdown
                components={{
                  code(props) {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    const inline = !match;
                    return inline ? (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    ) : (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  },
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                Nothing to preview yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
