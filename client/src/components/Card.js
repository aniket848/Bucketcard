import React, { useRef, useState } from "react";
import style from "./Card.module.css";
import ReactPlayer from "react-player";
import BASE_URL from "./helper";

const Card = ({ name, link, deleteCard, replaceCard }) => {
  const inputRef = useRef();
  const [Open, isopen] = useState(false);

  const remove = () => {
    console.log("from card = ", name);
    deleteCard(name);
  };

  const clickhandle = () => {
    isopen(!Open);
  };

  const replace = () => {
    const destBucket = inputRef.current.value.toUpperCase();
    if (destBucket === "") {
      alert("ENTER VALID BUCKET NAME");
      clickhandle();
      return;
    }

    replaceCard(destBucket, name, link);
  };

  const Popup = () => {
    return (
      <div className={style.popup}>
        <label className={style.popuplabel}>
          Bucket Name in which you want to replaced the Card
        </label>
        <input type="text" className={style.popupinput} ref={inputRef} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            className={style.popupbutton}
            type="submit"
            onClick={() => replace()}
          >
            Replace
          </button>
          <button className={style.popupbutton} onClick={() => clickhandle()}>
            Close
          </button>
        </div>
      </div>
    );
  };

  const videoStart = async() => {
    
    const date = new Date().toLocaleString();
    console.log(name, link, date);
    let res = await fetch(`${BASE_URL}/addhistory`,{
       method:"POST",
       headers:{
         "Content-Type":"application/json"
       },
       body:JSON.stringify({
          name,link,date
       })
    });

    res = await res.json();
    console.log(res);
  };

  return (
    <div className={style.card}>
      {Open && <Popup />}
      <h1 className={style.cardName}>{name}</h1>

      <ReactPlayer
        className={style.cardNam}
        url={link}
        controls
        width="100%"
        height="100%"
        onStart={() => videoStart()}
      />

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button
          className={style.cardbutton}
          type="submit"
          onClick={() => remove()}
        >
          Delete
        </button>
        <button className={style.cardbutton} onClick={() => clickhandle()}>
          Replace
        </button>
      </div>
    </div>
  );
};

export default Card;
