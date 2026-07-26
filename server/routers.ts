import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";

const MOOD_DESCRIPTIONS: Record<string, string> = {
  sad: "우울하고 감성적인",
  excited: "신나고 활기찬",
  happy: "즐겁고 밝은",
  calm: "차분하고 평온한",
  excited_romantic: "설레고 로맨틱한",
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

// ChatGPT에서 곡 추천받기
async function getRecommendationFromChatGPT(
  mood: string,
  apiKey: string
): Promise<{ title: string; artist: string } | null> {
  try {
    const moodDesc = MOOD_DESCRIPTIONS[mood] || "좋은";

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              'You are a music recommendation expert. Recommend ONE popular song matching the given mood. Respond ONLY with JSON: {"title":"song name","artist":"artist name"}',
          },
          {
            role: "user",
            content: `분위기: ${moodDesc}. 이 분위기에 맞는 유명한 노래를 추천해주세요.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const content = response.data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return null;
    }

    // JSON 파싱 시도
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    const song = JSON.parse(jsonMatch[0]);
    return {
      title: song.title || "Unknown Title",
      artist: song.artist || "Unknown Artist",
    };
  } catch (error) {
    console.error("ChatGPT recommendation error:", error);
    return null;
  }
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
          const openaiApiKey = process.env.OPENAI_API_KEY;
          if (!openaiApiKey) {
            return {
              success: false,
              error: "OpenAI API 키가 설정되지 않았습니다.",
            };
          }

          // ChatGPT에서 곡 추천받기
          const song = await getRecommendationFromChatGPT(input.mood, openaiApiKey);
          if (!song) {
            return {
              success: false,
              error: "ChatGPT에서 곡 추천을 받지 못했습니다.",
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
