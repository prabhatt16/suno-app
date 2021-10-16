import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import "./NoUserPage.css";

function NoUserPage() {
  const history = useHistory();
    const [headerData, setHeaderData] = useState(null);

    const getHeaderData = async () => {
      await db
        .collection("Nouser_Header")
        .doc("headerData")
        .onSnapshot((snapShot) => {
          setHeaderData(snapShot.data());
        });
    };
    useEffect(() => {
      getHeaderData();
    }, [])
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="noUserPage">
        <div className="pageInfo">
          <h2>
            Please
            <u
              style={{ color: "blue", cursor: "pointer", marginLeft:5 }}
              onClick={() => history.push("/signin")}
            >
              {headerData?.title}
            </u>
          </h2>
          <p>{headerData?.sub_title}</p>
        </div>
      </div>
    </>
  );
}

export default NoUserPage;
