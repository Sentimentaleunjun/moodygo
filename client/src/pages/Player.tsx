import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
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

  const recommendMutation =
    trpc.music.recommend.useMutation();


  useEffect(() => {

    const saved =
      localStorage.getItem("moodygo-history");

    if(saved){
      try{
        const data =
          JSON.parse(saved);

        setSongHistory(data);

        if(data.length){
          setCurrentSongIndex(
            data.length - 1
          );
        }

      }catch{}
    }

  }, []);


  useEffect(() => {

    localStorage.setItem(
      "moodygo-history",
      JSON.stringify(songHistory)
    );

  }, [songHistory]);



  const fetchRecommendation =
    async(mood:string)=>{

      setIsLoading(true);
      setError(null);

      try{

        const result =
          await recommendMutation.mutateAsync({
            mood
          });


        if(result.success && result.song){

          const song:RecommendedSong = {
            ...result.song,
            timestamp:Date.now()
          };


          setSongHistory(prev=>[
            ...prev,
            song
          ]);


          setCurrentSongIndex(
            songHistory.length
          );


        }else{

          setError(
            result.error ??
            "추천 실패"
          );

        }


      }catch(e){

        setError(
          e instanceof Error
          ? e.message
          : "오류 발생"
        );

      }finally{

        setIsLoading(false);

      }

    };



  const handleMoodSelect =
    async(id:string)=>{

      setSelectedMood(id);

      await fetchRecommendation(id);

    };



  const currentSong =
    currentSongIndex >= 0
    ? songHistory[currentSongIndex]
    : null;



  return (
    <div className="min-h-screen w-full bg-background flex flex-col">


      <header className="flex justify-between items-center px-6 py-5 border-b border-border">

        <div
          onClick={()=>setLocation("/")}
          className="text-2xl font-bold text-accent cursor-pointer"
        >
          🎧 MoodyGo!
        </div>


        <Button
          variant="outline"
          onClick={()=>setLocation("/")}
        >
          처음으로
        </Button>

      </header>



      <main className="flex-1 flex flex-col md:flex-row gap-8 p-6">


        <aside className="md:w-64">

          <h2 className="font-bold mb-4">
            어떤 감정인가요?
          </h2>


          <div className="flex flex-wrap md:flex-col gap-3">

          {
            MOODS.map(mood=>(

              <button
                key={mood.id}
                disabled={isLoading}
                onClick={()=>
                  handleMoodSelect(mood.id)
                }
                className={`
                  p-3 rounded-xl text-left
                  transition-all
                  ${
                    selectedMood===mood.id
                    ?
                    "bg-accent text-accent-foreground"
                    :
                    "bg-card border border-border hover:border-accent"
                  }
                `}
              >

                {mood.emoji} {mood.label}

              </button>

            ))
          }

          </div>

        </aside>
                <section className="flex-1 flex items-center justify-center">

          <Card className="w-full max-w-3xl p-6 rounded-2xl">

            <div className="flex justify-center mb-6">

              <div className="bg-accent/10 text-accent px-4 py-2 rounded-full font-bold">

                {
                  isLoading
                  ?
                  "추천 중..."
                  :
                  currentSong
                  ?
                  `🎵 ${currentSong.title}`
                  :
                  "감정을 선택하세요"
                }

              </div>

            </div>



            <div
              className="
              bg-gradient-to-br
              from-foreground
              to-foreground/80
              rounded-xl
              p-8
              text-center
              text-accent-foreground
              min-h-40
              flex
              flex-col
              justify-center
              "
            >

              {
                isLoading
                ?

                <Spinner className="mx-auto w-8 h-8"/>

                :

                error

                ?

                <p className="text-red-400">
                  {error}
                </p>

                :

                currentSong

                ?

                <>

                  <h1 className="text-3xl font-bold">

                    {currentSong.title}

                  </h1>


                  <p className="mt-2 opacity-70">

                    {currentSong.artist}

                  </p>

                </>


                :

                <p>
                  당신의 감정을 선택하면
                  음악을 추천합니다
                </p>

              }

            </div>



            {
              currentSong?.youtubeId
              &&

              <div
                className="
                mt-6
                aspect-video
                rounded-xl
                overflow-hidden
                "
              >

                <iframe

                  width="100%"
                  height="100%"

                  src={
                    `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1`
                  }

                  title={
                    currentSong.title
                  }

                  allow="
                    autoplay;
                    encrypted-media;
                    picture-in-picture
                  "

                  allowFullScreen

                  className="border-0"

                />

              </div>

            }



            {
              currentSong &&
              !currentSong.youtubeId
              &&

              <div
                className="
                mt-6
                aspect-video
                rounded-xl
                bg-muted
                flex
                items-center
                justify-center
                "
              >

                YouTube 영상을 찾을 수 없습니다.

              </div>

            }




            <div
              className="
              mt-6
              flex
              gap-3
              "
            >


              <Button

                className="
                flex-1
                bg-accent
                text-accent-foreground
                rounded-full
                "

                disabled={isLoading}

                onClick={()=>
                  fetchRecommendation(
                    selectedMood
                  )
                }

              >

                🔀 다른 곡 추천

              </Button>



              <Button

                variant="outline"

                disabled={
                  currentSongIndex <= 0
                }

                onClick={()=>{

                  setCurrentSongIndex(
                    currentSongIndex-1
                  );

                }}

              >

                ◀

              </Button>



              <Button

                variant="outline"

                disabled={
                  currentSongIndex >=
                  songHistory.length-1
                }

                onClick={()=>{

                  setCurrentSongIndex(
                    currentSongIndex+1
                  );

                }}

              >

                ▶

              </Button>


            </div>





            {
              songHistory.length > 0
              &&

              <div className="mt-8">

                <h3 className="font-bold mb-3">

                  추천 기록

                </h3>


                <div className="space-y-2">


                  {
                    songHistory
                    .slice()
                    .reverse()
                    .map((song,index)=>(

                      <button

                        key={song.timestamp}

                        onClick={()=>{

                          setCurrentSongIndex(
                            songHistory.length -
                            1 -
                            index
                          );

                        }}

                        className="
                        w-full
                        text-left
                        p-3
                        rounded-lg
                        bg-muted
                        hover:bg-accent/20
                        transition
                        "

                      >

                        <div className="font-semibold">

                          {song.title}

                        </div>


                        <div
                          className="
                          text-sm
                          text-muted-foreground
                          "
                        >

                          {song.artist}

                        </div>


                      </button>

                    ))

                  }


                </div>

              </div>

            }



          </Card>


        </section>


      </main>


    </div>
  );

}
