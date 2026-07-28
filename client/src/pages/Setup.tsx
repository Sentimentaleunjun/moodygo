import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";


const GENRES = [
  "J-POP",
  "K-POP",
  "POP",
  "ROCK",
  "R&B",
  "HIP-HOP",
  "CLASSIC",
  "LO-FI",
];


const MOODS = [
  {
    id: "happy",
    label: "행복한",
    emoji: "✨",
  },
  {
    id: "sad",
    label: "우울한",
    emoji: "🌧️",
  },
  {
    id: "excited",
    label: "신나는",
    emoji: "🔥",
  },
  {
    id: "calm",
    label: "차분한",
    emoji: "☕",
  },
  {
    id: "excited_romantic",
    label: "설레는",
    emoji: "🌸",
  },
];


export default function Setup() {

  const [, setLocation] =
    useLocation();


  const { user } =
    useAuth();


  const [genres, setGenres] =
    useState<string[]>([]);


  const [moods, setMoods] =
    useState<string[]>([]);


  const [loading, setLoading] =
    useState(false);


  const savePreference =
    trpc.music.savePreference.useMutation();



  const toggleGenre = (
    genre:string
  ) => {

    setGenres((prev)=>
      prev.includes(genre)
        ? prev.filter(
            (item)=>item !== genre
          )
        : [
            ...prev,
            genre,
          ]
    );

  };



  const toggleMood = (
    mood:string
  ) => {

    setMoods((prev)=>
      prev.includes(mood)
        ? prev.filter(
            (item)=>item !== mood
          )
        : [
            ...prev,
            mood,
          ]
    );

  };



  const handleStart =
    async()=>{


      if(loading)
        return;



      setLoading(true);



      try{


        if(user){

          await savePreference.mutateAsync({

            genres,

            moods,

          });

        }



        setLocation("/app");



      }catch(error){

        console.error(
          error
        );

        setLocation("/app");

      }

      finally{

        setLoading(false);

      }

    };



  return (

    <div
      className="
      min-h-screen
      w-full
      bg-background
      flex
      items-center
      justify-center
      px-4
      "
    >

      <Card
        className="
        w-full
        max-w-2xl
        p-8
        rounded-2xl
        border
        "
      >

        <div
          className="
          text-center
          mb-8
          "
        >

          <h1
            className="
            text-4xl
            font-bold
            text-foreground
            mb-3
            "
          >
            당신의 음악 취향은?
          </h1>


          <p
            className="
            text-muted-foreground
            "
          >
            AI가 더 정확한 음악을 추천하도록 알려주세요
          </p>

        </div>



        <section
          className="
          mb-8
          "
        >

          <h2
            className="
            font-bold
            text-lg
            mb-4
            "
          >
            좋아하는 장르
          </h2>


          <div
            className="
            flex
            flex-wrap
            gap-3
            "
          >

            {GENRES.map(
              (genre)=>(

                <button
                  key={genre}
                  onClick={()=>
                    toggleGenre(genre)
                  }
                  className={`
                    px-4
                    py-2
                    rounded-full
                    border
                    font-semibold
                    transition-all

                    ${
                    genres.includes(genre)
                    ?
                    "bg-accent text-accent-foreground"
                    :
                    "bg-card text-foreground hover:border-accent"
                    }
                  `}
                >

                  {genre}

                </button>

              )
            )}

          </div>

        </section>




        <section
          className="
          mb-8
          "
        >

          <h2
            className="
            font-bold
            text-lg
            mb-4
            "
          >
            자주 듣는 분위기
          </h2>


          <div
            className="
            grid
            grid-cols-2
            gap-3
            "
          >

            {MOODS.map(
              (mood)=>(

                <button
                  key={mood.id}
                  onClick={()=>
                    toggleMood(
                      mood.id
                    )
                  }

                  className={`
                    p-4
                    rounded-xl
                    border
                    font-semibold
                    transition-all

                    ${
                    moods.includes(mood.id)
                    ?
                    "bg-accent text-accent-foreground"
                    :
                    "bg-card text-foreground hover:border-accent"
                    }

                  `}
                >

                  <span
                    className="
                    text-xl
                    mr-2
                    "
                  >
                    {mood.emoji}
                  </span>

                  {mood.label}

                </button>

              )
            )}

          </div>


        </section>




        <Button

          onClick={handleStart}

          disabled={
            loading
          }

          className="
          w-full
          py-6
          rounded-full
          bg-accent
          text-accent-foreground
          font-bold
          text-lg
          "

        >

          {loading
            ?
            "준비 중..."
            :
            "MoodyGo 시작하기"
          }


        </Button>



      </Card>


    </div>

  );

}
