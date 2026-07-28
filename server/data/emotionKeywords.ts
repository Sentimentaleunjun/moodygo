import type { Mood } from "./mood";

export const emotionKeywords: Record<Mood, string[]> = {
  happy: [
    "행복",
    "좋아",
    "기분 좋아",
    "즐거워",
    "신나"
  ],

  sad: [
    "슬퍼",
    "우울",
    "눈물",
    "외로워",
    "힘들어"
  ],

  calm: [
    "차분",
    "평온",
    "조용",
    "편안"
  ],

  energetic: [
    "신나",
    "흥분",
    "폭발",
    "놀고싶어",
    "달리고싶어"
  ],

  tired: [
    "지쳤어",
    "피곤",
    "힘들어",
    "아무것도 하기 싫",
    "쉬고싶어"
  ],

  romantic: [
    "사랑",
    "설레",
    "보고싶어",
    "두근"
  ],

  nostalgic: [
    "추억",
    "그리워",
    "옛날",
    "생각나"
  ]
};
