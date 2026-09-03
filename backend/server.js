require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/ask", async (req, res) => {

    const question = req.body.question;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer this question briefly and clearly in 2-4 sentences:

            ${question}`

        });

        res.json({
            answer: response.text
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Something went wrong while contacting Gemini."
        });

    }
});

app.listen(7000, () => {
    console.log("Server running on http://localhost:7000");
});