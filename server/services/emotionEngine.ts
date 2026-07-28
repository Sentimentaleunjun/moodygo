import type { Mood } from "../data/mood";
import { emotionKeywords } from "../data/emotionKeywords";


export interface EmotionResult {
  mood: Mood;
  energy: number;
  intensity: number;
}


function detectMood(text:string): Mood {

  const scores: Record<Mood, number> = {
    happy:0,
    sad:0,
    calm:0,
    energetic:0,
    tired:0,
    romantic:0,
    nostalgic:0
  };


  for(const mood in emotionKeywords){

    const keywords =
      emotionKeywords[mood as Mood];


    keywords.forEach(keyword=>{

      if(text.includes(keyword)){
        scores[mood as Mood]++;
      }

    });
  }


  return Object.entries(scores)
    .sort((a,b)=>b[1]-a[1])[0][0] as Mood;
}


function estimateEnergy(
  mood:Mood
):number {

  const energyMap:Record<Mood,number> = {

    happy:70,
    sad:30,
    calm:25,
    energetic:90,
    tired:20,
    romantic:45,
    nostalgic:40

  };


  return energyMap[mood];
}



export function analyzeEmotion(
  text:string
):EmotionResult {


  const mood =
    detectMood(text);


  return {
    mood,

    energy:
      estimateEnergy(mood),

    intensity:70
  };
}
