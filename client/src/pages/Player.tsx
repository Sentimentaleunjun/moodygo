import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

interface RecommendedSong {
  title: string;
  artist: string;
  youtubeId?: string;
  timestamp: number;
}

const MOODS = [
  { id: "sad", label: "우울함", emoji: "🌧️" },
  { id: "excited", label: "신남", emoji: "🔥" },
  { id: "happy", label: "즐거움", emoji: "✨" },
  { id: "calm", label: "차분함", emoji: "☕" },
  { id: "excited_romantic", label: "설렘", emoji: "🌸" },
];

export default function Player() {
  const [, setLocation] = useLocation();
  const [selectedMood, setSelectedMood] = useState("sad");
  const [songHistory, setSongHistory] = useState<RecommendedSong[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommendMutation = trpc.music.recommend.useMutation();

  // 감정 선택 시 새로운 곡 추천받기
  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    setCurrentSongIndex(-1);
    setSongHistory([]);
    await fetchRecommendation(moodId);
  };

  // ChatGPT API로부터 곡 추천받기
  const fetchRecommendation = async (moodId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await recommendMutation.mutateAsync({ mood: moodId });
      if (result.success && result.song) {
        const newSong: RecommendedSong = {
          ...result.song,
          timestamp: Date.now(),
        };
        setSongHistory([newSong]);
        setCurrentSongIndex(0);
      } else {
        setError(result.error || "곡 추천에 실패했습니다.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 다른 곡 추천받기
  const handleNextRecommendation = async () => {
    await fetchRecommendation(selectedMood);
  };

  // 이전 곡으로
  const handlePreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  // 다음 곡으로
  const handleNextSong = () => {
    if (currentSongIndex < songHistory.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const currentSong = currentSongIndex >= 0 ? songHistory[currentSongIndex] : null;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-12 py-6 border-b border-border">
        <div
          className="flex items-center gap-2 text-2xl font-bold text-accent cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setLocation("/")}
        >
          <i className="fas fa-headphones-simple"></i>
          <span>MoodyGo!</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold">
            <i className="fas fa-music"></i>
            <span>Streaming Live</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/")}
            className="rounded-full"
          >
            처음으로
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex px-12 py-8 gap-10">
        {/* Left Sidebar - Mood Selector */}
        <div className="w-72 flex flex-col gap-4">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            어떤 감정이신가요?
          </div>
          <div className="flex flex-col gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                disabled={isLoading}
                className={`px-4 py-3 rounded-lg font-semibold text-left transition-all disabled:opacity-50 ${
                  selectedMood === mood.id
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-card text-foreground border border-border hover:border-accent hover:text-accent"
                }`}
              >
                <span className="mr-2">{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content - Player Card */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 flex flex-col gap-6">
            {/* Status Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-bold">
                <i className="fas fa-compact-disc"></i>
                {isLoading
                  ? "로딩 중..."
                  : currentSong
                    ? `재생 중: ${currentSong.title}`
                    : "오디오 엔진 준비됨"}
              </div>
            </div>

            {/* Song Info Box */}
            <div className="bg-gradient-to-br from-foreground to-foreground/80 rounded-xl p-6 text-accent-foreground text-center min-h-32 flex flex-col items-center justify-center gap-2">
              {isLoading ? (
                <Spinner className="w-8 h-8" />
              ) : error ? (
                <div className="text-sm text-red-400">{error}</div>
              ) : currentSong ? (
                <>
                  <div className="text-2xl font-bold">{currentSong.title}</div>
                  <div className="text-sm text-accent-foreground/70">
                    {currentSong.artist}
                  </div>
                </>
              ) : (
                <div className="text-sm text-accent-foreground/70">
                  감정을 선택하여 시작하세요
                </div>
              )}
            </div>

            {/* YouTube Player */}
            {currentSong?.youtubeId ? (
              <div className="w-full aspect-video bg-foreground rounded-lg overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1`}
                  title={currentSong.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                ></iframe>
              </div>
            ) : currentSong ? (
              <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <i className="fas fa-music text-3xl mb-2 block"></i>
                  <p className="text-sm">
                    YouTube 영상을 찾을 수 없습니다.
                    <br />
                    YouTube에서 직접 검색해 주세요.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={handleNextRecommendation}
                disabled={isLoading}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full"
              >
                <i className="fas fa-shuffle mr-2"></i>
                다른 곡 추천받기
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={handlePreviousSong}
                  disabled={isLoading || currentSongIndex <= 0}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <i className="fas fa-backward-step"></i>
                </Button>
                <Button
                  onClick={handleNextSong}
                  disabled={isLoading || currentSongIndex >= songHistory.length - 1}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <i className="fas fa-forward-step"></i>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
