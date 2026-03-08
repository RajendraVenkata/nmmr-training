"use client";

import { useEffect, useRef } from "react";
import { X, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useChat } from "./ChatProvider";
import { ChatLeadForm } from "./ChatLeadForm";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { COMPANY } from "@/lib/constants";

export function ChatWindow() {
  const { isOpen, closeChat, hasSubmittedLead } = useChat();
  const windowRef = useRef<HTMLDivElement>(null);

  // Trap focus within chat window when open
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeChat();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeChat]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 sm:hidden"
        onClick={closeChat}
        aria-hidden="true"
      />

      {/* Chat window */}
      <motion.div
        ref={windowRef}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        role="dialog"
        aria-label="Chat with NMMR Technologies"
        aria-modal="true"
        className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl
          bottom-0 left-0 right-0 top-0
          sm:bottom-24 sm:right-6 sm:left-auto sm:top-auto sm:h-[520px] sm:w-[380px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <MessageCircle className="h-5 w-5 text-white/80" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {COMPANY.shortName}
              </h2>
              <p className="text-xs text-white/60">AI Assistant</p>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body: lead form or chat */}
        {hasSubmittedLead ? (
          <>
            <ChatMessages />
            <ChatInput />
          </>
        ) : (
          <ChatLeadForm />
        )}
      </motion.div>
    </>
  );
}
