const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// Set the API key using Firebase environment configuration:
// firebase functions:config:set google.apikey="YOUR_API_KEY"
const API_KEY = functions.config().google.apikey;

exports.getAiRecipeSuggestion = functions.https.onRequest(async (req, res) => {
    // Enable CORS for all origins
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    const { goal, calories, proteins, carbs, fats } = req.body;

    if (!goal || !calories || !proteins || !carbs || !fats) {
        res.status(400).send({ error: "Missing required nutritional data." });
        return;
    }

    if (!API_KEY) {
        console.error("API key is not configured. Set it with 'firebase functions:config:set google.apikey=...'");
        res.status(500).send({ error: "The server is missing its API key." });
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const prompt = `
    Your task is to generate a recipe based on specific nutritional targets.
    The user's goal is: "${goal}".
    The recipe should be for a single meal and meet these approximate targets:
    - Calories: ${calories}
    - Protein: ${proteins}g
    - Carbohydrates: ${carbs}g
    - Fat: ${fats}g

    Please provide a recipe that matches these criteria.
    The response must be a single, valid JSON object. Do not include any text before or after the JSON object.
    The JSON object must have the following structure:
    {
      "title": "string",
      "description": "string",
      "calories": number,
      "nutrients": "string (formatted as 'P : XX g, G : YY g, L : ZZ g')",
      "ingredients": ["string"],
      "steps": ["string"]
    }
    All text should be in French.
    `;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.7,
        }
    };

    try {
        const response = await axios.post(url, requestBody);

        // With response_mime_type set to application/json, the response text should be a valid JSON string.
        const recipeJsonText = response.data.candidates[0].content.parts[0].text;
        const recipe = JSON.parse(recipeJsonText);

        res.status(200).json(recipe);

    } catch (error) {
        console.error("Error calling Google AI API:", error.response ? error.response.data : error.message);
        res.status(500).send({ error: "Failed to generate recipe from AI." });
    }
});
