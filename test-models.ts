import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCh3DABRiWWuqRm6LBDCfvRefjrnfaOX90";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available models:", data.models?.map((m: any) => m.name).filter((n: string) => n.includes("gemini")));
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

listModels();
