import React, { useState, useRef } from "react";
import style from "./Bucket.module.css";
import { VscAdd } from "react-icons/vsc";
import Card from "./Card";

let obj = {};

const Bucket = () => {
  const [bucketName, setbucketName] = useState("");
  const [bucket, setbucket] = useState([]);
  const [listNo, setlistNo] = useState(-1);

  const [openCard, setopencard] = useState(false);
  const [Open, isopen] = useState(false);

  const cardNameRef = useRef();
  const videoLinkRef = useRef();
  const inputRef = useRef();

  const handleClickCard = () => {
    setopencard(!openCard);
  };

  const handleBucketNumber = (no) => {
    setlistNo(no);
    setbucketName(bucket[no]);
  };

  const PopupCard = () => {
    return (
      <div className={style.popup}>
        <label className={style.popuplabel}>Card Name</label>
        <input type="text" className={style.popupinput} ref={cardNameRef} />
        <label className={style.popuplabel}>Video Link</label>
        <input type="text" className={style.popupinput} ref={videoLinkRef} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button className={style.popupbutton} type="submit" onClick={AddCard}>
            Add
          </button>
          <button className={style.popupbutton} onClick={handleClickCard}>
            Close
          </button>
        </div>
      </div>
    );
  };

  const handleClick = () => {
    isopen(!Open);
  };

  const AddBucket = () => {
    const newBucket = inputRef.current.value;
    setbucket((prevValue) => {
      return [...prevValue, newBucket];
    });
    inputRef.current.value = "";
    handleClick(false);
  };

  const AddCard = () => {
    const name = cardNameRef.current.value;
    const link = videoLinkRef.current.value;

    cardNameRef.current.value = "";
    videoLinkRef.current.value = "";

    //const currentBucket = bucket[listNo];
    console.log(bucketName, name, link);

    if (!obj[bucketName]) obj[bucketName] = [];

    obj[bucketName].push({ name, link });
    //console.log(obj[bucketName]);

    obj[bucketName].map( card => (
        console.log(card.name , card.link)
    ));

    handleClickCard();
  };

  const Popup = () => {
    return (
      <div className={style.popup}>
        <label className={style.popuplabel}>Bucket Name</label>
        <input type="text" className={style.popupinput} ref={inputRef} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            className={style.popupbutton}
            onClick={AddBucket}
            type="submit"
          >
            Add
          </button>
          <button className={style.popupbutton} onClick={handleClick}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={style.body}>
      {Open && <Popup />}
      {openCard && <PopupCard />}
      <div className={style.leftSide}>
        <div className={style.leftText}>
          <h1 className={style.text}>BUCKETS</h1>
          <VscAdd
            className={style.addButton}
            fill="#fff"
            onClick={handleClick}
          />
        </div>
        <div className={style.bucketlist}>
          {bucket.map((x, id) => (
            <h2
              className={style.bucketitem}
              key={id}
              onClick={() => handleBucketNumber(id)}
              style={{
                backgroundColor: listNo === id ? "#fff" : "",
                color: listNo === id ? "#8F43EE" : "",
              }}
            >
              {x}
            </h2>
          ))}
        </div>
      </div>
      <div className={style.rightSide}>
        <button className={style.addCard} onClick={handleClickCard}>
          ADD CARD +
        </button>
        <h1 className={style.text}> CARDS</h1>
        <div className={style.grid}>
          { obj[bucketName]?
            obj[bucketName].map( card => (
                <Card name={card.name} link={card.link}/>
            )):
            <h2>CARD LIST IS EMPTY</h2>
        }
       
        </div>
      </div>
    </div>
  );
};

export default Bucket;
