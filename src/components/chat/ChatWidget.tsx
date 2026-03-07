"use client";

import { AnimatePresence } from "framer-motion";
import { ChatProvider, useChat } from "./ChatProvider";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";

function ChatWidgetInner() {
  const { isOpen } = useChat();

  return (
    <>
      <AnimatePresence>{isOpen && <ChatWindow />}</AnimatePresence>
      <ChatButton />
    </>
  );
}

export function ChatWidget() {
  // Feature flag — only render if enabled
  if (process.env.NEXT_PUBLIC_CHAT_ENABLED === "false") {
    return null;
  }

  return (
    <ChatProvider>
      <ChatWidgetInner />
    </ChatProvider>
  );
}
