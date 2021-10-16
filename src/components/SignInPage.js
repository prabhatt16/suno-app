import React from "react";
import "./SignInPage.css";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase";
import { useHistory } from "react-router";
import signUpImg from "../assets/78341.png";
import logo from "../assets/logo.png";
import googleImg from "../assets/googleImage.png";

function SignInPage() {
  const [user] = useAuthState(auth);
  const history = useHistory();
  const Login = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(provider)
      .then((res) => {
        console.log("log-in successfully");
        history.push("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div style={{ backgroundColor: "#E5E5E5" }}>
      <div className="signInPage">
        <div className="leftContainer">
          <img className="logoImage" src={logo} alt="logo" />
          <h3>Be Smart!</h3>
          <h4>Play augeos on-the-go</h4>
          <img src={signUpImg} alt="img1" className="signUpImage" />
        </div>
        <div className="rightContainer" style={{ backgroundColor: "white" }}>
          <h1>Hey there!</h1>
          <h2>Welcome to Augeo</h2>
          <br />
          <p>Let's mix audio + geo</p>
          <div className="loginBtn" onClick={Login}>
            <h3>Continue with Google</h3>
            <img src={googleImg} alt="googleImage" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignInPage;
