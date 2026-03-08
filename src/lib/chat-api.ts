import type { ChatMessage } from "@/types";

interface ChatAPIRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  leadName?: string;
}

interface ChatAPIResponse {
  content: string;
  provider: string;
  error?: string;
}

/**
 * Sends the conversation to the nmmr-api Azure Function backend.
 * Returns the AI response content string.
 * Throws typed errors: "RATE_LIMITED", "TIMEOUT", "API_ERROR_<status>".
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  leadName?: string
): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "https://nmmr-api.azurewebsites.net/api";
  if (!apiUrl) {
    throw new Error("NO_API_URL");
  }

  const request: ChatAPIRequest = {
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    leadName,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15-second timeout

  try {
    const response = await fetch(`${apiUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 429) {
      throw new Error("RATE_LIMITED");
    }

    if (!response.ok) {
      throw new Error(`API_ERROR_${response.status}`);
    }

    const data: ChatAPIResponse = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.content;
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error("TIMEOUT");
      }
      throw err;
    }
    throw new Error("UNKNOWN_ERROR");
  }
}
