import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Replace with your new Gemini API key
const GEMINI_API_KEY = "AIzaSyDowRVlzznodwtUwYrGSU_cfFfEEIe8hUo";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are UZHAVAN AI, a professional Agricultural Expert.
Support English and Tamil.
Stay focused on farming topics only.
Provide actionable, practical advice.
`;

// ✅ Correctly typed for Gemini SDK
export interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

export async function getChatResponse(
    message: string,
    history: ChatMessage[] = []
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.6,
            },
        });

        const result = await chat.sendMessage(message);
        const text = result.response.text();

        if (!text || text.trim() === "") {
            return "Please rephrase your question. / உங்கள் கேள்வியை மீண்டும் எழுதவும்.";
        }

        return text;
    } catch (error: any) {
        console.error("=== UZHAVAN AI ERROR ===");
        console.error("Message:", error?.message);
        console.error("Status:", error?.status);
        console.error("=======================");

        const status = error?.status ?? error?.response?.status;

        if (status === 429) {
            return "Uzhavan AI is temporarily busy. Please try again in a moment.";
        }
        if (status === 401 || status === 403) {
            return "API key is invalid or unauthorized. Please check your configuration.";
        }
        if (status === 400) {
            return "Invalid request sent to Uzhavan AI. Please try a different message.";
        }

        return "Unable to connect to Uzhavan AI. Please check your internet connection.";
    }
}

// ✅ Helper to build messages for history
export function buildChatMessage(
    role: "user" | "model",
    text: string
): ChatMessage {
    return {
        role,
        parts: [{ text }],
    };
}