import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import emailjs from "emailjs-com";
import "./HelpPage.css";
import { db } from "../firebase";

function HomePage() {
  const [email, setEmail] = useState("");
  const [feedBack, setFeedBack] = useState("");
  const form = useRef();

  const [headerData, setHeaderData] = useState(null);

  const getHeaderData = async () => {
    await db
      .collection("HelpPage_header")
      .doc("headerData")
      .onSnapshot((snapShot) => {
        setHeaderData(snapShot.data());
      });
  };

  console.log(headerData);
  const sendEmail = (e) => {
    e.preventDefault();
    if (email !== "" && feedBack !== "") {
      emailjs
        .sendForm(
          headerData?.service_id,
          headerData?.template_id,
          form.current,
          headerData?.user_key
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
      setEmail("");
      setFeedBack("");
    } else {
      alert("please fill all fields!!");
    }
    form.current.reset();
  };
  useEffect(() => {
    getHeaderData();
  }, []);
  return (
    <div className="newAugeosArea">
      <div className="pageInfo">
        <h2>{headerData?.title}</h2>
        <p>{headerData?.sub_title}</p>
      </div>
      <div className="newAugeosCard">
        <form ref={form} onSubmit={sendEmail}>
          <input
            type="email"
            name="email"
            placeholder="write your Email"
            className="emailField"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <br />
          <TextareaAutosize
            maxRows={4}
            aria-label="maximum height"
            placeholder="Write your feedback"
            name="message"
            onChange={(event) => setFeedBack(event.target.value)}
            style={{
              maxWidth: "390px",
              width: "100%",
              height: 100,
              padding: "10px 20px 10px 10px",
              marginLeft: 8,
              fontFamily: "Poppins",
              border: "1px solid grey",
              borderRadius: 5,
            }}
          />
          <br />
          <Button
            variant="contained"
            type="submit"
            style={{ marginLeft: 8, marginTop: 8 }}
          >
            submit
          </Button>
        </form>
      </div>
    </div>
  );  
}

export default HomePage;
