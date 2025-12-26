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
    const modelId = "gemini-3-flash-preview"; 

    const prompt = `Generate a full Jeopardy game board for the topic: "${customTopic}".
      Required JSON structure:
      {
        "categories": [
          {
            "title": "Category Name",
            "questions": [
              {"value": 200, "clue": "Statement...", "answer": "What is...?"},
              ... (total 5 questions: 200, 400, 600, 800, 1000)
            ]
          }
          ... (total 5 categories)
        ],
        "finalJeopardy": {
          "category": "Final Category",
          "clue": "Final Clue",
          "answer": "Final Answer"
        }
      }
      Strictly follow the topic "${customTopic}". Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
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
    
    throw new Error("No response text returned.");

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
      contents: `Short hint (max 10 words) for: Clue: "${clue}", Answer: "${answer}". Do not reveal the answer.`,
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