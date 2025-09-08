
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 0.8,
      },
    });
    
    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText) as Question[];
    return questions;

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions. Please check your API key and try again.");
  }
};
