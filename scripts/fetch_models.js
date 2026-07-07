async function checkRealModels() {
    const apiKey = "AIzaSyBIvnh8Yb0Y5g8t5WwCdhCIPUzOswVeG80";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
        } else {
            console.log("No models returned. Response:", JSON.stringify(data));
        }
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

checkRealModels();
