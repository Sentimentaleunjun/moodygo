import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { userPreferences } from "../drizzle/schema";
import { getDb } from "./db";

import axios from "axios";

import { songs } from "./data/songs";

import {
  recommendSongs,
  recommendByText,
} from "./services/recommendationEngine";

import {
  analyzeEmotion
} from "./services/emotionEngine";

import {
  generateReason
} from "./services/reasonGenerator";





async function searchYouTube(
  query:string,
  apiKey:string
){


  try{


    const response =
      await axios.get(

        "https://www.googleapis.com/youtube/v3/search",

        {

          params:{

            part:"snippet",

            q:query,

            type:"video",

            maxResults:1,

            key:apiKey

          }

        }

      );



    const item =
      response.data.items?.[0];



    if(!item)
      return null;



    return {

      youtubeId:
        item.id.videoId,


      thumbnail:
        item.snippet?.thumbnails?.high?.url

    };


  }catch(error){

    console.error(
      "youtube error",
      error
    );


    return null;

  }


}





export const appRouter =
router({



system:
  systemRouter,





auth:router({


  me:

  publicProcedure

  .query(
    ({ctx})=>
      ctx.user
  ),





  logout:

  publicProcedure

  .mutation(

    ({ctx})=>{


      const cookieOptions =
        getSessionCookieOptions(
          ctx.req
        );



      ctx.res.clearCookie(

        COOKIE_NAME,

        {

          ...cookieOptions,

          maxAge:-1

        }

      );



      return {

        success:true

      };


    }

  )


}),







music:router({






savePreference:


publicProcedure


.input(

z.object({

  genres:
  z.array(
    z.string()
  ),


  moods:
  z.array(
    z.string()
  )


})

)



.mutation(

async({ctx,input})=>{


if(!ctx.user){

return {

success:false,

message:"guest"

};

}



const db =
await getDb();



if(!db){

return {

success:false,

message:"database unavailable"

};

}





await db

.insert(userPreferences)

.values({

userId:
ctx.user.id,


genres:
JSON.stringify(
input.genres
),


moods:
JSON.stringify(
input.moods
)


});




return {

success:true

};


}

),








recommend:

publicProcedure


.input(

z.object({


  mood:

  z.string()

  .optional(),



  energy:

  z.number()

  .min(0)

  .max(100)

  .optional(),



  // 기존 테스트 호환

  text:

  z.string()

  .optional()


})

)



.mutation(

async({input})=>{



let song;



if(input.text){


  song =
    recommendByText(
      input.text
    );


}

else{


  song =
    recommendSongs({

      mood:
        input.mood ??
        "calm",


      energy:
        input.energy ??
        50

    });


}





const emotion =
analyzeEmotion(

  input.mood ??
  input.text ??
  ""

);






const reason =
generateReason(

  song,

  emotion

);






let youtube =
null;



const apiKey =
process.env.YOUTUBE_API_KEY;



if(apiKey){


youtube =
await searchYouTube(

`${song.title} ${song.artist}`,

apiKey

);


}





return {


success:true,



song:{


  ...song,


  reason,


  ...(youtube ?? {})


},



emotion,



youtube



};



}



)



})




});





export type AppRouter =
typeof appRouter;