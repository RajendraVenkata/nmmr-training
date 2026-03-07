"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ChatMessage, ChatLead } from "@/types";

interface ChatContextType {
  // Widget state
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Lead form
  lead: ChatLead | null;
  setLead: (lead: ChatLead) => void;
  hasSubmittedLead: boolean;

  // Messages
  messages: ChatMessage[];
  addMessage: (role: "user" | "assistant", content: string) => void;
  clearMessages: () => void;

  // AI state
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY_LEAD = "nmmr-chat-lead";
const STORAGE_KEY_MESSAGES = "nmmr-chat-messages";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lead, setLeadState] = useState<ChatLead | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const storedLead = sessionStorage.getItem(STORAGE_KEY_LEAD);
      if (storedLead) {
        setLeadState(JSON.parse(storedLead));
      }
      const storedMessages = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch {
      // sessionStorage unavailable or corrupted — start fresh
    }
    setHydrated(true);
  }, []);

  // Persist lead to sessionStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (lead) {
        sessionStorage.setItem(STORAGE_KEY_LEAD, JSON.stringify(lead));
      }
    } catch {
      // Ignore storage errors
    }
  }, [lead, hydrated]);

  // Persist messages to sessionStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
      }
    } catch {
      // Ignore storage errors
    }
  }, [messages, hydrated]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const setLead = useCallback((newLead: ChatLead) => {
    setLeadState(newLead);
  }, []);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const message: ChatMessage = {
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch {
      // Ignore
    }
  }, []);

  const hasSubmittedLead = lead !== null;

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        lead,
        setLead,
        hasSubmittedLead,
        messages,
        addMessage,
        clearMessages,
        isTyping,
        setIsTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
