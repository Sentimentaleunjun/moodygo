import type { Song } from "../data/songs";


export function generateReason(
  song: Song,
  emotion: any
){

  const tagText =
    song.tags
      ?.slice(0,2)
      ?.join(", ")
      ??
      "감성적인";


  const mood =
    emotion?.primary ??
    emotion?.mood ??
    "현재 감정";



  return (
`${song.artist}의 ${song.title}은(는) ${tagText}한 분위기를 담고 있어요.
현재 느끼는 ${mood} 감정과 잘 어울리는 곡으로 추천했어요.`
  );

}