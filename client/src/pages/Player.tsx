import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface RecommendedSong {
  title: string;
  artist: string;
  youtubeId?: string;
  timestamp: number;
  liked?: boolean;
}


const MOODS = [
  {
    id: "sad",
    label: "우울함",
    emoji: "🌧️",
  },
  {
    id: "excited",
    label: "신남",
    emoji: "🔥",
  },
  {
    id: "happy",
    label: "즐거움",
    emoji: "✨",
  },
  {
    id: "calm",
    label: "차분함",
    emoji: "☕",
  },
  {
    id: "excited_romantic",
    label: "설렘",
    emoji: "🌸",
  },
];


export default function Player() {

  const [, setLocation] =
    useLocation();


  const [selectedMood, setSelectedMood] =
    useState("sad");


  const [songHistory, setSongHistory] =
    useState<RecommendedSong[]>([]);


  const [currentSongIndex, setCurrentSongIndex] =
    useState(-1);


  const [isLoading, setIsLoading] =
    useState(false);


  const [error, setError] =
    useState<string | null>(null);



  const recommendMutation =
    trpc.music.recommend.useMutation();



  const {
    data: user
  } =
    trpc.auth.me.useQuery();



  const fetchRecommendation =
    async (
      mood: string
    ) => {


      setIsLoading(true);

      setError(null);


      try {

        const result =
          await recommendMutation
            .mutateAsync({
              mood,
            });



        if (
          result.success &&
          result.song
        ) {


          const newSong =
            {
              ...result.song,
              timestamp:
                Date.now(),
              liked:false,
            };



          setSongHistory(
            prev => [
              ...prev,
              newSong,
            ]
          );


          setCurrentSongIndex(
            prev =>
              prev + 1
          );


        } else {

          setError(
            result.error ??
            "추천 실패"
          );

        }


      } catch(error) {

        setError(
          error instanceof Error
          ? error.message
          : "오류 발생"
        );


      } finally {

        setIsLoading(false);

      }

    };



  const handleMoodSelect =
    async (
      mood:string
    ) => {

      setSelectedMood(mood);

      setSongHistory([]);

      setCurrentSongIndex(-1);


      await fetchRecommendation(
        mood
      );

    };



  const handleLike =
    () => {


      setSongHistory(
        prev =>
          prev.map(
            (song,index)=>
              index === currentSongIndex
              ? {
                  ...song,
                  liked:
                    !song.liked,
                }
              : song
          )
      );


    };



  const currentSong =
    currentSongIndex >= 0
      ? songHistory[currentSongIndex]
      : null;



  return (

    <div
      className="
      min-h-screen
      w-full
      bg-background
      flex
      flex-col
      "
    >


      <header
        className="
        flex
        justify-between
        items-center
        px-6
        py-5
        border-b
        border-border
        "
      >

        <div
          onClick={() =>
            setLocation("/")
          }
          className="
          text-2xl
          font-bold
          text-accent
          cursor-pointer
          "
        >

          🎧 MoodyGo!

        </div>



        <div
          className="
          text-sm
          font-bold
          bg-accent
          text-accent-foreground
          px-4
          py-2
          rounded-full
          "
        >

          {user
          ? "Personal Mode"
          : "Guest Mode"}

        </div>


      </header>




      <main
        className="
        flex-1
        flex
        flex-col
        md:flex-row
        gap-8
        p-6
        "
      >



        <aside
          className="
          md:w-64
          flex
          flex-col
          gap-3
          "
        >

          <p
            className="
            font-bold
            text-muted-foreground
            "
          >
            어떤 감정인가요?
          </p>



          {
            MOODS.map(
              mood => (

                <button
                  key={mood.id}
                  disabled={isLoading}
                  onClick={() =>
                    handleMoodSelect(
                      mood.id
                    )
                  }

                  className={`
                  p-3
                  rounded-xl
                  text-left
                  font-bold
                  transition
                  ${
                    selectedMood === mood.id
                    ?
                    "bg-accent text-accent-foreground"
                    :
                    "bg-card border border-border"
                  }
                  `}
                >

                  {mood.emoji}
                  {" "}
                  {mood.label}

                </button>

              )
            )
          }


        </aside>





        <section
          className="
          flex-1
          flex
          items-center
          justify-center
          "
        >

          <Card
            className="
            w-full
            max-w-3xl
            p-8
            rounded-2xl
            "
          >


            {
              isLoading
              ?

              <div
                className="
                flex
                justify-center
                "
              >
                <Spinner/>
              </div>


              :

              error

              ?

              <p
                className="
                text-red-400
                "
              >
                {error}
              </p>


              :

              currentSong

              ?

              <>


              <div
                className="
                text-center
                mb-6
                "
              >

                <h1
                  className="
                  text-3xl
                  font-bold
                  "
                >
                  {currentSong.title}
                </h1>


                <p
                  className="
                  text-muted-foreground
                  "
                >
                  {currentSong.artist}
                </p>


              </div>




              {
                currentSong.youtubeId &&
                (

                <iframe

                  className="
                  w-full
                  aspect-video
                  rounded-xl
                  "
                  
                  src={
                    `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1`
                  }

                  allow="
                  autoplay;
                  encrypted-media;
                  "
                />

                )
              }





              <div
                className="
                flex
                justify-center
                gap-4
                mt-6
                "
              >


                <Button
                  onClick={
                    handleLike
                  }
                  variant="outline"
                >

                  {
                    currentSong.liked
                    ?
                    "❤️ 좋아요"
                    :
                    "🤍 좋아요"
                  }

                </Button>



                <Button
                  onClick={() =>
                    fetchRecommendation(
                      selectedMood
                    )
                  }
                >

                  다른 곡 추천

                </Button>


              </div>



              </>


              :

              <div
                className="
                text-center
                text-muted-foreground
                "
              >

                감정을 선택하세요

              </div>

            }



          </Card>


        </section>


      </main>


    </div>

  );

}
