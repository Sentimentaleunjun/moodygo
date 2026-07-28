import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";
import { userPreferences } from "../drizzle/schema";
import { getDb } from "./db";

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


    recommend: publicProcedure

      .input(
        z.object({
          mood: z.string(),
        })
      )


      .mutation(async ({ input }) => {

        try {

          const song =
            getRandomSongForMood(
              input.mood
            );


          if (!song) {
            return {
              success: false,
              error:
                "해당 감정의 곡이 없습니다.",
            };
          }


          let youtubeId:
            string | null = null;


          const apiKey =
            process.env.YOUTUBE_API_KEY;


          if (apiKey) {

            youtubeId =
              await searchYouTube(
                `${song.title} ${song.artist}`,
                apiKey
              );

          }


          return {

            success: true,

            song: {

              title:
                song.title,

              artist:
                song.artist,

              youtubeId:
                youtubeId ?? undefined,

            },

          };


        } catch(error) {

          console.error(
            "Music recommendation error:",
            error
          );


          return {

            success: false,

            error:
              "추천 중 오류 발생",

          };

        }

      }),


  }),


});


export type AppRouter =
  typeof appRouter;
