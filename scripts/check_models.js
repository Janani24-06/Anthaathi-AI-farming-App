const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyAPWYoCqaXTE2GyMyHgTcasHzoohPyKroQ");
        // The SDK doesn't have a direct listModels, we usually use the REST API for that
        // but we can try to initialize some common ones and see if they fail on construction
        const models = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro-vision"
        ];

        console.log("Checking model availability...");
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                console.log(`- ${modelName}: Initialized (checking support...)`);
            } catch (e) {
                console.log(`- ${modelName}: Failed to initialize: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
