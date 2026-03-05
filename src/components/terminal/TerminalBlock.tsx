"use client";

import { useState } from "react";
import { Terminal, Maximize2, Minimize2 } from "lucide-react";
import { TerminalWidget } from "./TerminalWidget";
import { cn } from "@/lib/utils";

interface TerminalBlockProps {
  labId: string;
  courseId: string;
  token: string;
}

export function TerminalBlock({ labId, courseId, token }: TerminalBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [started, setStarted] = useState(false);

  const terminalEnabled = process.env.NEXT_PUBLIC_TERMINAL_ENABLED === "true";

  if (!terminalEnabled) {
    return (
      <div className="my-4 rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
        <Terminal className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Interactive terminal is not available at this time.
        </p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="my-4 rounded-lg border border-border/60 bg-muted/30 p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Terminal className="h-10 w-10 text-primary" />
          <div>
            <h4 className="font-semibold text-foreground">
              Interactive Terminal: {labId}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Click below to start a live terminal session in a Docker container.
            </p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="mt-2 px-6 py-2 rounded-full bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-colors"
          >
            Launch Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "my-4 rounded-lg border border-border/60 overflow-hidden",
        expanded && "fixed inset-4 z-50 bg-white flex flex-col"
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border/60">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" />
          <span>{labId}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Terminal */}
      <div className={cn("p-2", expanded && "flex-1")}>
        <TerminalWidget labId={labId} courseId={courseId} token={token} />
      </div>
    </div>
  );
}
