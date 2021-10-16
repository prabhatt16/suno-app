import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ControlPanel from "../AudioPlayer/ControlPanel";
import Slider from "../AudioPlayer/Slider";
import { useLocation } from "react-router";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "12px",
    paddingBottom: "12px",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[6],
    padding: theme.spacing(2, 4, 3),
  },
  img: {
    maxWidth: "250px",
    boxShadow: "0px 10px 10px 0px grey",
  },
  heading: {
    textAlign: "center",
    fontWeight: "400",
    marginTop: "10px",
    marginBottom: "15px",
  },
}));

function NewAudio({image_link,audio_url,title, isOpen}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(isOpen);
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const location = useLocation();
  const audioRef = useRef();

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
    }

    if (isPlaying) {
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <button type="button" onClick={handleOpen}>
            react-transition-group
        </button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <img
              src={image_link}
              className={classes.img}
              alt="audioImage"
            />
            <h3 className={classes.heading}>{title}</h3>
            <Slider percentage={percentage} onChange={onChange} />
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
        </Fade>
      </Modal>
    </div>
  );

  // <div>
  //     <div id='buzzsprout-small-player-1820558'></div>
  // </div>
}

export default NewAudio;
