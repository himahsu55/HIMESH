import { GoogleGenAI } from "@google/genai";
import type { AppMode } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function runCodeQuery(mode: AppMode, prompt: string, code: string): Promise<string> {
    
    let fullPrompt: string;

    if (mode === 'explain') {
        fullPrompt = `
You are an expert Python code assistant. Your task is to analyze the user's request and the provided Python code.

User Request: ${prompt}

Python Code:
\`\`\`python
${code}
\`\`\`

Provide a comprehensive response in Markdown format. If the user asks for an explanation, explain the code's logic, its purpose, and how it works. If they ask for improvements, suggest specific, actionable changes to enhance readability, performance, or adherence to best practices. Always include improved code snippets where applicable.
        `;
    } else { // 'generate' mode
        fullPrompt = `
You are an expert Python code generator. Your task is to generate a complete, functional Python script based on the user's request.

User Request: ${prompt}

Generate the Python code that fulfills this request. The code should be well-commented, follow Python best practices (PEP 8), and be ready to run. Provide the code within a single Markdown code block. You may add a brief explanation of how the code works after the code block.
        `;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get response from Gemini API: ${error.message}`);
        }
        throw new Error("An unknown error occurred while contacting the Gemini API.");
    }
}
