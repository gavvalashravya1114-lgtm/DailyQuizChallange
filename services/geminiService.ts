import { GoogleGenAI, Type } from "@google/genai";
import { QuizData } from '../types';

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    quiz: {
      type: Type.ARRAY,
      description: "An array of 10 quiz questions on topics like science, history, general knowledge, space, and technology.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The quiz question."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 multiple-choice options.",
            items: {
              type: Type.STRING
            }
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer, which must be one of the provided options."
          },
          difficulty: {
            type: Type.STRING,
            description: "The question's difficulty level: 'easy', 'medium', or 'hard'."
          },
          explanation: {
            type: Type.STRING,
            description: "A brief explanation for why the correct answer is correct."
          }
        },
        required: ["question", "options", "correctAnswer", "difficulty", "explanation"]
      }
    }
  },
  required: ["quiz"]
};


export const generateDailyQuiz = async (): Promise<QuizData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a new daily quiz with exactly 10 questions for two rounds. Questions should cover varied topics like science, history, general knowledge, space, and technology. The quiz must have a balanced difficulty across the 10 questions. Each question must have 4 multiple-choice options and a brief explanation for the correct answer.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 1, // Higher temperature for more variety in daily quizzes
      },
    });

    const jsonText = response.text.trim();
    const quizData: QuizData = JSON.parse(jsonText);
    
    if (quizData.quiz?.length !== 10) {
      throw new Error("Generated quiz does not have 10 questions.");
    }

    return quizData;

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate a new quiz. Please try again later.");
  }
};