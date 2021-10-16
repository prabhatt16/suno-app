import { useState, useRef, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import SignInPage from "./components/SignInPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import HelpPage from "./pages/HelpPage";
import Trending from "./pages/FeaturedPage";
import Sidebar from "./components/Sidebar";
import AudioCard from "./components/AudioCard";
import BannerCard from "./components/BannerCard";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Category from "./pages/Category";
import CategoryAudios from "./pages/CategoryAudios";
// import AudioSharePage from "./pages/AudioDetails";
import NewAudio from "./components/audio";
import SearchAugeoPage from "./pages/SearchAugeoPage";
import AudioModalContent from "./components/AudioModalContent";
import SaveItemPage from "./pages/SaveItemPage";
import HistoryItemCard from "./components/HistoryItemCard";
import HistoryPage from "./pages/HistoryPage";
import NoUserPage from "./pages/NoUserPage";
import AudioSharePage from "./pages/AudioSharePage";
import FeaturedPage from "./pages/FeaturedPage";

function App() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (auth && user) {
      db.collection("Users").doc(user?.uid).set({
        accountType: "normal",
        email: user?.email,
        name: user?.displayName,
        profilePic: user?.photoURL,
        phone: user?.phoneNumber,
      });
    }
  }, []);

  return (
    <div>
      <Router>
        {!user ? (
          <>
            <Switch>
              <Route path="/sharePage/:shareId" component={AudioSharePage} />
              <Route path="/nouser" component={NoUserPage} />
              <SignInPage />
            </Switch>
          </>
        ) : (
          <>
            <Navbar />
            <Sidebar />
            <Switch>
              <Route path="/nouser" component={NoUserPage} />
              <Route path="/sharePage/:shareId" component={AudioSharePage} />
              <Route path="/signin" component={SignInPage} />
              <Route path="/helpPage" exact component={HelpPage} />
              <Route path="/featured" component={FeaturedPage} />
              <Route path="/topics" component={Category} />
              <Route path="/searchItem/:searchId" component={SearchAugeoPage} />
              <Route path="/saveItems" component={SaveItemPage} />
              <Route path="/historyPage" component={HistoryPage} />
              <Route
                path="/categoryaudios/:roomId"
                component={CategoryAudios}
              />
              <Route path="/" component={Discover} />
            </Switch>
          </>
        )}
      </Router>
      {/* <AudioModalContent/> */}
      {/* <CategoryAudios/> */}
      {/* <Discover/> */}
      {/* <SignInPage/> */}
      {/* <AudioSharePage/> */}
      {/* <BannerCard/> */}
      {/* <Router>
        <Navbar />
        <Sidebar/>
        <Switch>
          <Route path='/homepage' exact component={HomePage} />
          <Route path='/discover' component={Discover} />
          <Route path='/trending' component={Trending} />
        </Switch>
      </Router>  */}
    </div>
  );
}

export default App;
