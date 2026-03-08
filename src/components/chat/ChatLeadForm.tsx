"use client";

import { useState } from "react";
import { User, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChat } from "./ChatProvider";
import { COMPANY } from "@/lib/constants";

export function ChatLeadForm() {
  const { setLead, addMessage } = useChat();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  function validate(): boolean {
    const newErrors: { name?: string; mobile?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    const cleanMobile = mobile.replace(/[\s\-()]/g, "");
    if (!cleanMobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?\d{7,15}$/.test(cleanMobile)) {
      newErrors.mobile = "Enter a valid mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const trimmedName = name.trim();
    setLead({ name: trimmedName, mobile: mobile.trim() });

    // Add welcome message from AI
    addMessage(
      "assistant",
      `Hi ${trimmedName}! Welcome to ${COMPANY.shortName}. I'm here to help you with our AI training courses — Generative AI, Agentic AI, Prompt Engineering, and more. What can I help you with today?`
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Let&apos;s get started
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us a bit about yourself so we can assist you better.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chat-name" className="text-sm font-medium">
            Your Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="chat-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className="pl-10"
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat-mobile" className="text-sm font-medium">
            Mobile Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="chat-mobile"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
              }}
              className="pl-10"
              autoComplete="tel"
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-destructive">{errors.mobile}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white hover:bg-primary/90"
        >
          Start Chat
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
