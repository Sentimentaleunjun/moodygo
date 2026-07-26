import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [displayText, setDisplayText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const landingSentences = [
    "오늘 당신의 감정에 맞는\n단 하나의 음악 추천",
    "AI가 추천하는\n당신의 감정에 딱 맞는 음악",
    "감정으로 검색하는\n새로운 음악 경험",
  ];

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
        setSentenceIndex((prev) => (prev + 1) % landingSentences.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, sentenceIndex]);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-12 py-6">
        <div className="flex items-center gap-2 text-2xl font-bold text-accent">
          <i className="fas fa-headphones-simple"></i>
          <span>MoodyGo!</span>
        </div>
        <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold">
          <i className="fas fa-volume-high"></i>
          <span>AI Music Engine</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center gap-6 px-4">
        {/* Typing Animation Headline */}
        <div className="min-h-32 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight whitespace-pre-line">
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground font-medium max-w-2xl">
          당신의 감정을 선택하면 ChatGPT가 최고의 노래를 추천하고,
          <br />
          YouTube에서 고음질로 바로 재생해 드립니다.
        </p>

        {/* Start Button */}
        <Button
          onClick={() => setLocation("/app")}
          className="mt-4 px-10 py-3 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          시작하기
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-muted-foreground py-4">
        Pure AI Music Recommendation v1.0
      </div>
    </div>
  );
}
