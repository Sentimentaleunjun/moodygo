import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  History,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

interface RecommendedSong {
  title: string;
  artist: string;
  youtubeId?: string;
  timestamp: number;
}

const MOODS = [
  { id: "sad", label: "우울함", emoji: "🌧️", cue: "잔잔하고 깊은 위로" },
  {
    id: "excited",
    label: "신남",
    emoji: "🔥",
    cue: "에너지를 끌어올리는 비트",
  },
  { id: "happy", label: "즐거움", emoji: "✨", cue: "가볍고 밝은 무드" },
  { id: "calm", label: "차분함", emoji: "☕", cue: "느린 호흡과 따뜻함" },
  {
    id: "excited_romantic",
    label: "설렘",
    emoji: "🌸",
    cue: "몽글몽글한 감정선",
  },
];

export default function Player() {
  const [, setLocation] = useLocation();
  const [selectedMood, setSelectedMood] = useState("sad");
  const [songHistory, setSongHistory] = useState<RecommendedSong[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommendMutation = trpc.music.recommend.useMutation();
  const selectedMoodMeta = useMemo(
    () => MOODS.find(mood => mood.id === selectedMood) ?? MOODS[0],
    [selectedMood]
  );

  useEffect(() => {
    const saved = localStorage.getItem("moodygo-history");

    if (saved) {
      try {
        const data = JSON.parse(saved) as RecommendedSong[];
        setSongHistory(data);
        if (data.length) setCurrentSongIndex(data.length - 1);
      } catch {
        localStorage.removeItem("moodygo-history");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("moodygo-history", JSON.stringify(songHistory));
  }, [songHistory]);

  const fetchRecommendation = async (mood: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await recommendMutation.mutateAsync({ mood });

      if (result.success && result.song) {
        const song: RecommendedSong = {
          ...result.song,
          timestamp: Date.now(),
        };

        setSongHistory(prev => {
          setCurrentSongIndex(prev.length);
          return [...prev, song];
        });
      } else {
        setError(result.error ?? "추천 실패");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = async (id: string) => {
    setSelectedMood(id);
    await fetchRecommendation(id);
  };

  const currentSong =
    currentSongIndex >= 0 ? songHistory[currentSongIndex] : null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 moody-ambient" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <button
          onClick={() => setLocation("/")}
          className="glass-panel flex items-center gap-3 rounded-full px-4 py-3 text-xl font-bold text-accent"
        >
          <Headphones className="h-5 w-5" />
          MoodyGo!
        </button>
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="glass-panel rounded-full border-border/60 bg-background/40"
        >
          처음으로
        </Button>
      </header>

      <main className="relative z-10 grid flex-1 gap-6 px-5 pb-8 lg:grid-cols-[320px_1fr] lg:px-12">
        <aside className="glass-panel h-fit rounded-[2rem] p-5 lg:sticky lg:top-6">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-black">어떤 감정인가요?</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                disabled={isLoading}
                onClick={() => handleMoodSelect(mood.id)}
                className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 disabled:opacity-60 ${
                  selectedMood === mood.id
                    ? "border-accent/40 bg-accent text-accent-foreground shadow-xl shadow-accent/20"
                    : "border-border/70 bg-background/45 hover:border-accent/50 hover:bg-accent/10"
                }`}
              >
                <div className="text-2xl">{mood.emoji}</div>
                <div className="mt-2 font-bold">{mood.label}</div>
                <div
                  className={`mt-1 text-xs ${selectedMood === mood.id ? "text-accent-foreground/80" : "text-muted-foreground"}`}
                >
                  {mood.cue}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex items-center justify-center">
          <Card className="glass-panel w-full max-w-5xl rounded-[2rem] border-border/60 bg-background/45 p-4 shadow-2xl sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-full bg-accent/10 px-4 py-2 text-sm font-bold text-accent">
                {selectedMoodMeta.emoji} {selectedMoodMeta.label} 기반 추천
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <History className="h-4 w-4" /> {songHistory.length}곡의 감정
                기록
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-foreground p-5 text-accent-foreground shadow-2xl sm:p-8">
              <div className="mx-auto flex min-h-56 max-w-2xl flex-col items-center justify-center text-center">
                {isLoading ? (
                  <>
                    <Spinner className="h-9 w-9" />
                    <p className="mt-4 font-bold">
                      AI가 지금의 감정에 맞는 곡을 찾는 중...
                    </p>
                  </>
                ) : error ? (
                  <p className="text-destructive-foreground">{error}</p>
                ) : currentSong ? (
                  <>
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-accent/20 text-5xl shadow-inner">
                      {selectedMoodMeta.emoji}
                    </div>
                    <h1 className="text-3xl font-black sm:text-5xl">
                      {currentSong.title}
                    </h1>
                    <p className="mt-3 text-lg text-accent-foreground/70">
                      {currentSong.artist}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-5 text-6xl">🎧</div>
                    <p className="text-xl font-bold">
                      감정을 선택하면 음악을 추천합니다
                    </p>
                    <p className="mt-2 text-accent-foreground/60">
                      왼쪽에서 현재 감정에 가장 가까운 카드를 눌러보세요.
                    </p>
                  </>
                )}
              </div>
            </div>

            {currentSong?.youtubeId && (
              <div className="mt-6 aspect-video overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1`}
                  title={currentSong.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                />
              </div>
            )}

            {currentSong && !currentSong.youtubeId && (
              <div className="mt-6 flex aspect-video items-center justify-center rounded-[1.5rem] bg-muted text-muted-foreground">
                YouTube 영상을 찾을 수 없습니다.
              </div>
            )}

            <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-3">
              <Button
                className="rounded-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
                onClick={() => fetchRecommendation(selectedMood)}
              >
                <RotateCw className="mr-2 h-4 w-4" /> 다른 곡 추천
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                disabled={currentSongIndex <= 0}
                onClick={() => setCurrentSongIndex(currentSongIndex - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                disabled={currentSongIndex >= songHistory.length - 1}
                onClick={() => setCurrentSongIndex(currentSongIndex + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {songHistory.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-black">추천 기록</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {songHistory
                    .slice()
                    .reverse()
                    .map((song, index) => (
                      <button
                        key={song.timestamp}
                        onClick={() =>
                          setCurrentSongIndex(songHistory.length - 1 - index)
                        }
                        className="rounded-2xl border border-border/60 bg-background/45 p-4 text-left transition hover:border-accent/40 hover:bg-accent/10"
                      >
                        <div className="font-bold">{song.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {song.artist}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}
