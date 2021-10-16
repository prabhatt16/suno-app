import React, { useEffect, useState } from "react";
import "./Category.css";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";
function Category() {
  const [category, setCategory] = useState([]);
  const history = useHistory();

  const [headerData, setHeaderData] = useState(null);

  const getHeaderData = async () => {
    await db
      .collection("TopicPage_Header")
      .doc("headerData")
      .onSnapshot((snapShot) => {
        setHeaderData(snapShot.data());
      });
  };

  useEffect(() => {
    getHeaderData();
  }, []);
  const onClickCategory = (type) => {
    if (type) {
      history.push(`/categoryaudios/${type}`);
      history.listen('/')
      console.log(type);
    } else {
      console.log("failed to push");
    }
  };

  useEffect(() => {
    db.collection("category").onSnapshot((snapShot) => {
      setCategory(
        snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });
  }, []);

  return (
    <div className="categoryArea">
      <div className="pageInfo">
        <h2>{headerData?.title}</h2>
        <p>{headerData?.sub_title}</p>
      </div>
      <div className="categoryGrid">
        {category &&
          category.map(({ id, data: { image_link, title, type } }) => {
            return (
              <div
                className="CategorySection"
                key={id}
                onClick={() => onClickCategory(type)}
              >
                <div className="categoryBannerCard">
                  <img src={image_link} alt="categoryBannerImage" />
                  <h1 className="categoryBannerName">{title}</h1>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Category;
