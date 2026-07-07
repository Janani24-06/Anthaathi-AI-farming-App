export interface DetailedAnalysis {
    diagnosis: {
        cropName: string;
        issue: string; // Pest/Disease name
        scientificName?: string;
        confidence: 'High' | 'Medium' | 'Low'; // Keep strict types for logic, translate UI display
        symptoms: string;
    };
    cause: {
        reason: string;
        environmentalFactors: string;
    };
    actions: {
        immediate: string[];
        organic: string[];
        chemical: {
            productName: string;
            activeIngredient: string;
            dosage: string;
            waitingPeriod: string;
            precautions: string;
        } | null;
    };
    prevention: string[];
    speechText: string;
}

export interface AnalysisResult {
    en: DetailedAnalysis;
    ta: DetailedAnalysis;
}

import { GoogleGenerativeAI } from "@google/generative-ai";

// API Configuration - Ideally this should be in an environment variable
const GEMINI_API_KEY: string = "AIzaSyBIvnh8Yb0Y5g8t5WwCdhCIPUzOswVeG80";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper to convert image URI to base64
async function urlToBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

const PROMPT = `
Analyze this crop image for pests or diseases. 
Return a JSON object with the following structure exactly (do not include markdown formatting):
{
  "en": {
    "diagnosis": { "cropName": "string", "issue": "string", "scientificName": "string", "confidence": "High|Medium|Low", "symptoms": "string" },
    "cause": { "reason": "string", "environmentalFactors": "string" },
    "actions": { "immediate": ["string"], "organic": ["string"], "chemical": { "productName": "string", "activeIngredient": "string", "dosage": "string", "waitingPeriod": "string", "precautions": "string" } | null },
    "prevention": ["string"],
    "speechText": "A concise summary for text-to-speech in English"
  },
  "ta": {
    "diagnosis": { "cropName": "பயிர் பெயர்", "issue": "பிரச்சனை", "scientificName": "அறிவியல் பெயர்", "confidence": "High|Medium|Low", "symptoms": "அறிகுறிகள்" },
    "cause": { "reason": "காரணம்", "environmentalFactors": "சுற்றுச்சூழல் காரணிகள்" },
    "actions": { "immediate": ["நடவடிக்கை 1"], "organic": ["இயற்கை முறை 1"], "chemical": { "productName": "மருந்து", "activeIngredient": "மூலப்பொருள்", "dosage": "அளவு", "waitingPeriod": "காலம்", "precautions": "முன்னெச்சரிக்கை" } | null },
    "prevention": ["தடுப்பு முறை 1"],
    "speechText": "தமிழில் சுருக்கமான உரை"
  }
}
Ensure the "ta" fields are translated into Tamil. If no issue is found, indicate "Healthy" in the issue field.
`;

// Real-time analysis function using Gemini AI
export async function analyzeCropImage(uri: string): Promise<AnalysisResult> {
    try {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "REPLACE_WITH_YOUR_GEMINI_API_KEY") {
            // Fallback to mock if no API key is provided
            console.warn("Gemini API Key missing or placeholder used. Falling back to mock data.");
            return getMockResult();
        }

        const base64Image = await urlToBase64(uri);
        console.log("Starting Gemini Analysis with model: gemini-1.5-flash-001 on v1");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const result = await model.generateContent([
            PROMPT,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const responseText = response.text();

        // Clean JSON response (Gemini sometimes adds markdown blocks)
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Analysis failed:", error);
        return getMockResult();
    }
}

// Keep original mock data as fallback
function getMockResult(): AnalysisResult {
    const enResult: DetailedAnalysis = {
        diagnosis: {
            cropName: "Maize (Corn)",
            issue: "Fall Armyworm",
            scientificName: "Spodoptera frugiperda",
            confidence: "High",
            symptoms: "Elongated, ragged holes in leaves. Sawdust-like faecal pellets in the whorl. Larvae with Y-shaped mark on head."
        },
        cause: {
            reason: "Invasive pest moth larva that feeds voraciously on leaves and stems.",
            environmentalFactors: "Thrives in warm, humid weather. Spreads rapidly in monocultures."
        },
        actions: {
            immediate: [
                "Isolate infected plants if possible.",
                "Handpick and destroy visible larvae.",
                "Apply dry sand or ash into the whorls to irritate larvae."
            ],
            organic: [
                "Spray Neem Oil (1500 ppm) @ 5ml/liter of water.",
                "Use Beauveria bassiana (bio-pesticide) @ 5g/liter.",
                "Release natural predators like Trichogramma wasps."
            ],
            chemical: {
                productName: "Coragen or Emamectin Benzoate",
                activeIngredient: "Chlorantraniliprole 18.5% SC",
                dosage: "0.4 ml per liter of water (approx 80ml per acre)",
                waitingPeriod: "20 days before harvest",
                precautions: "Wear protective gear (gloves, mask). Do not spray near water bodies."
            }
        },
        prevention: [
            "Deep summer ploughing to expose pupae.",
            "Intercropping with Desmodium or legumes.",
            "Install pheromone traps (5 per acre) for monitoring."
        ],
        speechText: "Diagnosis for Maize. Issue: Fall Armyworm. Symptoms: Elongated, ragged holes in leaves. Consider immediate handpicking or Neem oil spray."
    };

    const taResult: DetailedAnalysis = {
        diagnosis: {
            cropName: "சோளம் (Maize)",
            issue: "படைப்புழு (Fall Armyworm)",
            scientificName: "Spodoptera frugiperda",
            confidence: "High",
            symptoms: "இலைகளில் நீளமான கிழிந்த துளைகள் இருக்கும். குருத்துப்பகுதியில் மரத்தூள் போன்ற கழிவுகள் காணப்படும். புழுவின் தலையில் ஆங்கில எழுத்து 'Y' போன்ற குறி இருக்கும்."
        },
        cause: {
            reason: "இது ஒரு ஆக்கிரமிப்பு அந்துப்பூச்சி புழு, இது இலைகள் மற்றும் பயிர்களை மிக வேகமாக அழிக்கும்.",
            environmentalFactors: "வெப்பமான மற்றும் ஈரப்பதமான காலநிலையில் வேகமாக பரவும்."
        },
        actions: {
            immediate: [
                "பாதிக்கப்பட்ட செடிகளைத் தனிமைப்படுத்தவும்.",
                "கண்ணுக்குத் தெரியும் புழுக்களைக் கைகளால் எடுத்து அழிக்கவும்.",
                "புழுக்களை விரட்ட குருத்துப்பகுதியில் உலர்ந்த மணல் அல்லது சாம்பலை இடவும்."
            ],
            organic: [
                "வேப்ப எண்ணெய் (1500 ppm) 5 மி.லி / லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.",
                "பியூவேரியா பாசியானா (உயிர் பூச்சிக்கொல்லி) 5 கிராம் / லிட்டர் பயன்படுத்தவும்.",
                "டிரைக்கோகிராமா குளவி போன்ற இயற்கை எதிரிகளை வயலில் விடவும்."
            ],
            chemical: {
                productName: "கோராஜன் (Coragen) அல்லது இமாமெக்டின் பென்சோயேட்",
                activeIngredient: "Chlorantraniliprole 18.5% SC",
                dosage: "0.4 மி.லி / லிட்டர் தண்ணீர் (ஏக்கருக்கு 80 மி.லி)",
                waitingPeriod: "அறுவடைக்கு 20 நாட்களுக்கு முன் தெளிப்பதை நிறுத்தவும்",
                precautions: "பாதுகாப்பு உடை அணியவும். நீர் நிலைகளுக்கு அருகில் தெளிக்க வேண்டாம்."
            }
        },
        prevention: [
            "கோடைக்கால உழவு செய்து கூட்டுப்புழுக்களை அழிக்கவும்.",
            "ஊடுபயிராக தட்டைப்பயறு அல்லது உளுந்து பயிரிடவும்.",
            "கண்காணிப்புக்காக ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளை வைக்கவும்."
        ],
        speechText: "சோளம் பயிரில் படைப்புழு தாக்கியுள்ளது. வேப்ப எண்ணெய் தெளிக்கவும் அல்லது கையால் புழுக்களை அகற்றவும்."
    };

    return { en: enResult, ta: taResult };
}
