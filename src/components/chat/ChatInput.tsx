"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { useChat } from "./ChatProvider";
import { sendChatMessage } from "@/lib/chat-api";
import { getOfflineResponse } from "@/lib/offline-responder";

export function ChatInput() {
  const { messages, lead, addMessage, isTyping, setIsTyping } = useChat();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || isTyping) return;

    // Add user message
    addMessage("user", trimmed);
    setValue("");
    setIsTyping(true);

    try {
      // Build the full conversation for the API (existing messages + new user message)
      const conversationForApi = [
        ...messages.map((m) => ({ id: m.id, role: m.role, content: m.content, timestamp: m.timestamp })),
        { id: "temp", role: "user" as const, content: trimmed, timestamp: Date.now() },
      ];

      const response = await sendChatMessage(conversationForApi, lead?.name);
      addMessage("assistant", response);
    } catch {
      // Fallback to offline responder on any error
      const fallback = getOfflineResponse(trimmed);
      addMessage("assistant", fallback);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isTyping}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Chat message input"
          style={{ maxHeight: "80px" }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isTyping}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
        Powered by NMMR Technologies
      </p>
    </div>
  );
}
