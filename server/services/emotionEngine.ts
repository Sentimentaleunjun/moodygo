import type { Mood } from "../data/mood";
import { emotionKeywords } from "../data/emotionKeywords";


export interface EmotionScores {

  happy:number;

  sad:number;

  calm:number;

  energetic:number;

  tired:number;

  romantic:number;

  nostalgic:number;

}



export interface EmotionResult {

  mood:Mood;

  energy:number;

  intensity:number;

  scores:EmotionScores;

}



function detectMoodScores(
  text:string
):EmotionScores {


  const scores:EmotionScores = {

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


      if(
        text.includes(keyword)
      ){

        scores[mood as Mood]++;

      }


    });


  }



  return scores;

}





function getPrimaryMood(
  scores:EmotionScores
):Mood {


  return Object.entries(scores)

    .sort(
      (a,b)=>b[1]-a[1]
    )[0][0] as Mood;


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







function normalizeScores(
  scores:EmotionScores
):EmotionScores {


  const total =
    Object.values(scores)
      .reduce(
        (a,b)=>a+b,
        0
      );



  if(total===0){

    return {

      happy:0,
      sad:0,
      calm:0,
      energetic:0,
      tired:0,
      romantic:0,
      nostalgic:0

    };

  }



  return {

    happy:
      Math.round(
        scores.happy / total * 100
      ),


    sad:
      Math.round(
        scores.sad / total * 100
      ),


    calm:
      Math.round(
        scores.calm / total * 100
      ),


    energetic:
      Math.round(
        scores.energetic / total * 100
      ),


    tired:
      Math.round(
        scores.tired / total * 100
      ),


    romantic:
      Math.round(
        scores.romantic / total * 100
      ),


    nostalgic:
      Math.round(
        scores.nostalgic / total * 100
      )

  };

}







export function analyzeEmotion(
  text:string
):EmotionResult {


  const rawScores =
    detectMoodScores(text);



  const scores =
    normalizeScores(
      rawScores
    );



  const mood =
    getPrimaryMood(
      rawScores
    );



  return {

    mood,


    energy:
      estimateEnergy(
        mood
      ),


    intensity:
      Math.max(
        ...Object.values(scores)
      ),


    scores

  };


}