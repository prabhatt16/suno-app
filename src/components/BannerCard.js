import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase";
import "./BannerCard.css";
function BannerCard({ cardWidth, category_set }) {
  const [bannerData, setBannerData] = useState([]);
  const history = useHistory();

  const getBannerData = async () => {
    await db
      .collection("category")
      .where("category_set", "==", category_set)
      .onSnapshot((snapShot) => {
        setBannerData(
          snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  };

  console.log(bannerData);

   const onClickCategory = (type) => {
     if (type) {
       history.push(`/categoryaudios/${type}`);
       history.listen("/");
       console.log(type);
     } else {
       console.log("failed to push");
     }
   };

  useEffect(() => {
    getBannerData();
  }, []);
  return (
    <div className="horizontalCards">
      {bannerData &&
        bannerData.map(({ id, data: { image_link, title, type } }) => {
          return (
            <div
              className="CategoryBanner"
              key={id}
              onClick={() => onClickCategory(type)}
            >
              <div className="categoryCard">
                <img src={image_link} alt="categoryImage" />
                <h1 className="categoryName">{title}</h1>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default BannerCard;
