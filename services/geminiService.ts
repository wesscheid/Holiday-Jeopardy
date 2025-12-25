import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GameData } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API Key is missing. Please set the API_KEY secret in your deployment settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateGameData = async (customTopic: string = "Christmas Traditions"): Promise<GameData> => {
  try {
    const ai = getClient();
    // Using Pro for better following of custom topic instructions
    const modelId = "gemini-3-pro-preview"; 

    const prompt = `Task: Generate a completely new and unique Jeopardy-style game board based on the topic: "${customTopic}". 
      
      Requirements:
      1. Create exactly 5 distinct categories that are highly relevant to "${customTopic}". 
      2. Each category must contain 5 clues with values 200, 400, 600, 800, 1000.
      3. Create 1 "Final Jeopardy" clue.
      4. Clues should be challenging but fun.
      5. Output MUST be valid JSON.
      
      Ensure the clues and categories are strictly about "${customTopic}" and not general Christmas questions unless the topic is general.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        value: { type: Type.INTEGER },
                        clue: { type: Type.STRING },
                        answer: { type: Type.STRING },
                      },
                      required: ["value", "clue", "answer"],
                    },
                  },
                },
                required: ["title", "questions"],
              },
            },
            finalJeopardy: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                clue: { type: Type.STRING },
                answer: { type: Type.STRING },
              },
              required: ["category", "clue", "answer"],
            },
          },
          required: ["categories", "finalJeopardy"],
        },
      },
    });

    const text = response.text;
    if (text) {
      let cleanJson = text.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
      }
      
      const data = JSON.parse(cleanJson) as GameData;
      const timestamp = Date.now();
      
      data.categories = data.categories.map((cat, catIdx) => ({
        ...cat,
        id: `cat-${catIdx}-${timestamp}`,
        questions: (cat.questions || []).map((q, qIdx) => ({
          ...q,
          id: `q-${catIdx}-${qIdx}-${timestamp}`,
          isAnswered: false
        }))
      }));

      return data;
    }
    
    throw new Error("No text returned from AI.");

  } catch (error) {
    console.error("Board generation failed:", error);
    throw error;
  }
};

export const generateHint = async (clue: string, answer: string): Promise<string> => {
  try {
    const ai = getClient();
    const modelId = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Provide a short, subtle hint (max 12 words) for this Jeopardy clue: "${clue}". The answer is "${answer}". Do not reveal the answer.`,
    });

    return response.text || "No hint available.";
  } catch (error) {
    return "Think about the theme!";
  }
};

export const speakText = async (text: string): Promise<AudioBuffer | null> => {
  try {
    const ai = getClient();
    const modelId = "gemini-2.5-flash-preview-tts";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const bytes = decode(base64Audio);
    return await decodeAudioData(bytes, outputAudioContext, 24000, 1);

  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}