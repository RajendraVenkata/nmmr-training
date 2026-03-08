"use client";

import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "./ChatProvider";

export function ChatButton() {
  const { isOpen, toggleChat } = useChat();

  return (
    <motion.button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={isOpen ? "Close chat" : "Open chat"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <X className="h-6 w-6" />
          </motion.span>
        ) : (
          <motion.span
            key="chat"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40" />
      )}
    </motion.button>
  );
}
