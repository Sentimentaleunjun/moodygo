import type { Mood } from "../data/mood";
import type { Song } from "../data/songs";


export interface EmotionContext {
  mood: Mood;
  energy: number; // 0~100
}


export interface RecommendedSong extends Song {
  score: number;
  reason: string;
}


function calculateMoodScore(
  emotion: EmotionContext,
  song: Song
): number {

  if (song.moods.includes(emotion.mood)) {
    return 40;
  }

  return 0;
}


function calculateEnergyScore(
  emotion: EmotionContext,
  song: Song
): number {

  const difference = Math.abs(
    emotion.energy - song.energy
  );

  // 에너지 차이가 적을수록 높은 점수
  return Math.max(
    0,
    30 - difference / 3
  );
}


function generateReason(
  emotion: EmotionContext,
  song: Song
): string {

  if(song.moods.includes(emotion.mood)){
    return `현재 ${emotion.mood} 감정과 잘 맞는 분위기의 곡입니다.`;
  }

  return "현재 상태에서 새로운 감정 경험을 제공하는 곡입니다.";
}


export function recommendSongs(
  emotion: EmotionContext,
  songs: Song[],
  limit = 5
): RecommendedSong[] {


  return songs
    .map(song => {

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


      const score =
        moodScore +
        energyScore;


      return {
        ...song,
        score: Math.round(score),
        reason: generateReason(
          emotion,
          song
        )
      };

    })

    .sort(
      (a,b)=> b.score - a.score
    )

    .slice(0, limit);
}
