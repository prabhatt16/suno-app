import React, { useEffect } from "react";
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";
import {
  IoBookmarkOutline,
  IoBookOutline,
  IoOpenOutline,
  IoShare,
  IoShareOutline,
} from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import IoMdOpen from "react-icons/io";
import Slider from "../AudioPlayer/Slider";
import { useState, useRef } from "react";
import "./AudioCard.css";
import ControlPanel from "../AudioPlayer/ControlPanel";
import { auth, db } from "../firebase";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import copy from "copy-to-clipboard";
import Box from "@mui/material/Box";
import { useAuthState } from "react-firebase-hooks/auth";
import playButton from "../assets/playButton.png";
import shareImage from "../assets/shareLinkImg.png";
import crossBtn from "../assets/crossBtn.png";
import ratingImg from "../assets/ratingImg.png";
import AudioModalContent from "./AudioModalContent";
import Category from "../pages/Category";
import { Rating } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  },
  shareModal: {
    display: "flex",
    margin: "0 auto",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[6],
    padding: theme.spacing(2, 4, 3),
  },

  img: {
    maxHeight: "200px",
    maxWidth: "300px",
    display: "block",
    margin: "0 auto",
    boxShadow: "0px 10px 10px 0px grey",
  },
  heading: {
    textAlign: "center",
    fontWeight: "400",
    marginTop: "10px",
    marginBottom: "15px",
  },
}));

function HistoryItemCard({ augeo_id }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [augeos, setAugeos] = useState();
  const [audioData, setAudioData] = useState([]);
  const [saveBtn, setSaveBtn] = useState("BookmarkOutlineIcon");
  const [BtnColor, setBtnColor] = useState("grey");
  const [visibility, setVisibility] = useState(false);
  const [mImg_link, setmImg_link] = useState("");
  const [mTitle, setmTitle] = useState("");
  const [mAudio_url, setmAudio_url] = useState("");
  const [mCategory_name, setmCategory_name] = useState("");
  const [mUser_name, setmUser_name] = useState("");
  const [mUser_img, setmUser_img] = useState("");
  const [mPost_time, setmPost_time] = useState("");
  const [mRef_link, setmRef_link] = useState("");
  const [value, setValue] = React.useState(0);
  const [user] = useAuthState(auth);
  const [shareId, setShareId] = useState("");
  const [ratingCardId, setRatingCardId] = useState("");
  const history = useHistory();
  const [copyBtnText, setCopyBtnText] = useState("Copy Link");
  const [ratingStatus, setRatingStatus] = useState([]);

  const handleShareOpen = (id) => {
    console.log("opening");
    setShareId(id);
    setShareOpen(true);
  };
  const handleShareClose = () => {
    setShareOpen(false);
  };

  const handleOpen = (
    img_link,
    audio_url,
    title,
    id,
    user_img,
    user_name,
    category_name,
    post_time,
    ref_link
  ) => {
    setOpen(true);
    setmTitle(title);
    setmPost_time(post_time);
    setmUser_img(user_img);
    setmUser_name(user_name);
    setmCategory_name(category_name);
    setmImg_link(img_link);
    setmAudio_url(audio_url);
    setmRef_link(ref_link);
    setRatingCardId(id);
  };
  const handleOpenRating = (id) => {
    setRatingOpen(true);
  };

  const saveRatings = async () => {
    await db
      .collection("Ratings")
      .doc(user?.id)
      .set({
        rating: value,
        augeoId: augeo_id,
        augeoName: mTitle,
        userId: user?.email,
      })
      .then(() => {
        console.log("saved rating");
        setRatingOpen(false);
        setValue(0);
      });
  };
  const handleCloseRating = () => {
    setRatingOpen(false);
    setmTitle("");
    setmImg_link("");
    setmAudio_url("");
    setmPost_time("");
    setmUser_img("");
    setmUser_name("");
    setmCategory_name("");
    setmImg_link("");
    setmRef_link("");
    setValue(0);
  };
  const handleClose = () => {
    setOpen(false);
    handleOpenRating();
  };

  const copyText = () => {
    copy(`https://augeo-dashboard.web.app/sharePage/${augeo_id}`);
    setCopyBtnText("Copied");
    alert(` You have copied this link!!"`);
  };

  const onClickLink = (itemHref) => {
    if (itemHref != "") {
      const newWindow = window.open(itemHref, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    }
  };
  const onSaveAugeo = async (id, augeoName) => {
    // handleOpen(false);
    if (id && BtnColor === "grey") {
      await db
        .collection("Saved_Items")
        .doc(user?.id)
        .set({
          userId: user?.uid,
          augeoId: id,
          saveColor: "black",
        })
        .then(() => {
          console.log("saved " + id);
          setBtnColor("black");
          // setSaveItemId(id);
        });
    } else {
      console.log("failed");
    }
  };

  const onShareItem = (title, id) => {
    if (title !== "" && id !== "") {
      handleShareOpen(id);
      history.listen({
        pathname: `/sharePage/${id}`,
        data: { title, id },
      });
      setShareId(id);
    } else {
      console.log(null);
    }
    console.log(title + " " + id);
  };

  console.log(augeo_id);

  const getAugeos = async () => {
    await db
      .collection("Augeos")
      .doc(`${augeo_id}`)
      .onSnapshot((snapShot) => {
        setAugeos(
          snapShot.data()
          //   snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  };
  console.log(augeos);
  useEffect(() => {
    getAugeos();
  }, []);

  return (
    <>
      {/* share link modal */}
      <Modal
        className={classes.shareModal}
        open={shareOpen}
        onClose={handleShareClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={shareOpen}>
          <div className="shareModal" style={{ outline: "none" }}>
            <Box
              sx={{
                display: "block",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
              }}
            >
              {/* <div className="linkModal">
                <p>{`http://localhost:3000/sharePage/${shareId}`}</p>
                <button className="copyBtn" onClick={copyText}>
                  {copyBtnText}
                </button>
              </div> */}

              <img
                src={crossBtn}
                className="cancelIcon"
                onClick={handleShareClose}
              />
              <img src={shareImage} alt="shareImge" className="shareImg" />
              <h1 className="shareHeading">Share with Friends!</h1>
              <h3 className="sharePara">
                Copy the link below and share it with your friends
              </h3>
              <div className="linkContainer">
                <p>{`https://augeo-dashboard.web.app/sharePage/${augeo_id}`}</p>
                <button type="button" className="copyBtn" onClick={copyText}>
                  {copyBtnText}
                </button>
              </div>
            </Box>
          </div>
        </Fade>
      </Modal>

      {/* Rating model */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={ratingOpen}
        onClose={handleCloseRating}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={ratingOpen}>
          <div className="ratingModal" style={{ outline: "none" }}>
            <Box
              sx={{
                display: "block",
                justifyContent: "center",
                alignItems: "center",
                "& .MuiRating-iconFilled": {
                  color: "rgb(250, 175, 0)",
                },
                "& > legend": { mt: 0 },
              }}
            >
              <img
                src={crossBtn}
                className="cancelIcon"
                onClick={handleCloseRating}
              />
              <img src={ratingImg} alt="ratingImage" className="ratingImg" />
              <h1 className="ratingHeading">Enjoyed this Augeo? </h1>
              <h3 className="ratingPara">
                Tell us how much you’ll rate this augeo
              </h3>
              <div className="ratingItem">
                <Rating
                  className="ratings"
                  name="size-large"
                  value={value}
                  size="large"
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </div>
              <div
                className="ratingBtn"
                style={{ visibility: value > 0 ? "visible" : "hidden" }}
                onClick={() => saveRatings()}
              >
                <h3 style={{ color: "white" }}>SUBMIT</h3>
              </div>
            </Box>
          </div>
        </Fade>
      </Modal>

      {/* audio player model */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.shareModal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="audioModal">
            <img src={crossBtn} className="cancelIcon" onClick={handleClose} />
            <AudioModalContent
              audio_url={mAudio_url}
              Category_name={mCategory_name}
              title={mTitle}
              post_time={mPost_time}
              card_img={mImg_link}
              user_name={mUser_name}
              user_img={mUser_img}
              ref_link={mRef_link}
            />
          </div>
        </Fade>
      </Modal>

      {/* {augeos &&
        augeos.map(
          ({
            id,
              img_link,
              audio_url,
              title,
              user_name,
              user_img,
              post_time,
              category_name,
              ref_link,
          }) => {
            return ( */}
      <div className="mainOfAudioCard" key={augeos?.id}>
        <div className="audioCard">
          <div className="cardDetails">
            <h2>{augeos?.category_name}</h2>
            <h3
              onClick={() =>
                handleOpen(
                  augeos?.img_link,
                  augeos?.audio_url,
                  augeos?.title,
                  augeos?.id,
                  augeos?.user_img,
                  augeos?.user_name,
                  augeos?.category_name,
                  augeos?.post_time,
                  augeos?.ref_link
                )
              }
            >
              {augeos?.title}
            </h3>
            <div className="linkItem">
              <IoOpenOutline
                style={{
                  color: "#707070",
                  width: "15px",
                  height: "16px",
                  marginRight: "5px",
                }}
              />
              <p onClick={() => onClickLink(augeos?.ref_link)}>
                {augeos?.ref_link}
              </p>
            </div>
          </div>
          <div
            className="cardImage"
            onClick={() =>
              handleOpen(
                augeos?.img_link,
                augeos?.audio_url,
                augeos?.title,
                augeos?.id,
                augeos?.user_img,
                augeos?.user_name,
                augeos?.category_name,
                augeos?.post_time,
                augeos?.ref_link
              )
            }
          >
            <img className="postImage" src={augeos?.img_link} alt="cardImage" />
            <div>
              <img className="playButton" src={playButton} alt="playbtn" />
            </div>
          </div>

          <div className="cardHeader">
            <img src={augeos?.user_img} alt="userImage" />
            <div className="cardUserDetails">
              <h2>{augeos?.user_name}</h2>
              <p>{augeos?.post_time}</p>
            </div>
          </div>

          <br />
          <div className="bottomIcons">
            {/* <IoBookmarkOutline
              className="cardIcons"
              onClick={() => onSaveAugeo(augeos?.id, augeos?.title)}
              // style={{ color: BtnColor }}
            /> */}
            <IoShareOutline
              className="cardIcons"
              onClick={() => onShareItem(augeos?.title, augeos?.id)}
              // onclick={()=>handleShareOpen}
            />
          </div>
        </div>
      </div>
      {/* );
          }
        )} */}
    </>
  );
}

export default HistoryItemCard;
