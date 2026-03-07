"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import {
  TerminalConnectionStatus,
  type ConnectionState,
} from "./TerminalConnectionStatus";
import { TerminalTimer } from "./TerminalTimer";

interface TerminalWidgetProps {
  labId: string;
  courseId: string;
  token: string;
  timeoutMs?: number;
}

// Dynamic import xterm to avoid SSR issues
let Terminal: typeof import("@xterm/xterm").Terminal | null = null;
let FitAddon: typeof import("@xterm/addon-fit").FitAddon | null = null;

async function loadXterm() {
  if (!Terminal) {
    const xtermModule = await import("@xterm/xterm");
    Terminal = xtermModule.Terminal;
  }
  if (!FitAddon) {
    const fitModule = await import("@xterm/addon-fit");
    FitAddon = fitModule.FitAddon;
  }
}

export function TerminalWidget({ labId, courseId, token, timeoutMs: timeoutMsProp }: TerminalWidgetProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<InstanceType<typeof import("@xterm/xterm").Terminal> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<InstanceType<typeof import("@xterm/addon-fit").FitAddon> | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [labName, setLabName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTimeoutMs, setActiveTimeoutMs] = useState<number>(0);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  const wsUrl = process.env.NEXT_PUBLIC_TERMINAL_WS_URL || "ws://localhost:8080";

  const connect = useCallback(async () => {
    if (!terminalRef.current) return;

    setConnectionState("connecting");
    setErrorMessage("");

    // Load xterm dynamically
    await loadXterm();
    if (!Terminal || !FitAddon) return;

    // Create terminal if not exists
    if (!xtermRef.current) {
      const fitAddon = new FitAddon();
      fitAddonRef.current = fitAddon;

      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: "JetBrains Mono, Menlo, Monaco, monospace",
        theme: {
          background: "#1e1e2e",
          foreground: "#cdd6f4",
          cursor: "#f5e0dc",
          selectionBackground: "#45475a",
          black: "#45475a",
          red: "#f38ba8",
          green: "#a6e3a1",
          yellow: "#f9e2af",
          blue: "#89b4fa",
          magenta: "#f5c2e7",
          cyan: "#94e2d5",
          white: "#bac2de",
          brightBlack: "#585b70",
          brightRed: "#f38ba8",
          brightGreen: "#a6e3a1",
          brightYellow: "#f9e2af",
          brightBlue: "#89b4fa",
          brightMagenta: "#f5c2e7",
          brightCyan: "#94e2d5",
          brightWhite: "#a6adc8",
        },
        allowProposedApi: true,
      });

      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = term;
    }

    const term = xtermRef.current;
    term.clear();
    term.writeln("\x1b[36m● Connecting to lab environment...\x1b[0m\r\n");

    // Connect WebSocket
    const url = `${wsUrl}?token=${encodeURIComponent(token)}&labId=${encodeURIComponent(labId)}&courseId=${encodeURIComponent(courseId)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      // Connection established, wait for ready message
    };

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        // Try to parse as JSON control message
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "ready") {
            setConnectionState("connected");
            setLabName(msg.message || labId);
            const timeout = timeoutMsProp || msg.timeoutMs || 0;
            setActiveTimeoutMs(timeout);
            setLastActivityTime(Date.now());
            term.writeln(`\x1b[32m● ${msg.message || "Connected"}\x1b[0m\r\n`);
            term.focus();
            return;
          }
          if (msg.type === "activity_ack") {
            return;
          }
          if (msg.type === "system") {
            term.writeln(`\x1b[33m● ${msg.message}\x1b[0m\r\n`);
            return;
          }
          if (msg.type === "error") {
            setConnectionState("error");
            setErrorMessage(msg.message || "Unknown error");
            term.writeln(`\x1b[31m● Error: ${msg.message}\x1b[0m\r\n`);
            return;
          }
          if (msg.type === "pong") {
            return;
          }
        } catch {
          // Not JSON — treat as terminal output
        }
        term.write(event.data);
      } else if (event.data instanceof ArrayBuffer) {
        term.write(new Uint8Array(event.data));
      }
    };

    ws.onclose = (event) => {
      setConnectionState("disconnected");
      term.writeln(`\r\n\x1b[31m● Disconnected (code: ${event.code})\x1b[0m\r\n`);
    };

    ws.onerror = () => {
      setConnectionState("error");
      setErrorMessage("Connection failed");
      term.writeln("\r\n\x1b[31m● Connection error\x1b[0m\r\n");
    };

    // Pipe terminal input → WebSocket
    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
        setLastActivityTime(Date.now());
      }
    });

    // Handle terminal resize
    term.onResize(({ cols, rows }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols, rows }));
      }
    });
  }, [labId, courseId, token, wsUrl]);

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      if (fitAddonRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch {
          // Ignore fit errors during teardown
        }
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
    };
  }, []);

  function disconnect() {
    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
      wsRef.current = null;
    }
    setConnectionState("disconnected");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TerminalConnectionStatus
            state={connectionState}
            labName={labName}
            errorMessage={errorMessage}
          />
          {activeTimeoutMs > 0 && (
            <TerminalTimer
              timeoutMs={activeTimeoutMs}
              lastActivityTime={lastActivityTime}
              isConnected={connectionState === "connected"}
            />
          )}
        </div>
        <div className="flex gap-2">
          {connectionState === "disconnected" || connectionState === "error" ? (
            <button
              onClick={connect}
              className="text-xs px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              Connect
            </button>
          ) : connectionState === "connected" ? (
            <button
              onClick={disconnect}
              className="text-xs px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Disconnect
            </button>
          ) : null}
        </div>
      </div>
      <div
        ref={terminalRef}
        className="rounded-md overflow-hidden border border-[#313244]"
        style={{ minHeight: "300px", background: "#1e1e2e" }}
      />
    </div>
  );
}
