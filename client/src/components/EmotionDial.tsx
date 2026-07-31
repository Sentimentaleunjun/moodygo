import { useState } from "react";


interface EmotionDialProps {

  value:number;

  onChange:(value:number)=>void;

}


export default function EmotionDial({
  value,
  onChange,
}:EmotionDialProps){


  const [dragging,setDragging] =
    useState(false);



  function handleChange(
    e:React.ChangeEvent<HTMLInputElement>
  ){

    const newValue =
      Number(e.target.value);


    onChange(newValue);

  }



  return (

    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        p-8
        rounded-3xl
        backdrop-blur-xl
        bg-white/10
        border
        border-white/20
        shadow-xl
      "
    >


      <div
        className="
          relative
          w-48
          h-48
          rounded-full
          flex
          items-center
          justify-center
        "
        style={{
          background:
          `
          conic-gradient(
            #ffffff ${value}%,
            rgba(255,255,255,0.15) ${value}%
          )
          `
        }}
      >


        <div
          className="
            absolute
            w-40
            h-40
            rounded-full
            bg-black/30
            backdrop-blur-xl
            flex
            flex-col
            items-center
            justify-center
            text-white
          "
        >

          <span
            className="
              text-4xl
              font-bold
            "
          >
            {value}%
          </span>


          <span
            className="
              text-sm
              opacity-70
            "
          >
            Energy
          </span>


        </div>


      </div>



      <input

        type="range"

        min="0"

        max="100"

        value={value}

        onChange={handleChange}

        onMouseDown={()=>
          setDragging(true)
        }

        onMouseUp={()=>
          setDragging(false)
        }

        className="
          mt-8
          w-48
          accent-white
        "

      />


      <p
        className="
          mt-4
          text-white/70
          text-sm
        "
      >

        {value < 30 &&
          "차분한 상태"}

        {value >=30 &&
          value <70 &&
          "평균적인 상태"}

        {value >=70 &&
          "활기찬 상태"}

      </p>


    </div>

  );

}