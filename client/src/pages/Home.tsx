import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Sparkles } from "lucide-react";


const MOODS = [
  {
    id:"sad",
    label:"우울",
    emoji:"🌧️",
  },
  {
    id:"calm",
    label:"차분",
    emoji:"☕",
  },
  {
    id:"happy",
    label:"행복",
    emoji:"✨",
  },
  {
    id:"energetic",
    label:"신남",
    emoji:"🔥",
  },
  {
    id:"romantic",
    label:"설렘",
    emoji:"🌸",
  },
];



export default function Home(){


const [mood,setMood] =
useState("calm");


const [energy,setEnergy] =
useState(50);



const recommend =
trpc.music.recommend.useMutation();




function changeEnergy(
value:number
){


setEnergy(value);



if(
typeof navigator !== "undefined" &&
navigator.vibrate
){

navigator.vibrate(8);

}


}





function handleRecommend(){


recommend.mutate({

mood,

energy

});


}





return (

<main
className="
min-h-screen
overflow-hidden
relative
bg-gradient-to-br
from-background
via-background
to-accent/10
flex
items-center
justify-center
text-foreground
p-6
"
>


<div
className="
absolute
top-[-180px]
left-1/2
-translate-x-1/2
w-[500px]
h-[500px]
rounded-full
bg-accent/20
blur-3xl
"
/>



<section
className="
relative
z-10
w-full
max-w-xl
text-center
"
>


<div
className="
mb-8
"
>

<div
className="
inline-flex
items-center
gap-2
rounded-full
bg-accent/10
px-5
py-2
text-accent
font-bold
"
>

<Sparkles size={18}/>

MoodyGo

</div>


<h1
className="
mt-6
text-5xl
font-black
"
>
지금 기분은?
</h1>


<p
className="
mt-3
text-muted-foreground
"
>
감정의 온도를 맞춰 음악을 추천해요
</p>


</div>





<div
className="
flex
justify-center
gap-3
flex-wrap
mb-10
"
>

{
MOODS.map(item=>(

<button

key={item.id}

onClick={()=>setMood(item.id)}

className={`
rounded-full
px-5
py-3
border
transition-all

${
mood===item.id
?
"bg-accent text-accent-foreground scale-105"
:
"bg-background/50 hover:bg-accent/10"
}

`}

>

<span className="mr-2">
{item.emoji}
</span>

{item.label}

</button>

))

}

</div>






<div
className="
relative
mx-auto
w-[320px]
h-[320px]
rounded-full
bg-card
border
shadow-2xl
flex
items-center
justify-center
"
>


<div
className="
absolute
inset-5
rounded-full
bg-gradient-to-br
from-accent/30
to-transparent
"
/>



<div
className="
z-10
text-center
"
>


<p
className="
text-muted-foreground
font-bold
"
>
Energy
</p>


<p
className="
text-6xl
font-black
"
>
{energy}
</p>



<input

type="range"

min="0"

max="100"

value={energy}

onChange={
e=>
changeEnergy(
Number(e.target.value)
)
}

className="
absolute
bottom-[-30px]
left-0
w-full
"
/>


</div>



</div>





<button

onClick={handleRecommend}

disabled={recommend.isPending}

className="
mt-16
w-full
rounded-full
py-5
bg-accent
text-accent-foreground
font-black
text-xl
hover:scale-[1.02]
transition
disabled:opacity-50
"

>

{
recommend.isPending
?
"분석중..."
:
"음악 추천받기"
}

</button>





{
recommend.data?.success &&

<div
className="
mt-8
rounded-3xl
border
bg-card/50
p-6
text-left
"
>


<p
className="
text-sm
text-muted-foreground
"
>
추천곡
</p>


<h2
className="
text-3xl
font-black
mt-2
"
>
{
recommend.data.song.title
}
</h2>


<p
className="
text-muted-foreground
"
>
{
recommend.data.song.artist
}
</p>



<p
className="
mt-4
"
>
{
recommend.data.song.reason
}
</p>



</div>

}



{
recommend.error &&

<p
className="
mt-5
text-red-500
"
>
{
recommend.error.message
}
</p>

}



</section>


</main>

);


}