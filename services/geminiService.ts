
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async evaluateSpeaking(targetWord: string, transcript: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `NHIỆM VỤ: So sánh từ mục tiêu và từ người dùng thực sự nói.
        Từ mục tiêu: "${targetWord}"
        Người dùng nói: "${transcript}"
        
        QUY TẮC CHẤM ĐIỂM CỰC KỲ KHẮT KHE:
        1. Nếu transcript khác hoàn toàn về mặt ngữ nghĩa hoặc âm thanh (ví dụ: "knowledge" thay vì "hello"), điểm (score) BẮT BUỘC PHẢI LÀ 0.
        2. Nếu chỉ sai một chút âm cuối hoặc trọng âm, điểm từ 50-80.
        3. Chỉ cho 100 điểm nếu hai từ trùng khớp hoàn toàn.
        
        Trả về JSON: 
        {
          "score": number (0-100),
          "feedback": "chuỗi tiếng Việt ngắn gọn, nhận xét thẳng thắn",
          "correction": "chuỗi tiếng Việt hướng dẫn cách đọc đúng"
        }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            correction: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      }
    });
    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { score: 0, feedback: "AI không hiểu bạn nói gì.", correction: "" };
    }
  },

  async generateStory(words: string[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Hãy viết một câu chuyện cực ngắn (3 câu) bằng tiếng Việt sử dụng: ${words.join(', ')}. In đậm các từ này.`,
      config: {
        systemInstruction: "Bạn là giáo viên kể chuyện. Viết phong cách hài hước, hiện đại."
      }
    });
    return response.text;
  }
};
