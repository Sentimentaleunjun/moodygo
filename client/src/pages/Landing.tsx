import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [displayText, setDisplayText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const landingSentences = useMemo(
    () => [
      "오늘 당신의 감정에 맞는\n단 하나의 음악 추천",
      "AI가 추천하는\n당신의 감정에 딱 맞는 음악",
      "감정으로 검색하는\n새로운 음악 경험",
    ],
    []
  );

  useEffect(() => {
    const currentText = landingSentences[sentenceIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
      speed = 2000;
    } else if (isDeleting && charIndex === 0) {
      speed = 500;
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }

      if (!isDeleting && charIndex === currentText.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setSentenceIndex(prev => (prev + 1) % landingSentences.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, landingSentences, sentenceIndex]);

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 moody-ambient" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-8 h-56 w-56 rounded-full bg-foreground/5 blur-3xl" />

      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 py-5 sm:px-10 lg:px-14">
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="glass-panel flex items-center gap-3 rounded-full px-4 py-3 text-left font-bold text-accent shadow-sm"
        >
          <Headphones className="h-5 w-5" />
          <span className="text-lg sm:text-xl">MoodyGo!</span>
        </button>

        <div className="glass-panel hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-foreground sm:flex">
          <Volume2 className="h-4 w-4 text-accent" />
          <span>AI Music Engine</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-28 text-center">
        <div className="glass-panel relative w-full overflow-hidden rounded-[2rem] px-5 py-14 shadow-2xl sm:px-10 sm:py-20 lg:px-16">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            <Sparkles className="h-4 w-4" />
            감정을 음악으로 변환하는 AI 플랫폼
          </div>

          <div className="flex min-h-40 items-center justify-center sm:min-h-44">
            <h1 className="whitespace-pre-line text-4xl font-black leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {displayText}
              <span className="text-accent animate-pulse">|</span>
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-muted-foreground sm:text-lg">
            복잡한 검색 대신 지금의 감정을 선택하세요. MoodyGo가 감정, 분위기,
            순간의 결을 읽고 YouTube에서 바로 재생할 수 있는 음악을 추천합니다.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => setLocation("/app")}
              className="h-14 rounded-full bg-accent px-8 text-base font-bold text-accent-foreground shadow-xl shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/25"
            >
              시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="glass-panel rounded-full px-5 py-3 text-sm font-semibold text-muted-foreground">
              우울함 · 신남 · 즐거움 · 차분함 · 설렘
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 z-10 py-5 text-center text-xs font-medium text-muted-foreground">
        Pure AI Music Recommendation v1.0
      </footer>
    </div>
  );
}
