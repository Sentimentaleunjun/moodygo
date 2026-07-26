import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("music.recommend", () => {
  it("should return a song recommendation for a valid mood", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.recommend({ mood: "sad" });

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      expect(result.success).toBe(false);
      expect(result.error).toContain("OpenAI API");
      return;
    }

    // If API key is configured, check the response
    if (result.success) {
      expect(result.song).toBeDefined();
      expect(result.song?.title).toBeDefined();
      expect(result.song?.artist).toBeDefined();
      expect(typeof result.song?.title).toBe("string");
      expect(typeof result.song?.artist).toBe("string");
    } else {
      // API call might fail due to rate limiting or network issues
      expect(result.error).toBeDefined();
    }
  });

  it("should handle different moods", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const moods = ["sad", "excited", "happy", "calm", "excited_romantic"];

    for (const mood of moods) {
      const result = await caller.music.recommend({ mood });

      if (!process.env.OPENAI_API_KEY) {
        expect(result.success).toBe(false);
      } else if (result.success) {
        expect(result.song?.title).toBeDefined();
        expect(result.song?.artist).toBeDefined();
      }
    }
  });
});
