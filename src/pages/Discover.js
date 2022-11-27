import React, { useEffect, useState } from "react";
import AudioCard from "../components/AudioCard";
import BannerCard from "../components/BannerCard";
import { db } from "../firebase";
import "./Discover.css";
function Discover() {
  const [sequence, setSequence] = useState([]);
  const [categories, setCategories] = useState([]);
  const [headerData, setHeaderData] = useState(null);

  const getSequence = async () => {
    await db
      .collection("sequence")
      .orderBy("rowNum", "asc")
      .onSnapshot((snapShot) => {
        setSequence(
          snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  };
  const getHeaderData = async () => {
    await db
      .collection("HomePage_Header")
      .doc("headerData")
      .onSnapshot((snapShot) => {
        setHeaderData(snapShot.data());
      });
  };

  // console.log("header data" + headerData?.title);
  useEffect(() => {
    getSequence();
    getHeaderData();
  }, []);

  return (
    <div className="discoverPage">
      <div className="discoverContainer">
        <div className="welcomeContainer">
          {/* <h2>{headerData?.title}</h2>
          <p>{headerData?.sub_title}</p> */}
        </div>
        {/* <br /> */}
        {sequence &&
          sequence.map(
            ({ id, data: { row_type, category_set, heading, type } }) => {
              switch (row_type) {
                case "category":
                  return (
                    <div className="rowItems" key={id}>
                      <h1 className="discoverHeading">{heading}</h1>
                      <BannerCard
                        key={id + "1"}
                        category_set={category_set}
                        cardWidth="240px"
                      />
                    </div>
                  );
                  break;
                case "audio":
                  return (
                    <div className="rowItems" key={id}>
                      <h1 className="discoverHeading">{heading}</h1>
                      <div className="horizontalCards">
                        <AudioCard key={id} type={type} />
                      </div>
                    </div>
                  );
                  break;
                default:
                  break;
              }
            }
          )}
      </div>
    </div>
  );
}

export default Discover;
