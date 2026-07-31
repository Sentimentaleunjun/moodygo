export const moods = [
  "happy",
  "sad",
  "calm",
  "energetic",
  "tired",
  "romantic",
  "nostalgic",
] as const;


export type Mood =
  typeof moods[number];