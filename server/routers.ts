import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";
import { userPreferences } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

const MOOD_SONGS: Record<
  string,
  Array<{
    title: string;
    artist: string;
  }>
> = {
  sad: [
    {
      title: "Someone Like You",
      artist: "Adele",
    },
    {
      title: "The Night We Met",
      artist: "Lord Huron",
    },
    {
      title: "Fix You",
      artist: "Coldplay",
    },
    {
      title: "The Scientist",
      artist: "Coldplay",
    },
  ],

  excited: [
    {
      title: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
    },
    {
      title: "Dynamite",
      artist: "BTS",
    },
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
    },
  ],

  happy: [
    {
      title: "Happy",
      artist: "Pharrell Williams",
    },
    {
      title: "Here Comes the Sun",
      artist: "The Beatles",
    },
  ],

  calm: [
    {
      title: "River Flows in You",
      artist: "Yiruma",
    },
    {
      title: "Clair de Lune",
      artist: "Claude Debussy",
    },
  ],

  excited_romantic: [
    {
      title: "Perfect",
      artist: "Ed Sheeran",
    },
    {
      title: "All of Me",
      artist: "John Legend",
    },
  ],
};


async function searchYouTube(
  query: string,
  apiKey: string
): Promise<string | null> {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 1,
          key: apiKey,
        },
      }
    );

    return (
      response.data.items?.[0]?.id?.videoId ??
      null
    );
  } catch (error) {
    console.error(
      "YouTube search error:",
      error
    );

    return null;
  }
}


function getRandomSongForMood(mood: string) {
  const songs = MOOD_SONGS[mood];

  if (!songs || songs.length === 0) {
    return null;
  }

  return songs[
    Math.floor(Math.random() * songs.length)
  ];
}


export const appRouter = router({

  system: systemRouter,


  auth: router({

    me: publicProcedure.query(
      (opts) => opts.ctx.user
    ),


    logout: publicProcedure.mutation(
      ({ ctx }) => {

        const cookieOptions =
          getSessionCookieOptions(
            ctx.req
          );


        ctx.res.clearCookie(
          COOKIE_NAME,
          {
            ...cookieOptions,
            maxAge: -1,
          }
        );


        return {
          success: true,
        } as const;
      }
    ),

  }),


  music: router({


    savePreference: publicProcedure

      .input(
        z.object({
          genres: z.array(z.string()),
          moods: z.array(z.string()),
        })
      )


      .mutation(async ({ ctx, input }) => {

        if (!ctx.user) {
          return {
            success: false,
            message: "guest",
          };
        }


        const db = await getDb();


        if (!db) {
          return {
            success: false,
            message: "database unavailable",
          };
        }


        await db
          .insert(userPreferences)
          .values({
            userId: ctx.user.id,
            genres: JSON.stringify(
              input.genres
            ),
            moods: JSON.stringify(
              input.moods
            ),
          })
          .onDuplicateKeyUpdate({
            set: {
              genres: JSON.stringify(
                input.genres
              ),
              moods: JSON.stringify(
                input.moods
              ),
            },
          });


        return {
          success: true,
        };

      }),


recommend:

publicProcedure

.input(
  z.object({
    mood:z.string(),
  })
)


.mutation(
async({ctx,input})=>{

try{


let preferredGenres:string[] = [];



// 로그인 사용자 취향 가져오기

if(ctx.user){

const db =
await getDb();



if(db){

const preference =
await db
.select()
.from(userPreferences)
.where(
eq(
userPreferences.userId,
ctx.user.id
)
)
.limit(1);



if(preference.length > 0){

preferredGenres =
JSON.parse(
preference[0].genres
);

}

}

}




/*
추천 데이터

genre 추가해서
점수 계산 가능하게 변경
*/

const candidates = Object.entries(
MOOD_SONGS
)
.flatMap(
([mood,songs])=>

songs.map(song=>({

...song,

mood,

score:0

}))

);




// 감정 점수

const moodFiltered =
candidates.map(song=>{


let score = 0;



if(song.mood === input.mood){

score += 10;

}



// 장르 매칭

preferredGenres.forEach(
genre=>{


const artist =
song.artist.toLowerCase();



const title =
song.title.toLowerCase();



if(
genre.toLowerCase()
.includes("j-pop")
){

if(
artist.includes("yoasobi") ||
artist.includes("vaundy")
){

score +=5;

}

}



if(
genre.toLowerCase()
.includes("pop")
){

score +=1;

}



});


return {

...song,

score

};


});





// 점수 높은 순 정렬

moodFiltered.sort(
(a,b)=>
b.score-a.score
);




// 상위 후보 랜덤

const topSongs =
moodFiltered.slice(
0,
Math.min(
5,
moodFiltered.length
)
);



const song =
topSongs[
Math.floor(
Math.random()
*
topSongs.length
)
];





if(!song){

return {

success:false,

error:
"추천 가능한 곡 없음"

};

}




let youtubeId:
string|null=null;



const apiKey =
process.env.YOUTUBE_API_KEY;



if(apiKey){

youtubeId =
await searchYouTube(
`${song.title} ${song.artist} official audio`,
apiKey
);

}





return {

success:true,

song:{

title:
song.title,

artist:
song.artist,

youtubeId:
youtubeId ?? undefined,

}

};



}catch(error){


console.error(
"Recommendation error:",
error
);



return {

success:false,

error:
"추천 중 오류 발생"

};


}


}
),


export type AppRouter =
  typeof appRouter;
