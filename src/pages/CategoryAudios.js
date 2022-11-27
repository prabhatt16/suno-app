import React, { useEffect } from "react";
import AudioCard from "../components/AudioCard";
import "./CategoryAudios.css";
import {
  IoBookOutline,
  IoOpenOutline,
  IoShare,
  IoShareOutline,
} from "react-icons/io5";
import * as IoIcons from "react-icons/io5";
import Slider from "../AudioPlayer/Slider";
import { useState, useRef } from "react";
// import ControlPanel from './ControlPanel'
import { auth, db } from "../firebase";
import ControlPanel from "../AudioPlayer/ControlPanel";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Box from "@material-ui/core/Box";
import playButton from "../assets/playButton.png";
import shareImage from "../assets/shareLinkImg.png";
// import BookmarkIcon from "./bookmark.png";
// import BookmarkOutlineIcon from "./bookMarkOutline.png";
import crossBtn from "../assets/crossBtn.png";
import ratingImg from "../assets/ratingImg.png";
import { useAuthState } from "react-firebase-hooks/auth";
import copy from "copy-to-clipboard";
import AudioModalContent from "../components/AudioModalContent";
import { Avatar } from "@material-ui/core";
import { Rating } from "@mui/material";
import { RiArrowRightSLine } from "react-icons/ri";
const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "12px",
    paddingBottom: "12px",
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

function CategoryAudios() {
  const { roomId } = useParams();
  const classes = useStyles();
  const [categoryData, setCategoryData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saveBtn, setSaveBtn] = useState("BookmarkOutlineIcon");
  const [BtnColor, setBtnColor] = useState("grey");
  const [augeos, setAugeos] = useState([]);
  const [mImg_link, setmImg_link] = useState("");
  const [mTitle, setmTitle] = useState("");
  const [mAudio_url, setmAudio_url] = useState("");
  const [mCategory_name, setmCategory_name] = useState("");
  const [mUser_name, setmUser_name] = useState("");
  const [mAugeo_Id, setmAugeo_Id] = useState("");
  const [mRef_link, setmRef_link] = useState("");
  const [mUser_img, setmUser_img] = useState("");
  const [mPost_time, setmPost_time] = useState("");
  const [value, setValue] = useState(0);
  const [user] = useAuthState(auth);
  const [shareId, setShareId] = useState("");
  const [ratingCardId, setRatingCardId] = useState("");
  const history = useHistory();
  const [copyBtnText, setCopyBtnText] = useState("Copy Link");

  console.log(roomId);
  const onSaveAugeo = async (id) => {
    if (id) {
      await db
        .collection("Saved_Items")
        .doc(user?.id)
        .set({
          userId: user?.uid,
          augeoId: id,
        })
        .then(() => {
          console.log("saved " + id);
        });
    } else {
      console.log(id);
    }
  };

  // const getCategoryData = async() => {
  //   if (roomId) {
  //     await db
  //       .collection("category")
  //       .doc(roomId)
  //       .onSnapshot((snapShot) => {
  //         setCategoryData(snapShot.data());
  //       });
  //   } else {
  //     console.log("failed to get");
  //   }
  // };
  // useEffect(() => {
  //   getCategoryData();
  // }, []);
  // console.log(categoryData);

  const handleShareOpen = (id) => {
    console.log("opening");
    setShareId(id);
    setShareOpen(true);
  };
  const handleShareClose = () => {
    setShareOpen(false);
  };

  const handleOpen = (
    id,
    img_link,
    audio_url,
    title,
    user_img,
    user_name,
    category_name,
    post_time,
    ref_link
  ) => {
    setOpen(true);
    setmTitle(title);
    setmAudio_url(audio_url);
    setmAugeo_Id(id);
    setmImg_link(img_link);
    setmUser_img(user_img);
    setmUser_name(user_name);
    setmPost_time(post_time);
    setmCategory_name(category_name);
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
        augeoId: mAugeo_Id,
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
    setmAudio_url("");
    setmAugeo_Id("");
    setmImg_link("");
    setmUser_img("");
    setmUser_name("");
    setmPost_time("");
    setmCategory_name("");
    setmRef_link("");
    setValue(0);
  };
  const handleClose = () => {
    setOpen(false);
    handleOpenRating();
  };
  const copyText = () => {
    copy(`https://augeo-dashboard.web.app/sharePage/${shareId}`);
    setCopyBtnText("Copied");
    alert(` You have copied this link !!`);
  };

  const onShareItem = (title, id) => {
    if (title !== "" && id !== "") {
      handleShareOpen(id);
      history.listen({
        pathname: `/sharePage/${id}`,
        data: { title, id },
      });
    } else {
      console.log(null);
    }
    console.log(title + " " + id);
  };

  const getAugeos = async () => {
    if (roomId) {
      await db
        .collection("Augeos")
        .where("category_name", "==", `${roomId}`)
        .onSnapshot((snapShot) => {
          setAugeos(
            snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
    }
  };

  // console.log(augeos);

  const onClickLink = (itemHref) => {
    if (itemHref != "") {
      const newWindow = window.open(itemHref, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    }
  };

  useEffect(() => {
    getAugeos();
  }, []);

  return (
    <div className="mainOfCategoryAudioCard">
      {/* share link modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.shareModal}
        // className="shareModal"
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
                <p>{`http://localhost:3000/sharePage/${shareId}`}</p>
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
              <h1 className="ratingHeading">Enjoyed this SUNO audio? </h1>
              <h3 className="ratingPara">
                Tell us how much you’ll rate this SUNO audio
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
            {/* <button className="ratingBtn" onClick={handleCloseRating}>
                  SUBMIT
                </button> */}
          </div>
        </Fade>
      </Modal>

      {/* audio player model */}
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
            />
          </div>
        </Fade>
      </Modal>

      <div className="categoryAudioCardMain">
        {/* <div className="categoryAudioBanner">
          <img src={categoryData?.image_link} alt="head_img" />
          <h1 className="categoryName">{categoryData?.type}</h1>
        </div> */}
        <br />
        <div className="headingarea">
          <h2>{roomId}</h2>
          {/* <p>Some {roomId} augeos are here!!</p> */}
        </div>
        <div className="categoryCardArea">
          <div className="categoryAudioCards">
            {augeos &&
              augeos.map(
                ({
                  id,
                  data: {
                    img_link,
                    audio_url,
                    title,
                    user_name,
                    category_name,
                    user_img,
                    post_time,
                    ref_link,
                  },
                }) => {
                  return (
                    <div className="mainOfAudioCard" key={id}>
                      <div className="audioCard" style={{ width: "100%" }}>
                        <div className="cardDetails">
                          <h2>{category_name}</h2>
                          <h3
                            onClick={() =>
                              handleOpen(
                                id,
                                img_link,
                                audio_url,
                                title,
                                user_img,
                                user_name,
                                category_name,
                                post_time,
                                ref_link
                              )
                            }
                          >
                            {title}
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
                            <p onClick={() => onClickLink(ref_link)}>
                              {ref_link}
                            </p>
                          </div>
                        </div>
                        <div
                          className="cardImage"
                          onClick={() =>
                            handleOpen(
                              id,
                              img_link,
                              audio_url,
                              title,
                              user_img,
                              user_name,
                              category_name,
                              post_time,
                              ref_link
                            )
                          }
                        >
                          <img
                            className="postImage"
                            src={img_link}
                            alt="cardImage"
                          />
                          <div>
                            <img
                              className="playButton"
                              src={playButton}
                              alt="playbtn"
                            />
                          </div>
                        </div>

                        <div className="cardHeader">
                          <Avatar alt={user_name} src={user_img} />
                          <div className="cardUserDetails">
                            <h2>{user_name}</h2>
                            <p>{post_time}</p>
                          </div>
                        </div>

                        <br />
                        <div className="bottomIcons">
                          {/* <IoIcons.IoBookmarkOutline
                            className="cardIcons"
                            // onClick={() => onSaveAugeo(id)}
                            // style={{ color: BtnColor }}
                          /> */}
                          <IoShareOutline
                            className="cardIcons"
                            onClick={() => onShareItem(title, id)}
                            // onclick={()=>handleShareOpen}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryAudios;
