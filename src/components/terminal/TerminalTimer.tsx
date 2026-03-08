"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalTimerProps {
  timeoutMs: number;
  lastActivityTime: number;
  isConnected: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TerminalTimer({
  timeoutMs,
  lastActivityTime,
  isConnected,
}: TerminalTimerProps) {
  const [remainingMs, setRemainingMs] = useState(timeoutMs);

  useEffect(() => {
    if (!isConnected) return;

    // Reset to full timeout whenever activity happens
    setRemainingMs(timeoutMs);
  }, [lastActivityTime, timeoutMs, isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityTime;
      const remaining = Math.max(0, timeoutMs - elapsed);
      setRemainingMs(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivityTime, timeoutMs, isConnected]);

  if (!isConnected) return null;

  const isWarning = remainingMs <= 5 * 60 * 1000 && remainingMs > 60 * 1000;
  const isCritical = remainingMs <= 60 * 1000;
  const isExpired = remainingMs === 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-mono",
        isExpired && "text-[#f38ba8]",
        isCritical && !isExpired && "text-[#f38ba8] animate-pulse",
        isWarning && "text-[#f9e2af]",
        !isWarning && !isCritical && "text-[#a6adc8]"
      )}
    >
      <Clock className="h-3 w-3" />
      <span>{formatTime(remainingMs)}</span>
    </div>
  );
}
