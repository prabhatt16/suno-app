import React, { useEffect } from "react";
import "./CategoryAudios.css";
import { useState, useRef } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SavedAugeoCard from "../components/SavedAugeoCard";
import HistoryItemCard from "../components/HistoryItemCard";

function HistoryPage() {
  const [augeos, setAugeos] = useState([]);
  const [headerData, setHeaderData] = useState(null);

  const [user] = useAuthState(auth);

  const getAugeos = async () => {
    await db
      .collection("playHistory")
      .where("userId", "==", user?.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setAugeos(
          snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  };

  // console.log(augeos);

  const getHeaderData = async () => {
    await db
      .collection("HistoryPage_Header")
      .doc("headerData")
      .onSnapshot((snapShot) => {
        setHeaderData(snapShot.data());
      });
  };

  console.log(headerData);
  useEffect(() => {
    getAugeos();
    getHeaderData();
  }, []);

  return (
    <div className="trendingPageArea">
      <div className="pageInfo">
        <h2>{headerData?.title}</h2>
        <p>{headerData?.sub_title}</p>
      </div>
      <div
        className="categoryAudioCards"  
        style={{ padding: "0px 20px 10px 20px" }}
      >
        {augeos &&
          augeos.map(({ id, data: { augeoId } }) => {
            // console.log(augeoId);
            return augeos.length !== 0 ? (
              <HistoryItemCard key={id} augeo_id={augeoId} />
            ) : (
              <h3 className="EmptyITem">You haven’t Saved anything yet.</h3>
            );
          })}
      </div>
    </div>
  );
}

export default HistoryPage;
