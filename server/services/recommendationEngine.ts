import { songs } from "../data/songs";


export type Mood =
  | "calm"
  | "energetic"
  | "happy"
  | "nostalgic"
  | "romantic"
  | "sad"
  | "tired";


export interface RecommendationInput {

  mood?: Mood | string;

  energy?: number;

}



export interface Song {

  id:number;

  title:string;

  artist:string;

  youtubeId:string;

  thumbnail:string;

  moods:Mood[];

  energy:number;

  genres:string[];

  tags:string[];

  score:number;

}




function normalizeMood(
  mood?:string
):Mood {


  switch(mood){

    case "sad":
    case "우울":
    case "슬픔":
      return "sad";


    case "happy":
    case "행복":
      return "happy";


    case "excited":
    case "신남":
    case "energetic":
      return "energetic";


    case "calm":
    case "차분":
    case "휴식":
      return "calm";


    case "romantic":
    case "설렘":
      return "romantic";


    case "nostalgic":
    case "그리움":
      return "nostalgic";


    default:
      return "calm";

  }

}




export function recommendSongs(

  input: RecommendationInput

):Song {


  const mood =
    normalizeMood(
      input.mood
    );


  const energy =
    input.energy ?? 50;



  let candidates = songs.filter(
    song =>
      song.moods?.includes(mood)
  );



  if(candidates.length === 0){

    candidates = songs;

  }




  candidates =
    candidates
    .map(song=>({

      ...song,

      score:

        Math.max(

          0,

          100 -

          Math.abs(
            song.energy - energy
          )

        )

    }))

    .sort(

      (a,b)=>

        b.score-a.score

    );





  const result =
    candidates[0];



  return {

    ...result,

    score:
      result.score ?? 80,

  };

}






// 이전 text 추천 호환용
export function recommendByText(

  text:string

):Song {


  const lower =
    text.toLowerCase();



  let mood:Mood =
    "calm";



  if(
    lower.includes("슬퍼") ||
    lower.includes("힘들") ||
    lower.includes("우울")
  ){

    mood="sad";

  }


  else if(
    lower.includes("행복") ||
    lower.includes("좋아")
  ){

    mood="happy";

  }


  else if(
    lower.includes("신나") ||
    lower.includes("에너지")
  ){

    mood="energetic";

  }



  return recommendSongs({

    mood,

    energy:50

  });


}