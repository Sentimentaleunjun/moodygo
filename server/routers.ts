import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";

import { musicHistory } from "../drizzle/schema";
import { getDb } from "./db";


// 감정별 곡 데이터
const MOOD_SONGS: Record<
  string,
  Array<{ title: string; artist: string }>
> = {
  sad: [
    { title: "Someone Like You", artist: "Adele" },
    { title: "The Night We Met", artist: "Lord Huron" },
    { title: "Fix You", artist: "Coldplay" },
    { title: "이별택시", artist: "김연우" },
    { title: "그대만 있다면", artist: "너드커넥션" },
  ],

  excited: [
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
    { title: "Dynamite", artist: "BTS" },
    { title: "Permission to Dance", artist: "BTS" },
    { title: "Super Shy", artist: "NewJeans" },
    { title: "나는 아픈 건 딱 질색이니까", artist: "(여자)아이들" },
  ],

  happy: [
    { title: "Happy", artist: "Pharrell Williams" },
    { title: "Good Life", artist: "Kanye West" },
    { title: "Dolphin", artist: "오마이걸" },
    { title: "여행", artist: "볼빨간사춘기" },
  ],

  calm: [
    { title: "Weightless", artist: "Marconi Union" },
    { title: "River Flows in You", artist: "Yiruma" },
    { title: "밤편지", artist: "아이유" },
    { title: "사랑은 늘 도망가", artist: "임영웅" },
  ],

  excited_romantic: [
    { title: "Perfect", artist: "Ed Sheeran" },
    { title: "All of Me", artist: "John Legend" },
    { title: "사건의 지평선", artist: "윤하" },
    { title: "첫 사랑니", artist: "f(x)" },
  ],
};


// YouTube 검색
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


// 랜덤 추천
function getRandomSongForMood(
  mood: string
) {
  const songs = MOOD_SONGS[mood];

  if (!songs || songs.length === 0) {
    return null;
  }

  return songs[
    Math.floor(
      Math.random() * songs.length
    )
  ];
}



export const appRouter = router({

  system: systemRouter,


  auth: router({

    me:
      publicProcedure.query(
        (opts) =>
          opts.ctx.user
      ),


    logout:
      publicProcedure.mutation(
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
          };
        }
      ),
  }),



  music: router({

    recommend:
      publicProcedure
        .input(
          z.object({
            mood: z.string(),
          })
        )


        .mutation(
          async ({
            input,
            ctx,
          }) => {

            try {

              const song =
                getRandomSongForMood(
                  input.mood
                );


              if (!song) {
                return {
                  success: false,
                  error:
                    "추천 가능한 곡이 없습니다.",
                };
              }



              let youtubeId:
                string | null = null;


              const apiKey =
                process.env
                  .YOUTUBE_API_KEY;



              if (apiKey) {

                youtubeId =
                  await searchYouTube(
                    `${song.title} ${song.artist}`,
                    apiKey
                  );

              }



              // 로그인 사용자만 기록 저장
              if (ctx.user) {

                const db =
                  await getDb();


                if (db) {

                  await db
                    .insert(
                      musicHistory
                    )
                    .values({

                      userId:
                        ctx.user.id,


                      title:
                        song.title,


                      artist:
                        song.artist,


                      youtubeId:
                        youtubeId,


                      mood:
                        input.mood,

                    });

                }
              }



              return {

                success: true,


                song: {

                  title:
                    song.title,


                  artist:
                    song.artist,


                  youtubeId:
                    youtubeId ??
                    undefined,

                },

              };


            } catch(error) {


              console.error(
                "Music recommendation error:",
                error
              );


              return {

                success:false,


                error:
                  error instanceof Error
                    ? error.message
                    : "추천 오류",

              };

            }

          }
        ),

  }),

});


export type AppRouter =
  typeof appRouter;
