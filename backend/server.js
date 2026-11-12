require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const cors = require("cors");

const app = express();
app.use(cors());

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

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});