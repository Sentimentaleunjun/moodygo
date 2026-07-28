import type { Mood } from "../data/mood";
import type { Song } from "../data/songs";
import { generateReason } from "./reasonGenerator";


export interface EmotionContext {
  mood: Mood;
  energy: number; // 0~100
}


export interface RecommendedSong extends Song {
  score: number;
  reason: string;
}


/**
 * 감정 일치 점수
 * 최대 40점
 */
function calculateMoodScore(
  emotion: EmotionContext,
  song: Song
): number {

  if (song.moods.includes(emotion.mood)) {
    return 40;
  }

  return 0;
}


/**
 * 에너지 적합도 점수
 * 최대 30점
 *
 * 사용자의 현재 에너지와
 * 곡의 에너지 차이가 적을수록 높은 점수
 */
function calculateEnergyScore(
  emotion: EmotionContext,
  song: Song
): number {

  const difference =
    Math.abs(
      emotion.energy - song.energy
    );


  return Math.max(
    0,
    30 - difference / 3
  );
}


/**
 * 전체 추천 점수 계산
 */
function calculateScore(
  emotion: EmotionContext,
  song: Song
): number {

  const moodScore =
    calculateMoodScore(
      emotion,
      song
    );


  const energyScore =
    calculateEnergyScore(
      emotion,
      song
    );


  return Math.round(
    moodScore + energyScore
  );
}


/**
 * 추천 엔진
 */
export function recommendSongs(
  emotion: EmotionContext,
  songs: Song[],
  limit = 5
): RecommendedSong[] {


  return songs

    .map(song => {

      const score =
        calculateScore(
          emotion,
          song
        );


      return {
        ...song,

        score,

        reason:
          generateReason(
            emotion.mood,
            song
          )
      };

    })

    .sort(
      (a, b) =>
        b.score - a.score
    )

    .slice(0, limit);
}
