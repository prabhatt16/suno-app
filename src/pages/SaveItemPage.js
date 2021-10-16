import React, { useEffect } from "react";
import "./CategoryAudios.css";
import { useState, useRef } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SavedAugeoCard from "../components/SavedAugeoCard";

function SaveItemPage() {
  const [augeos, setAugeos] = useState([]);

  const [user] = useAuthState(auth);

  const getAugeos = async () => {
    await db
      .collection("Saved_Items")
      .where("userId", "==", user?.uid)
      .onSnapshot((snapShot) => {
        setAugeos(
          snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  };

  console.log(augeos);

  useEffect(() => {
    getAugeos();
  }, []);

  return (
    <div className="mainOfCategoryAudioCard">
      <div className="categoryAudioCardMain">
        <div className="categoryCardArea">
          <br />
          <div className="pageInfo">
            <h2>Saved</h2>
            <p>Augeos you have saved</p>
          </div>
          <div className="categoryAudioCards" style={{ padding: "20px" }}>
            {augeos &&
              augeos.map(({ id, data: { augeoId } }) => {
                // console.log(augeoId);
                return (
                 augeos.length > 0 ? (
                  <>
                    <SavedAugeoCard key={id} augeo_id={augeoId} />
                  </>
                ) : (
                  <h3 className="EmptyITem">You haven’t Saved anything yet.</h3>
                ))
                // console.log(augeos.length)
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaveItemPage;
