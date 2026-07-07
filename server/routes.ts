
import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key (Moved to server-side for security and CORS compliance)
const GEMINI_API_KEY = "AIzaSyDowRVlzznodwtUwYrGSU_cfFfEEIe8hUo";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are UZHAVAN AI, a specialized Agricultural Expert assistant for the Nitro Lens app.
Your core mission is to help farmers optimize their crop yields and soil health.

KNOWLEDGE BASE:
1. Nitro Lens Feature: An advanced nitrogen analysis tool that uses satellite imagery (NDVI) and soil sensors to determine crop nutrition needs.
2. Digital Twin Engine: A virtual farm model that allows Live AR Inspection of pest hotspots and VR Walkthroughs for historical and predictive growth analysis.
3. AgroMonitoring Integration: We use real-time satellite data for field mapping and soil diagnostics (moisture, t10 temperature).

GUIDELINES:
- Support both English and Tamil fluently.
- Primary focus: Modern precision agriculture, organic farming, pest management, and fertilizer optimization.
- Tone: Professional, helpful, and practical.
- If a user asks about their "Twin" or "AR", explain how they can use these features in the 'Farm' section.
- For emergency pest alerts, recommend immediate field inspection using the Nitro Lens AR mode.
`;

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const chat = model.startChat({
        history: history || [],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error: any) {
      console.error("Server Chat Error:", error);
      res.status(500).json({
        error: error.message || "Failed to get AI response",
        status: error.status
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
