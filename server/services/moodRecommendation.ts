import { analyzeEmotion } from "./emotionEngine";
import { recommendSongs } from "./recommendationEngine";
import { songs } from "../data/songs";


export function recommendByText(
  text: string
) {

  // 1. 감정 분석
  const emotion =
    analyzeEmotion(text);


  // 2. 추천 엔진 실행
  const recommendations =
    recommendSongs(
      emotion,
      songs,
      5
    );


  return {
    emotion,
    recommendations
  };
}
