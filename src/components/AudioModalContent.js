import { Avatar } from "@mui/material";
import React, { useRef, useState } from "react";
import {
  IoBookmarkOutline,
  IoOpenOutline,
  IoShareOutline,
} from "react-icons/io5";
import ControlPanel from "../AudioPlayer/ControlPanel";
import "./AudioModalContent.css";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

function AudioModalContent({
  augeo_id,
  audio_url,
  card_img,
  user_img,
  user_name,
  title,
  post_time,
  Category_name,
  ref_link,
}) {
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [user] = useAuthState(auth);

  const audioRef = useRef();
  const onChange = (e) => {
    const audio = audioRef.current;
    audio.currentTime = (audio.duration / 100) * e.target.value;
    setPercentage(e.target.value);
  };
  const play = async () => {
    const audio = audioRef.current;
    audio.volume = 0.1;
    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
      await db
        .collection("playHistory")
        .doc(user?.id)
        .set({
          userId: user?.uid,
          augeoId: augeo_id,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          // console.log("History saved " + augeo_id);
        });
    } else if (isPlaying) {
      setIsPlaying(false);
      audio.pause();
    }
  };

  const onClickLink = (ref_link) => {
    if (ref_link != "") {
      const newWindow = window.open(ref_link, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    }
  };
  const getCurrDuration = (e) => {
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;
    setPercentage(+percent);
    setCurrentTime(time.toFixed(2));
  };
  return (
    <div className="mainOfModal">
      <div className="audioInfo">
        <div className="imageContainer">
          <img
            src={card_img}
            alt="imgOfAudio"
            // style={{ maxWidth: "600px", width: "100%" ,objectFit:'cover'  ,height:200}}
          />
        </div>

        <div className="audioModalDetails">
          <div className="cardHeader">
            <Avatar alt={user_name} src={user_img} />
            <div className="cardUserDetails">
              <h2>{user_name}</h2>
              <p>{post_time}</p>
            </div>
          </div>
          <div className="cardData">
            <p>{Category_name}</p>
            <div className="cardDetails">
              <h3>{title}</h3>
              <div className="linkItem">
                <IoOpenOutline
                  style={{
                    color: "#707070",
                    width: "15px",
                    height: "16px",
                    marginRight: "5px",
                  }}
                />
                <p onClick={() => onClickLink(ref_link)}>{ref_link}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <img src={audioWaves} alt="track" className="audioTracker" /> */}
      <br />
      <div className="audioPlayerItems">
        {/* <div className="leftPlayerItems">
          <IoBookmarkOutline className="playerIcons" />
          <IoShareOutline className="playerIcons" />
        </div> */}
        {/* <h3>Now Playing</h3> */}
        <div className="rightPlayerItems">
          <audio
            ref={audioRef}
            onTimeUpdate={getCurrDuration}
            onLoadedData={(e) => {
              setDuration(e.currentTarget.duration.toFixed(2));
            }}
            src={audio_url}
          ></audio>
          <ControlPanel
            play={play}
            isPlaying={isPlaying}
            duration={duration}
            currentTime={currentTime}
          />
        </div>
      </div>
      <div className="audioPlayerMinItems">
        {/* <IoBookmarkOutline className="playerIcons" /> */}
        <audio
          ref={audioRef}
          onTimeUpdate={getCurrDuration}
          onLoadedData={(e) => {
            setDuration(e.currentTarget.duration.toFixed(2));
          }}
          src={audio_url}
        ></audio>
        <ControlPanel
          play={play}
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
        />
        {/* <IoShareOutline className="playerIcons" /> */}
      </div>
    </div>
  );
}

export default AudioModalContent;
