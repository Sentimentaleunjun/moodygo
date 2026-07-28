import type { Mood } from "../data/mood";
import type { Song } from "../data/songs";


const moodReasons: Record<Mood, string> = {

  happy:
    "현재 긍정적인 에너지를 더 확장하고 즐거운 분위기를 만들어주는 곡이에요.",

  sad:
    "현재 감정을 자연스럽게 받아들이고 위로받을 수 있는 분위기의 곡이에요.",

  calm:
    "마음을 안정시키고 편안한 흐름을 만들어주는 곡이에요.",

  energetic:
    "현재 높은 에너지를 더욱 끌어올리고 활력을 주는 곡이에요.",

  tired:
    "지친 상태에서 편안함과 회복감을 느낄 수 있도록 도와주는 곡이에요.",

  romantic:
    "설레는 감정과 따뜻한 분위기를 잘 표현하는 곡이에요.",

  nostalgic:
    "추억과 감정을 떠올리게 하는 깊은 분위기의 곡이에요."
};


export function generateReason(
  mood: Mood,
  song: Song
): string {

  const base =
    moodReasons[mood];


  const tagText =
    song.tags
      .slice(0,2)
      .join(", ");


  return `${base}
${song.artist}의 ${song.title}은(는) ${tagText}한 감성을 담고 있어 현재 상태와 잘 맞아요.`;
}
