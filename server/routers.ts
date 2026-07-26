import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";

// 감정별 곡 데이터베이스 (완전 무료, 외부 API 불필요)
const MOOD_SONGS: Record<string, Array<{ title: string; artist: string }>> = {
  sad: [
    { title: "Someone Like You", artist: "Adele" },
    { title: "The Night We Met", artist: "Lord Huron" },
    { title: "Skinny Love", artist: "Bon Iver" },
    { title: "Hurt", artist: "Johnny Cash" },
    { title: "Black", artist: "Pearl Jam" },
    { title: "Tears in Heaven", artist: "Eric Clapton" },
    { title: "Nutshell", artist: "Alice in Chains" },
    { title: "Creep", artist: "Radiohead" },
    { title: "Mad World", artist: "Gary Jules" },
    { title: "Between the Bars", artist: "Elliott Smith" },
  ],
  excited: [
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
    { title: "Shut Up and Dance", artist: "Walk the Moon" },
    { title: "Don't Stop Me Now", artist: "Queen" },
    { title: "Walking on Sunshine", artist: "Katrina & The Waves" },
    { title: "Good as Hell", artist: "Lizzo" },
    { title: "Levitating", artist: "Dua Lipa" },
    { title: "Blinding Lights", artist: "The Weeknd" },
    { title: "Dynamite", artist: "BTS" },
    { title: "Pump It Up", artist: "Endor" },
    { title: "Titanium", artist: "David Guetta ft. Sia" },
  ],
  happy: [
    { title: "Walking on Sunshine", artist: "Katrina & The Waves" },
    { title: "Good as Hell", artist: "Lizzo" },
    { title: "Don't Stop Me Now", artist: "Queen" },
    { title: "Sunshine", artist: "Fleetwood Mac" },
    { title: "Three Little Birds", artist: "Bob Marley" },
    { title: "Good Day", artist: "Nappy Roots" },
    { title: "Here Comes the Sun", artist: "The Beatles" },
    { title: "Walking on Air", artist: "Katy Perry" },
    { title: "Lovely Day", artist: "Bill Withers" },
    { title: "I'm Yours", artist: "Jason Mraz" },
  ],
  calm: [
    { title: "Weightless", artist: "Marconi Union" },
    { title: "Clair de Lune", artist: "Claude Debussy" },
    { title: "Nuvole Bianche", artist: "Ludovico Einaudi" },
    { title: "Gymnopédie No. 1", artist: "Erik Satie" },
    { title: "River Flows in You", artist: "Yiruma" },
    { title: "Peaceful Piano", artist: "Various Artists" },
    { title: "Breathe", artist: "The Prodigy" },
    { title: "Ambient 1: Music for Airports", artist: "Brian Eno" },
    { title: "Meditation", artist: "Enya" },
    { title: "Holocene", artist: "Bon Iver" },
  ],
  excited_romantic: [
    { title: "Perfect", artist: "Ed Sheeran" },
    { title: "All of Me", artist: "John Legend" },
    { title: "Thinking Out Loud", artist: "Ed Sheeran" },
    { title: "Make You Feel My Love", artist: "Adele" },
    { title: "Kiss Me", artist: "Sixpence None the Richer" },
    { title: "At Last", artist: "Etta James" },
    { title: "Wonderful Tonight", artist: "Eric Clapton" },
    { title: "The Way You Look Tonight", artist: "Frank Sinatra" },
    { title: "Falling", artist: "Harry Styles" },
    { title: "Lover", artist: "Taylor Swift" },
  ],
};

// YouTube 검색 함수
async function searchYouTube(
  query: string,
  apiKey: string
): Promise<string | null> {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 1,
        key: apiKey,
      },
    });

    const videoId = response.data.items?.[0]?.id?.videoId;
    return videoId || null;
  } catch (error) {
    console.error("YouTube search error:", error);
    return null;
  }
}

// 로컬 곡 데이터베이스에서 랜덤 곡 선택
function getRandomSongForMood(mood: string): { title: string; artist: string } | null {
  const songs = MOOD_SONGS[mood];
  if (!songs || songs.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * songs.length);
  return songs[randomIndex];
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  music: router({
    recommend: publicProcedure
      .input(z.object({ mood: z.string() }))
      .mutation(async ({ input }) => {
        try {
          // 로컬 데이터베이스에서 랜덤 곡 선택
          const song = getRandomSongForMood(input.mood);
          if (!song) {
            return {
              success: false,
              error: "해당 감정에 맞는 곡을 찾을 수 없습니다.",
            };
          }

          // YouTube에서 영상 검색 (선택사항 - API 키가 있을 경우)
          let youtubeId: string | null = null;
          const youtubeApiKey = process.env.YOUTUBE_API_KEY;
          if (youtubeApiKey) {
            const searchQuery = `${song.title} ${song.artist}`;
            youtubeId = await searchYouTube(searchQuery, youtubeApiKey);
          }

          return {
            success: true,
            song: {
              title: song.title,
              artist: song.artist,
              youtubeId: youtubeId || undefined,
            },
          };
        } catch (error) {
          console.error("Music recommendation error:", error);
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "곡 추천 중 오류가 발생했습니다.",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
