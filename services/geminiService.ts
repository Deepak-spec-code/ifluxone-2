
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const getChatSession = (isThinkingMode: boolean): Chat => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const model = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config = isThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
    
    return ai.chats.create({
        model,
        config,
    });
};

export const streamGeminiResponse = async (
    messages: ChatMessage[],
    isThinkingMode: boolean,
    onChunk: (chunk: string) => void
): Promise<void> => {
    try {
        const userMessage = messages[messages.length - 1];
        if (!userMessage || userMessage.role !== 'user') {
            throw new Error("Last message must be from the user.");
        }
        
        // In a real app with history, you'd seed the chat session differently.
        // For this implementation, we'll start a new chat for each query to keep it simple.
        const chat = getChatSession(isThinkingMode);

        const result = await chat.sendMessageStream({ message: userMessage.content });

        for await (const chunk of result) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error streaming Gemini response:", error);
        onChunk("Sorry, I encountered an error. Please try again.");
    }
};
