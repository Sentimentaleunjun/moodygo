import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";


const GENRES = [
  "K-POP",
  "J-POP",
  "POP",
  "R&B",
  "인디",
  "힙합",
  "클래식",
  "밴드",
];


const MOODS = [
  "신남",
  "차분함",
  "슬픔",
  "설렘",
  "행복",
];


export default function Setup() {

  const [, setLocation] =
    useLocation();


  const [genres,setGenres] =
    useState<string[]>([]);


  const [moods,setMoods] =
    useState<string[]>([]);



  const toggle =
    (
      value:string,
      list:string[],
      setter:(v:string[])=>void
    ) => {

      if(list.includes(value)){

        setter(
          list.filter(
            x=>x!==value
          )
        );

      }else{

        setter(
          [
            ...list,
            value
          ]
        );

      }

    };




  const guestStart =
    () => {

      sessionStorage.setItem(
        "moodygo_guest",
        "true"
      );

      setLocation("/app");

    };



  const savePreference =
    async () => {


      // 다음 단계에서
      // userPreferences API 연결


      setLocation("/app");

    };



  return (

    <div
      className="
      min-h-screen
      bg-background
      flex
      items-center
      justify-center
      p-6
      "
    >


      <Card
        className="
        max-w-xl
        w-full
        p-8
        rounded-2xl
        "
      >


        <h1
          className="
          text-3xl
          font-bold
          mb-2
          "
        >
          MoodyGo 설정
        </h1>


        <p
          className="
          text-muted-foreground
          mb-8
          "
        >
          음악 취향을 알려주세요
        </p>



        <h2
          className="
          font-bold
          mb-3
          "
        >
          좋아하는 장르
        </h2>



        <div
          className="
          grid
          grid-cols-2
          gap-3
          mb-8
          "
        >

        {
          GENRES.map(
            genre=>(

              <button
                key={genre}
                onClick={()=>
                  toggle(
                    genre,
                    genres,
                    setGenres
                  )
                }

                className={`
                p-3
                rounded-xl
                border
                font-bold

                ${
                  genres.includes(genre)
                  ?
                  "bg-accent text-accent-foreground"
                  :
                  "bg-card"
                }
                `}
              >

                {genre}

              </button>

            )
          )
        }

        </div>




        <h2
          className="
          font-bold
          mb-3
          "
        >
          자주 듣는 분위기
        </h2>


        <div
          className="
          flex
          flex-wrap
          gap-3
          mb-8
          "
        >

        {
          MOODS.map(
            mood=>(

              <button
                key={mood}
                onClick={()=>
                  toggle(
                    mood,
                    moods,
                    setMoods
                  )
                }

                className={`
                px-4
                py-2
                rounded-full
                border

                ${
                  moods.includes(mood)
                  ?
                  "bg-accent text-accent-foreground"
                  :
                  "bg-card"
                }

                `}
              >

                {mood}

              </button>

            )
          )
        }

        </div>




        <Button
          className="
          w-full
          mb-3
          "
          onClick={savePreference}
        >

          시작하기

        </Button>




        <Button
          variant="outline"
          className="
          w-full
          "
          onClick={guestStart}
        >

          게스트로 시작
          (저장 안 함)

        </Button>



      </Card>


    </div>

  );

}
