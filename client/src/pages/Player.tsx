import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Headphones, RotateCw, Sparkles } from "lucide-react";
import { useState } from "react";


const MOODS = [
  {
    id:"sad",
    label:"우울",
    emoji:"🌧️"
  },
  {
    id:"calm",
    label:"차분",
    emoji:"☕"
  },
  {
    id:"happy",
    label:"행복",
    emoji:"✨"
  },
  {
    id:"excited",
    label:"신남",
    emoji:"🔥"
  },
  {
    id:"excited_romantic",
    label:"설렘",
    emoji:"🌸"
  }
];



export default function Player(){


const [mood,setMood] =
useState("calm");


const [intensity,setIntensity] =
useState(50);



const recommend =
trpc.music.recommend.useMutation();





function changeDial(
value:number
){

setIntensity(value);


if(
navigator.vibrate
){

navigator.vibrate(10);

}


}





function recommendSong(){

recommend.mutate({

mood,

intensity

});

}




return (

<div

className="
min-h-screen
overflow-hidden
bg-gradient-to-br
from-purple-950
via-zinc-900
to-black
text-white
"

>



<header

className="
p-6
flex
items-center
gap-3
"

>

<Headphones/>

<h1
className="
text-3xl
font-black
"
>
MoodyGo
</h1>


</header>






<main

className="
flex
flex-col
items-center
justify-center
min-h-[80vh]
px-5
"

>




<h2

className="
text-4xl
font-black
"

>

지금 기분은?

</h2>


<p

className="
mt-3
text-white/60
"

>

감정과 강도를 조절하세요

</p>








<div

className="
flex
gap-3
flex-wrap
justify-center
mt-8
"

>


{
MOODS.map(item=>(

<button

key={item.id}

onClick={()=>setMood(item.id)}

className={`
px-5
py-3
rounded-full
border
transition

${
mood===item.id
?
"bg-white text-black"
:
"bg-white/10"
}

`}

>

{item.emoji}
{" "}
{item.label}

</button>


))
}


</div>









<div

className="
relative
mt-14
"

>



<div

className="
w-80
h-80
rounded-full
border-[14px]
border-white/20
bg-white/5
backdrop-blur-xl
flex
items-center
justify-center
shadow-2xl
"

>


<input

type="range"

min="0"

max="100"

value={intensity}

onChange={
e=>
changeDial(
Number(e.target.value)
)
}

className="
absolute
w-80
h-80
opacity-0
cursor-pointer
"

/>



<div
className="
text-center
"
>


<div

className="
text-7xl
font-black
"

>

{intensity}

</div>


<div
className="
text-white/50
tracking-widest
"
>

MOOD

</div>


</div>


</div>


</div>








<Button

onClick={recommendSong}

disabled={
recommend.isPending
}

className="
mt-12
rounded-full
px-10
py-6
text-lg
font-bold
"

>

<Sparkles
className="mr-2"
/>

{
recommend.isPending
?
"추천 중..."
:
"음악 추천"
}

</Button>









{
recommend.data?.success &&


<Card

className="
mt-10
w-full
max-w-xl
bg-white/10
border-white/20
text-white
rounded-3xl
p-8
"

>


<div
className="
text-5xl
"
>

🎧

</div>



<h2

className="
text-4xl
font-black
mt-4
"

>

{
recommend.data.song.title
}

</h2>




<p

className="
text-xl
text-white/70
"

>

{
recommend.data.song.artist
}

</p>





<p

className="
mt-5
text-white/60
"

>

{
recommend.data.song.reason
}

</p>






{
recommend.data.song.youtubeId &&

<iframe

className="
mt-6
w-full
aspect-video
rounded-2xl
"

src={
`https://www.youtube.com/embed/${recommend.data.song.youtubeId}?autoplay=1`
}

allow="
autoplay
"

/>

}





<Button

onClick={recommendSong}

className="
mt-6
rounded-full
"

>

<RotateCw
className="mr-2"
/>

다른 곡

</Button>



</Card>


}





</main>


</div>


);

}