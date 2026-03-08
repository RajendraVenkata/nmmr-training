import { COMPANY } from "@/lib/constants";

/**
 * Offline keyword-matching responder.
 * Used as a fallback when the AI backend is unavailable or when
 * NEXT_PUBLIC_CHAT_API_URL is not configured.
 */
export function getOfflineResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (
    lower.includes("pricing") ||
    lower.includes("cost") ||
    lower.includes("price")
  ) {
    return `Our course pricing varies by depth and duration. Browse our full catalog at /courses, or reach us at ${COMPANY.email} for group discounts and enterprise training packages.`;
  }

  if (lower.includes("course") || lower.includes("what do you offer")) {
    return "We offer hands-on courses in Generative AI, Agentic AI, Prompt Engineering, AI Development, and more. Each course includes real-world projects and expert instruction. Visit /courses to explore!";
  }

  if (
    lower.includes("genai") ||
    lower.includes("generative") ||
    lower.includes("llm")
  ) {
    return "Our GenAI courses cover LLM fundamentals, prompt engineering, RAG implementations, fine-tuning, and building AI-powered applications. Want me to point you to a specific course?";
  }

  if (
    lower.includes("agent") ||
    lower.includes("agentic") ||
    lower.includes("autonomous")
  ) {
    return "Our Agentic AI courses teach you to build autonomous agents, multi-agent systems, tool-use patterns, and workflow automation. From beginner to advanced — we have you covered!";
  }

  if (
    lower.includes("certificate") ||
    lower.includes("certification")
  ) {
    return "Yes! You receive a certificate of completion for each course you finish. Certificates can be shared on LinkedIn and added to your resume.";
  }

  if (
    lower.includes("beginner") ||
    lower.includes("start") ||
    lower.includes("new to ai")
  ) {
    return "Great place to start! Check out our beginner-friendly courses at /courses?difficulty=beginner. No prior AI experience needed — we'll guide you step by step.";
  }

  if (
    lower.includes("contact") ||
    lower.includes("email") ||
    lower.includes("phone") ||
    lower.includes("reach")
  ) {
    return `You can reach us at ${COMPANY.email} or visit our Contact page at /contact. We typically respond within 24 hours!`;
  }

  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey") ||
    lower.includes("good morning") ||
    lower.includes("good afternoon")
  ) {
    return "Hello! How can I help you today? Feel free to ask about our AI courses, pricing, or anything else about NMMR Training.";
  }

  if (lower.includes("thank") || lower.includes("thanks")) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  if (lower.includes("bye") || lower.includes("goodbye")) {
    return `Thanks for chatting! Feel free to come back anytime. You can also reach us at ${COMPANY.email} for detailed discussions.`;
  }

  // Default response
  return `That's a great question! For detailed information, I'd recommend reaching out to our team directly. You can contact us at ${COMPANY.email} or visit our Contact page. Is there anything specific about our AI courses I can help with?`;
}
