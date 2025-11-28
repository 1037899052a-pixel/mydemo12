
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisData, ClothingItem } from "../types";
import { CLOTHING_ITEMS } from "../constants";

// Helper to convert base64 to proper format if needed
const cleanBase64 = (b64: string) => b64.replace(/^data:image\/\w+;base64,/, "");

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Create a simplified inventory string for the AI context
const INVENTORY_CONTEXT = CLOTHING_ITEMS.filter(item => !item.isCustom).map(item => 
  `- ID: ${item.id}, 名称: ${item.name}, 风格: ${item.category}, 描述: ${item.description}`
).join('\n');

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    bodyType: { type: Type.STRING, description: "Estimated body type" },
    skinTone: { type: Type.STRING, description: "Estimated skin tone" },
    styleAdvice: { type: Type.STRING, description: "General clothing advice" },
    currentOutfitCritique: { type: Type.STRING, description: "Critique of current outfit" },
    trendingNow: { type: Type.STRING, description: "Fashion trends tip" },
    suggestedItemIds: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of exactly 3 Clothing IDs from the provided inventory that would suit the user best."
    }
  },
  required: ["bodyType", "skinTone", "styleAdvice", "currentOutfitCritique", "trendingNow", "suggestedItemIds"],
};

export const analyzeUserImage = async (imageBase64: string): Promise<AnalysisData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64(imageBase64) } },
          { text: `分析这张照片中人物的时尚风格、体型和肤色。
          
          可用的服装库存列表如下：
          ${INVENTORY_CONTEXT}
          
          请从库存中挑选 3 件最适合该用户的服装，并返回其ID到 suggestedItemIds 字段中。
          请用中文回答，语气礼貌且专业。` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisData;
    }
    throw new Error("No analysis generated");
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      bodyType: "未知",
      skinTone: "未知",
      styleAdvice: "无法分析图片，请尝试上传更清晰的照片。",
      currentOutfitCritique: "暂无",
      trendingNow: "暂无",
      suggestedItemIds: []
    };
  }
};

export const generateTryOnImage = async (
  originalImageBase64: string,
  clothingItem: ClothingItem,
  sceneDescription: string,
  pose: string = "自然站立",
  expression: string = "自然微笑"
): Promise<string> => {
  try {
    const parts: any[] = [
       { inlineData: { mimeType: 'image/jpeg', data: cleanBase64(originalImageBase64) } }
    ];

    let prompt = "";

    // If custom clothing with an image, add it to parts
    if (clothingItem.isCustom && clothingItem.image.startsWith('data:')) {
       parts.push({ inlineData: { mimeType: 'image/jpeg', data: cleanBase64(clothingItem.image) } });
       prompt = `
       任务：生成一张高质量的写实人像照片。
       
       输入说明：
       - 第一张图片：原始模特图（参考人物ID）。
       - 第二张图片：目标服装图（参考服装样式）。
       
       生成要求：
       1. **严格保持人物身份（ID Consistency）**：
          - 必须完全保留第一张图中人物的面部特征、五官比例、脸型和肤色。
          - **重要**：生成的脸必须与原图中的人完全一致，不能发生"换脸"或长相改变。仅允许根据动作和表情指令进行自然的肌肉动态调整。
       
       2. **服装与动作融合**：
          - 让模特穿上第二张图中的衣服。
          - 模特的动作调整为：${pose}。
          - 模特的表情调整为：${expression}。
       
       3. **场景与画质**：
          - 背景环境：${sceneDescription}。
          - 风格：4K高清写实摄影，光影逼真，皮肤纹理自然。
       `;
    } else {
       // Standard catalog item
       prompt = `
       任务：生成一张高质量的写实人像照片。
       
       输入说明：
       - 图片：原始模特图（参考人物ID）。
       
       生成要求：
       1. **严格保持人物身份（ID Consistency）**：
          - 必须完全保留原图中人物的面部特征、五官比例、脸型和肤色。
          - **重要**：生成的脸必须与原图中的人完全一致，不能发生"换脸"或长相改变。仅允许根据动作和表情指令进行自然的肌肉动态调整。
       
       2. **服装与动作融合**：
          - 将模特的服装替换为：${clothingItem.name}。
          - 服装细节描述：${clothingItem.description}。
          - 模特的动作调整为：${pose}。
          - 模特的表情调整为：${expression}。
       
       3. **场景与画质**：
          - 背景环境：${sceneDescription}。
          - 风格：4K高清写实摄影，光影逼真，皮肤纹理自然。
       `;
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: { parts: parts },
    });

    if (response.candidates && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
           return `data:image/jpeg;base64,${part.inlineData.data}`;
         }
       }
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Try-on generation failed:", error);
    throw error;
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], newMessage: string) => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `你是一位世界级的时尚造型师助手，名叫 阿猫阿春。
            
            这是你目前可以调用的服装库存：
            ${INVENTORY_CONTEXT}
            
            当用户询问建议或让你推荐衣服时，请从库存中挑选最合适的。
            **重要：如果你推荐了库存中的某件具体衣服，请务必在回复中包含该衣服的ID，格式为：[[ID]]。**
            例如："我觉得 [[c1]] 很适合你，或者你可以试试 [[f2]]。"
            
            请务必使用中文回答，保持对话简短、时尚且有帮助。`,
        },
        history: history as any
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
}
