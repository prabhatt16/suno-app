import React, { useEffect, useState } from "react";
import "./FeaturedPage.css";
import AudioCard from "../components/AudioCard";
import { db } from "../firebase";

function FeaturedPage() {
  const [headerData, setHeaderData] = useState(null);

  const getHeaderData = async () => {
    await db
      .collection("FeaturedPage_Header")
      .doc("headerData")
      .onSnapshot((snapShot) => {
        setHeaderData(snapShot.data());
      });
  };

  useEffect(() => {
    getHeaderData();
  }, []);
  // console.log(headerData);

  return (
    <div className="trendingPageArea">
      <div className="pageInfo">
        <h2>{headerData?.title}</h2>
        <p>{headerData?.sub_title}</p>
      </div>
      <div className="trendingCards">
        <AudioCard  subType="featured" type='' cardWidth="100%" />
      </div>
    </div>
  );
}

export default FeaturedPage;
