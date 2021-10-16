import React, { useEffect, useState, useRef } from "react";
import "./AudioSharePage.css";
import {
  IoBookmarkOutline,
  IoOpenOutline,
  IoSaveOutline,
  IoShareOutline,
} from "react-icons/io5";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import ControlPanel from "../AudioPlayer/ControlPanel";
import Slider from "../AudioPlayer/Slider";
import { useLocation } from "react-router";
import { auth, db } from "../firebase";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

function AudioSharePage() {
  const { shareId } = useParams();
  const [data_items, setData_items] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [augeosData, setAugeosData] = useState("");
  const classes = useStyles();
  const audioRef = useRef();
  const [user] = useAuthState(auth);
  const onChange = (e) => {
    const audio = audioRef.current;
    audio.currentTime = (audio.duration / 100) * e.target.value;
    setPercentage(e.target.value);
  };

  const play = () => {
    const audio = audioRef.current;
    audio.volume = 0.1;

    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
    } else if (isPlaying) {
      setIsPlaying(false);
      audio.pause();
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

  const onClickItem = () => {
    const newWindow = window.open(
      "https://www.myaugeo.com/navigate?type=nearby&title=Goa&lat=15.550965&lng=73.7626545&order=upvote",
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };
  console.log(shareId);

  const getAugeos = async () => {
    await db
      .collection("Augeos")
      .doc(shareId)
      .onSnapshot((snapShot) => {
        setAugeosData(snapShot.data());
      });
  };
  // console.log(augeosData);
  useEffect(() => {
    getAugeos();
  }, []);

  return (
    <>
      {!user ? (
        <>
          <Navbar />
          <Sidebar />
          <div className="mainOfShareCard">
            <br />
            <div className="mainContainerOfShare">
              <div className="mainOfModal">
                <div className="audioInfo">
                  <div className="imageContainer">
                    <img src={augeosData?.img_link} alt="imgOfAudio" />
                  </div>
                  <div className="audioModalDetails">
                    <div className="cardHeader">
                      <Avatar
                        alt={augeosData?.user_name}
                        src={augeosData?.user_img}
                      />
                      <div className="cardUserDetails">
                        <h2>{augeosData?.user_name}</h2>
                        <p>{augeosData?.post_time}</p>
                      </div>
                    </div>
                    <div className="cardData">
                      <p>{augeosData?.category_name}</p>
                      <div className="cardDetails">
                        <h3>{augeosData?.title}</h3>
                        <div className="linkItem">
                          <IoOpenOutline
                            style={{
                              color: "#707070",
                              width: "15px",
                              height: "16px",
                              marginRight: "5px",
                            }}
                          />
                          <p onClick={() => onClickItem()}>www.totourism.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="audioPlayerItems">
                  {/* <div className="leftPlayerItems">
                  <h3 style={{ color: "white", fontFamily: "Poppins" }}>
                    Now Playing
                  </h3>
                </div> */}
                  <div className="rightPlayerItems">
                    <audio
                      ref={audioRef}
                      onTimeUpdate={getCurrDuration}
                      onLoadedData={(e) => {
                        setDuration(e.currentTarget.duration.toFixed(2));
                      }}
                      src={augeosData?.audio_url}
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
                  <audio
                    ref={audioRef}
                    onTimeUpdate={getCurrDuration}
                    onLoadedData={(e) => {
                      setDuration(e.currentTarget.duration.toFixed(2));
                    }}
                    src={augeosData?.audio_url}
                  ></audio>
                  <ControlPanel
                    play={play}
                    isPlaying={isPlaying}
                    duration={duration}
                    currentTime={currentTime}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mainOfShareCard">
            <br />
            <div className="mainContainerOfShare">
              <div className="mainOfModal">
                <div className="audioInfo">
                  <div className="imageContainer">
                    <img src={augeosData?.img_link} alt="imgOfAudio" />
                  </div>
                  <div className="audioModalDetails">
                    <div className="cardHeader">
                      <Avatar
                        alt={augeosData?.user_name}
                        src={augeosData?.user_img}
                      />
                      <div className="cardUserDetails">
                        <h2>{augeosData?.user_name}</h2>
                        <p>{augeosData?.post_time}</p>
                      </div>
                    </div>
                    <div className="cardData">
                      <p>{augeosData?.category_name}</p>
                      <div className="cardDetails">
                        <h3>{augeosData?.title}</h3>
                        <div className="linkItem">
                          <IoOpenOutline
                            style={{
                              color: "#707070",
                              width: "15px",
                              height: "16px",
                              marginRight: "5px",
                            }}
                          />
                          <p onClick={() => onClickItem()}>
                            {augeosData?.ref_link}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <img src={audioWaves} alt="track" className="audioTracker" /> */}
                <br />
                <div className="audioPlayerItems">
                  {/* <div className="leftPlayerItems">
                  <h3 style={{ color: "white", fontFamily: "Poppins" }}>
                    Now Playing
                  </h3>
                </div> */}
                  <div className="rightPlayerItems">
                    <audio
                      ref={audioRef}
                      onTimeUpdate={getCurrDuration}
                      onLoadedData={(e) => {
                        setDuration(e.currentTarget.duration.toFixed(2));
                      }}
                      src={augeosData?.audio_url}
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
                    src={augeosData?.audio_url}
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
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AudioSharePage;
