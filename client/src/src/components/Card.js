import React from 'react';
import style from './Card.module.css';

const Card = ({name,link})=>{
    return(
       <div className={style.card}>
          <h1 className={style.cardName}>{name}</h1>
          <h2 className={style.videolink}>LINK: {link}</h2>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            className={style.cardbutton}
            type="submit"
          >
            Delete
          </button>
          <button className={style.cardbutton}>
             Replace
          </button>
        </div>
       </div>
    );
}

export default Card;