import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";


interface RecommendedSong {

  title:string;

  artist:string;

  youtubeId?:string;

  timestamp:number;

}



const MOODS = [

{
 id:"sad",
 label:"우울함",
 emoji:"🌧️"
},

{
 id:"excited",
 label:"신남",
 emoji:"🔥"
},

{
 id:"happy",
 label:"즐거움",
 emoji:"✨"
},

{
 id:"calm",
 label:"차분함",
 emoji:"☕"
},

{
 id:"excited_romantic",
 label:"설렘",
 emoji:"🌸"
},

];



export default function Player(){

const [,setLocation]
=useLocation();



const [selectedMood,setSelectedMood]
=useState("happy");



const [currentSong,setCurrentSong]
=useState<RecommendedSong|null>(null);



const [history,setHistory]
=useState<RecommendedSong[]>([]);



const [loading,setLoading]
=useState(false);



const [error,setError]
=useState("");



const recommend =
trpc.music.recommend.useMutation();





const getSong =
async()=>{


setLoading(true);

setError("");



try{


const result =
await recommend.mutateAsync({

mood:selectedMood

});



if(
result.success &&
result.song
){


const song={

...result.song,

timestamp:
Date.now(),

};



setCurrentSong(song);


setHistory(prev=>[
...prev,
song
]);



}

else{


setError(
result.error ??
"추천 실패"
);

}


}catch(e){


setError(
"오류 발생"
);


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
flex-col
"
>


<header
className="
flex
justify-between
items-center
px-6
md:px-12
py-6
border-b
border-border
"
>


<div
className="
text-2xl
font-bold
text-accent
cursor-pointer
"
onClick={()=>
setLocation("/")
}
>

🎧 MoodyGo!

</div>



<Button

variant="outline"

onClick={()=>
setLocation("/")
}

>

처음으로

</Button>


</header>





<main
className="
flex-1
flex
flex-col
md:flex-row
gap-8
p-6
md:p-12
"
>




<div
className="
w-full
md:w-72
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

현재 기분

</p>



{
MOODS.map(
(mood)=>(


<button

key={mood.id}

onClick={()=>
setSelectedMood(
mood.id
)
}

className={`

p-4

rounded-xl

border

text-left

font-semibold

transition-all


${
selectedMood===mood.id

?

"bg-accent text-accent-foreground"

:

"bg-card hover:border-accent"

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


</div>







<Card

className="
flex-1
p-8
rounded-2xl
flex
flex-col
gap-6
"

>


<div
className="
text-center
"
>


<h1
className="
text-3xl
font-bold
"
>

MoodyGo Player

</h1>


<p
className="
text-muted-foreground
"
>

감정 기반 AI 음악 추천

</p>


</div>







<div

className="
bg-gradient-to-br
from-foreground
to-foreground/80

rounded-xl

min-h-40

flex

items-center

justify-center

text-center

p-6

"

>


{

loading ?

<Spinner />

:

currentSong ?

<div>

<h2
className="
text-2xl
font-bold
text-accent-foreground
"
>

{currentSong.title}

</h2>


<p
className="
text-accent-foreground/70
"
>

{currentSong.artist}

</p>


</div>


:

<p
className="
text-accent-foreground/70
"
>

음악을 추천받아보세요

</p>


}


</div>







{
currentSong?.youtubeId &&

<iframe

className="
w-full
aspect-video
rounded-xl
"

src={

`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1`

}

title="youtube player"

allow="
autoplay;
encrypted-media;
"

 />

}







{
error &&

<p
className="
text-red-500
text-center
"
>

{error}

</p>

}







<Button

onClick={getSong}

disabled={loading}

className="
rounded-full
bg-accent
text-accent-foreground
font-bold
py-6
"

>


{loading
?
"추천 중..."
:
"다른 곡 추천받기"
}


</Button>




</Card>



</main>



</div>


);

}
