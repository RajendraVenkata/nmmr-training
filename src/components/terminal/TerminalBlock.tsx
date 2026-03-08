"use client";

import { useState } from "react";
import { Terminal, Maximize2, Minimize2, X } from "lucide-react";
import { TerminalWidget } from "./TerminalWidget";
import { cn } from "@/lib/utils";

type TerminalMode = "bottom" | "popup";

interface TerminalBlockProps {
  labId: string;
  courseId: string;
  token: string;
  duration?: number; // in minutes
  mode?: TerminalMode; // "bottom" (default) or "popup"
  onClose?: () => void; // callback when popup is closed
}

export function TerminalBlock({
  labId,
  courseId,
  token,
  duration,
  mode = "bottom",
  onClose,
}: TerminalBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [started, setStarted] = useState(false);

  const terminalEnabled = process.env.NEXT_PUBLIC_TERMINAL_ENABLED === "true";

  if (!terminalEnabled) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
        <Terminal className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Interactive terminal is not available at this time.
        </p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="rounded-lg border border-[#313244] bg-[#1e1e2e] p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Terminal className="h-10 w-10 text-[#94e2d5]" />
          <div>
            <h4 className="font-semibold text-[#cdd6f4]">
              Interactive Terminal: {labId}
            </h4>
            <p className="text-sm text-[#a6adc8] mt-1">
              Click below to start a live terminal session in a Docker container.
            </p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="mt-2 px-6 py-2 rounded-md bg-[#94e2d5] hover:bg-[#a6e3a1] text-[#1e1e2e] font-medium text-sm transition-colors"
          >
            Launch Terminal
          </button>
        </div>
      </div>
    );
  }

  // Popup mode: rendered as a floating overlay
  if (mode === "popup") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          className={cn(
            "rounded-lg border border-[#313244] overflow-hidden bg-[#1e1e2e] flex flex-col",
            expanded
              ? "fixed inset-4 z-50"
              : "w-[90vw] max-w-4xl h-[70vh]"
          )}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#181825] border-b border-[#313244]">
            <div className="flex items-center gap-2 text-xs text-[#a6adc8]">
              <Terminal className="h-3.5 w-3.5" />
              <span>{labId}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#a6adc8] hover:text-[#cdd6f4] transition-colors p-1"
              >
                {expanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={onClose}
                className="text-[#a6adc8] hover:text-[#f38ba8] transition-colors p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 p-2">
            <TerminalWidget
              labId={labId}
              courseId={courseId}
              token={token}
              timeoutMs={duration ? duration * 60 * 1000 : undefined}
            />
          </div>
        </div>
      </div>
    );
  }

  // Bottom mode (default): rendered inline at the bottom
  return (
    <div
      className={cn(
        "rounded-lg border border-[#313244] overflow-hidden",
        expanded && "fixed inset-4 z-50 bg-[#1e1e2e] flex flex-col"
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#181825] border-b border-[#313244]">
        <div className="flex items-center gap-2 text-xs text-[#a6adc8]">
          <Terminal className="h-3.5 w-3.5" />
          <span>{labId}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[#a6adc8] hover:text-[#cdd6f4] transition-colors"
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
        <TerminalWidget
          labId={labId}
          courseId={courseId}
          token={token}
          timeoutMs={duration ? duration * 60 * 1000 : undefined}
        />
      </div>
    </div>
  );
}
