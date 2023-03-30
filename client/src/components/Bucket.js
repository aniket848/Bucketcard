import React, { useState, useRef, useEffect } from "react";
import style from "./Bucket.module.css";
import { VscAdd } from "react-icons/vsc";
import Card from "./Card";
import BASE_URL from "./helper";
import ReactPlayer from "react-player";

// let obj = {};

const Bucket = () => {
  const [bucketName, setbucketName] = useState("");
  const [bucket, setbucket] = useState([]);
  const [obj, setobj] = useState({});
  const [listNo, setlistNo] = useState(-1);

  const [openCard, setopencard] = useState(false);
  const [Open, isopen] = useState(false);
  const [historytab, sethistorytab] = useState(false);

  const cardNameRef = useRef();
  const videoLinkRef = useRef();
  const inputRef = useRef();

  const [history, setHistory] = useState([]);

  const getHistory = async () => {
    console.log("history fulnc called");
    let res = await fetch(`${BASE_URL}/getHistory`);
    res = await res.json();
    console.log(res.data);
    setHistory(res.data);
  };

  const HistoryDiv = () => {
    return (
      
        <div className={style.Historydiv}>
          <h1 className={style.text}>HISTORY</h1>
          {history.length === 0 ? (
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginTop: "5rem",
              }}
            >
              NONE OF THE VIDEO IS PLAYED YET!
            </h2>
          ) : (
            <table className={style.historytable}>
              <tr className={style.tablerow} border={1}>
                <th className={style.tableheading}>CardName</th>
                <th className={style.tableheading}>CardLink</th>
                <th className={style.tableheading}>Time</th>
              </tr>
              {history.map((x) => (
                <tr className={style.tablerow}>
                  <td className={style.tablecolumn}>{x.name}</td>
                  <td className={style.tablecolumn}>
                    <ReactPlayer
                      className={style.cardNam}
                      url={x.link}
                      controls
                      width="80%"
                      height="50%"
                      style={{ margin: "auto" }}
                    />
                  </td>
                  <td className={style.tablecolumn}>{x.date}</td>
                </tr>
              ))}
            </table>
          )}
          <button
            className={style.historybutton}
            onClick={() => sethistorytab(!historytab)}
          >
            Close
          </button>
        </div>
        
          
   
    );
  };

  const handleHistoryCard = async () => {
    await getHistory();
    sethistorytab(!historytab);
  };

  const getData = async () => {
    const data = await fetch(`${BASE_URL}/getData`);
    const res = await data.json();
    console.log("HERE IS FULL DATA = ", res.data);
    setbucket([]);
    res.data.map((bucket, id) => (obj[bucket.bucketName] = bucket.cards));

    res.data.map((bucket, id) =>
      setbucket((prevValue) => {
        return [...prevValue, bucket.bucketName];
      })
    );

    //console.log("IBJECT = ",obj);
    console.log("BUCKET = ", bucket);
  };

  useEffect(() => {
    getData();
  }, []);

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
          <button
            className={style.popupbutton}
            type="submit"
            onClick={() => AddCard()}
          >
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

  const AddBucket = async () => {
    const newBucket = inputRef.current.value.toUpperCase();
    setbucket((prevValue) => {
      return [...prevValue, newBucket];
    });

    const res = await fetch(`${BASE_URL}/addbucket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketName: newBucket,
      }),
    });

    const temp = await res.json();
    console.log(temp);

    inputRef.current.value = "";
    handleClick(false);
  };

  const addCardDiffBucket = async (bucketname, name, link) => {
    let res = await fetch(`${BASE_URL}/addcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
        bucketName: bucketname,
      }),
    });

    res = await res.json();
    console.log(res);

    if (!obj[bucketname]) obj[bucketname] = [];

    obj[bucketname].push({ name, link });
  };

  const AddCard = async () => {
    const name = cardNameRef.current.value;
    const link = videoLinkRef.current.value;

    try {
      let video_id = link.split("v=")[1];
      var ampersandPosition = video_id.indexOf("&");
      if (ampersandPosition !== -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }

      cardNameRef.current.value = "";
      videoLinkRef.current.value = "";

      //console.log(bucketName, name, link);

      let res = await fetch(`${BASE_URL}/addcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          link: link,
          bucketName: bucketName,
        }),
      });

      res = await res.json();
      console.log(res);

      if (!obj[bucketName]) obj[bucketName] = [];

      obj[bucketName].push({ name, link });
    } catch {
      alert("ENTER VALID YOUTUBE URL");
      videoLinkRef.current.value = "";
      return;
    }

    handleClickCard();
  };

  const deleteCard = async (name) => {
    console.log("from client = ", name);
    let res = await fetch(`${BASE_URL}/deleteCard`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        bucketName: bucketName,
        name: name,
      }),
    });

    res = await res.json();
    console.log(res.data);

    // const newArray = obj[bucketName].filter(x =>{
    //    return x.name!==name
    // });

    // obj[bucketName] = newArray;
    getData();
    console.log(obj[bucketName]);
  };

  const replaceCard = async (destBucket, name, link) => {
    var check = 0;
    for (var i = 0; i < bucket.length; i++) {
      if (bucket[i] === destBucket) {
        check = 1;
        break;
      }
    }

    if (!check) {
      alert("ENTER VALID BUCKET NAME");
      return;
    }

    await deleteCard(name);
    await addCardDiffBucket(destBucket, name, link);
    alert("SUCCESSFULLY REPLACED");
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
      {historytab && <HistoryDiv />}
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
        <button className={style.historyCard} onClick={handleHistoryCard}>
          HISTORY
        </button>
        <h1 className={style.text}> CARDS</h1>
        <div className={style.grid}>
          {obj[bucketName] && obj[bucketName].length !== 0 ? (
            obj[bucketName].map((card) => (
              <Card
                name={card.name}
                link={card.link}
                deleteCard={deleteCard}
                replaceCard={replaceCard}
              />
            ))
          ) : (
            <h2 style={{ position: "relative", zIndex: "-1" }}>
              CARD LIST IS EMPTY
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bucket;
