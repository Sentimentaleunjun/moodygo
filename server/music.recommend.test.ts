import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";


function createPublicContext(): TrpcContext {

  const ctx: TrpcContext = {

    user:null,

    req:{
      protocol:"https",
      headers:{},
    } as TrpcContext["req"],


    res:{} as TrpcContext["res"],

  };


  return ctx;

}



describe("music.recommend",()=>{


  it(
    "should return a song recommendation from emotion text",
    async()=>{


      const ctx =
        createPublicContext();


      const caller =
        appRouter.createCaller(ctx);



      const result =
        await caller.music.recommend({

          text:
            "나는 오늘 너무 슬프고 힘들어"

        });



      expect(result.success)
        .toBe(true);



      if(result.success){

        expect(result.song)
          .toBeDefined();


        expect(result.song?.title)
          .toBeDefined();


        expect(result.song?.artist)
          .toBeDefined();


        expect(typeof result.song?.title)
          .toBe("string");


        expect(typeof result.song?.artist)
          .toBe("string");


      }

    }

  );





  it(
    "should handle different emotion texts",
    async()=>{


      const ctx =
        createPublicContext();



      const caller =
        appRouter.createCaller(ctx);



      const texts = [

        "나는 너무 우울하고 슬퍼",

        "오늘 정말 행복하고 기분이 좋아",

        "조용히 쉬고 싶고 편안해",

        "너무 신나고 에너지가 넘쳐",

        "옛날 생각이 나서 그리워"

      ];





      for(const text of texts){


        const result =
          await caller.music.recommend({

            text

          });



        expect(result.success)
          .toBe(true);



        if(result.success){


          expect(result.song)
            .toBeDefined();


          expect(result.song?.title)
            .toBeDefined();


          expect(result.song?.artist)
            .toBeDefined();


        }


      }


    }

  );


});