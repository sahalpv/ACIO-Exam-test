
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

let ai: GoogleGenAI | null = null;

// This function ensures the API key is available and initializes the client.
// It throws a clear error if the API key is missing.
const getClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }

    // In a browser environment for a static site, `process` is not defined unless a build tool polyfills it.
    // This check prevents a "process is not defined" reference error.
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

    if (!apiKey) {
        throw new Error(
            "Configuration Error: The Gemini API key is missing. " +
            "Please ensure the API_KEY environment variable is set in your hosting environment."
        );
    }
    
    ai = new GoogleGenAI({ apiKey });
    return ai;
};


const questionSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: 'The question text.',
        },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'An array of 4 multiple-choice options.',
        },
        correctAnswer: {
          type: Type.STRING,
          description: 'The correct answer, which must be one of the provided options.',
        },
        explanation: {
            type: Type.STRING,
            description: 'A brief explanation of why the answer is correct.'
        }
      },
      required: ["question", "options", "correctAnswer", "explanation"],
    },
};

const PROMPT = `
You are an expert exam question creator for Indian civil service competitive exams. Generate 50 high-quality multiple-choice questions suitable for the Assistant Central Intelligence Officer-Grade-II/Executive (ACIO-II/Executive) Exam.

The questions should cover a diverse mix of the following topics:
1.  General Knowledge: Current affairs (national and international), Indian History, Indian Polity & Constitution, Geography, Science & Technology.
2.  English Language: Synonyms, Antonyms, Idioms & Phrases, One-word substitution, Sentence completion, Spotting errors.

For each question, provide the required JSON fields. Ensure the difficulty level is appropriate for a graduate-level competitive exam. The options should be plausible to make the questions challenging. Do not repeat questions.
`;


export const generateQuizQuestions = async (): Promise<Question[]> => {
  try {
    const geminiClient = getClient(); // This will throw if the key is missing
    const response = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 0.8,
      },
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI. Please try again.");
    }

    const questions = JSON.parse(jsonText) as Question[];
    return questions;

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    if (error instanceof Error) {
        // Re-throw the original error to be displayed in the UI.
        throw error;
    }
    // Fallback for non-Error exceptions
    throw new Error("An unknown error occurred while generating questions.");
  }
};
