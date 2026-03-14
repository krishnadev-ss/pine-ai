import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generate a chat completion from Gemini.
 */
export async function geminiChat(
  systemPrompt: string,
  userMessage: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt
  });

  // Build conversation history for Gemini
  // Gemini requires the first message in history to be from the 'user'
  let chatHistory = history.map((msg) => ({
    role: msg.role === "agent" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // Strip leading 'model' messages to satisfy Gemini's strict history rules
  while (chatHistory.length > 0 && chatHistory[0].role === "model") {
    chatHistory.shift();
  }

  // If after stripping, the history is basically just the current user message, 
  // we might not need to pass it into `history` if it causes duplication.
  // Actually, chat.sendMessage() takes the *current* user message separately.
  // So the history should only contain *previous* turns.
  // We should also remove the last 'user' message from history if the caller included it.
  if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].parts[0].text === userMessage) {
    chatHistory.pop();
  }

  const chat = model.startChat({
    history: chatHistory,
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}

/**
 * Single-shot generation (used for classification).
 */
export async function geminiGenerate(
  systemPrompt: string,
  input: string
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: input }] }],
  });

  return result.response.text();
}
