import type { Mood } from "./mood";


export interface Song {

  id:number;

  title:string;

  artist:string;

  youtubeId:string;

  thumbnail:string;

  moods:Mood[];

  energy:number;

  genres:string[];

  tags:string[];
}



export const songs:Song[] = [

  {
    id:1,

    title:"Fix You",
    artist:"Coldplay",

    youtubeId:"",
    thumbnail:"",

    moods:[
      "sad",
      "tired",
      "calm"
    ],

    energy:35,

    genres:[
      "alternative rock"
    ],

    tags:[
      "comfort",
      "healing",
      "hope"
    ]
  },


  {
    id:2,

    title:"Universe",
    artist:"Official髭男dism",

    youtubeId:"",
    thumbnail:"",

    moods:[
      "happy",
      "nostalgic",
      "romantic"
    ],

    energy:65,

    genres:[
      "j-pop"
    ],

    tags:[
      "warm",
      "emotional"
    ]
  },


  {
    id:3,

    title:"ダンスホール",
    artist:"Mrs. GREEN APPLE",

    youtubeId:"",
    thumbnail:"",

    moods:[
      "happy",
      "energetic"
    ],

    energy:90,

    genres:[
      "j-pop"
    ],

    tags:[
      "positive",
      "bright"
    ]
  }

];