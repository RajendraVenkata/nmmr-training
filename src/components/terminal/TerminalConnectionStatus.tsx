"use client";

import { cn } from "@/lib/utils";

export type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface TerminalConnectionStatusProps {
  state: ConnectionState;
  labName?: string;
  errorMessage?: string;
}

const STATUS_CONFIG: Record<
  ConnectionState,
  { color: string; pulse: boolean; label: string }
> = {
  disconnected: { color: "bg-gray-400", pulse: false, label: "Disconnected" },
  connecting: { color: "bg-yellow-400", pulse: true, label: "Connecting..." },
  connected: { color: "bg-green-500", pulse: false, label: "Connected" },
  error: { color: "bg-red-500", pulse: false, label: "Error" },
};

export function TerminalConnectionStatus({
  state,
  labName,
  errorMessage,
}: TerminalConnectionStatusProps) {
  const config = STATUS_CONFIG[state];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.color
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2.5 w-2.5",
            config.color
          )}
        />
      </span>
      <span className="text-muted-foreground">
        {config.label}
        {labName && state === "connected" && ` — ${labName}`}
        {errorMessage && state === "error" && ` — ${errorMessage}`}
      </span>
    </div>
  );
}
