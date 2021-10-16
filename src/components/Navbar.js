import React, { useEffect, useState } from "react";
import "./Navbar.css";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import * as SiIcons from "react-icons/si";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as HiIcons from "react-icons/hi";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Avatar from "@mui/material/Avatar";
import logo from "../assets/logo.png";
import searchImg from "../assets/Vector.png";

import { AppBar, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import { IoLogOutOutline } from "react-icons/io5";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [loginText, setloginText] = useState("login");
  const [userName, setUserName] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [augeos, setAugeos] = useState([]);
  const [listVisible, setListVisible] = useState("hidden");
  const history = useHistory();
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = () => {
    setListVisible("visible");
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setListVisible("hidden");
  };
  const showSidebar = () => {
    setSidebar(!sidebar);
  };

  const SignOut = async () => {
    await auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("logOut");
        history.push("/signin");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const getAugeos = async () => {
    await db.collection("Augeos").onSnapshot((snapShot) => {
      setAugeos(snapShot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
  };

  const onClickSearchItem = (id) => {
    if (id) {
      history.push(`/searchItem/${id}`);
      console.log(id);
      setSearchItem("");
    } else {
      console.log("failed to push");
    }
    // searchItem("");
    setSearchItem("");
  };

  useEffect(() => {
    getAugeos();
  }, []);

  return (
    <div>
      <div className="navbar">
        <div className="nav_left">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars
              onClick={showSidebar}
              style={{ color: "white", width: "22px", height: "22px" }}
            />
          </Link>
          <img
            src={logo}
            alt="logo"
            style={{ cursor: "pointer" }}
            onClick={() => history.push("/home")}
          />
        </div>
        <div className="nav_center">
          <div className="inputSearchArea">
            <img src={searchImg} alt="searchIcon" />
            <input
              type="text"
              name="searchText"
              placeholder="search augeos"
              onClick={handleOpen}
              value={searchItem}
              onChange={(event) => setSearchItem(event.target.value)}
            />
          </div>

          {/* <MdIcons.MdCancel
              className="cross_icon"
              // style={{ visibility: crossBtn }}
              onClick={() => handleClose()}
            /> */}
          <div className="searchList">
            {user &&
              augeos
                .filter(({ id: id, data: { title } }) => {
                  if (searchItem == "") {
                    return;
                  } else if (
                    title.toLowerCase().includes(searchItem.toLocaleLowerCase())
                  ) {
                    return title;
                  }
                })
                .map(({ id: id, data: { title } }) => {
                  return (
                    <div
                      className="searchItems"
                      key={id}
                      style={{ visibility: listVisible }}
                    >
                      <p
                        onClick={() => onClickSearchItem(id)}
                        className="searchItem"
                      >
                        {title}
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>
        <div className="nav_right">
          <p
            style={{
              marginRight: "10px",
              color: "white",
              fontFamily: "Poppins",
            }}
          >
            {user ? user.displayName : ""}
          </p>
          {/* <button onClick={SignOut}>{user ? "Logout" : "Login"}</button> */}
          <div>
            <Avatar
              alt={user?.displayName}
              onClick={handleClick}
              src={user?.photoURL}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={handleClose}
                style={{ backgroundColor: "white" }}
              >
                <IoLogOutOutline style={{ marginRight: "10px" }} />
                <p onClick={SignOut}>{user ? "Logout" : "Login"}</p>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <AiIcons.AiOutlineClose
                style={{
                  color: "white",
                  marginLeft: "18px",
                  width: "22px",
                  height: "22px",
                }}
              />
            </Link>
          </li>
          <li className="nav-text">
            {user ? (
              <Link to="/">
                <FiIcons.FiHome className="sidebarIcon" />
                <span>Discover</span>
              </Link>
            ) : (
              <Link to="/nouser">
                <FiIcons.FiHome className="sidebarIcon" />
                <span>Discover</span>
              </Link>
            )}
          </li>
          <li className="nav-text">
            {user ? (
              <Link to="/featured">
                <SiIcons.SiAudiomack className="sidebarIcon" />
                <span>Featured</span>
              </Link>
            ) : (
              <Link to="/nouser">
                <SiIcons.SiAudiomack className="sidebarIcon" />
                <span>Featured</span>
              </Link>
            )}
          </li>
          <li className="nav-text">
            {user ? (
              <Link to="/topics">
                <HiIcons.HiTemplate className="sidebarIcon" />
                <span>Topics</span>
              </Link>
            ) : (
              <Link to="/nouser">
                <HiIcons.HiTemplate className="sidebarIcon" />
                <span>Topics</span>
              </Link>
            )}
          </li>
          {/* <li className="nav-text">
            <Link to="/saveItems">
              <FaIcons.FaRegBookmark className="sidebarIcon" />
              <span>Saved</span>
            </Link>
          </li> */}
          <li className="nav-text">
            {user ? (
              <Link to="/historyPage">
                <RiIcons.RiHistoryLine className="sidebarIcon" />
                <span>Recently Played</span>
              </Link>
            ) : (
              <Link to="/historyPage">
                <RiIcons.RiHistoryLine className="sidebarIcon" />
                <span>Recently Played</span>
              </Link>
            )}
          </li>
          <div className="lastItem">
            <li className="nav-text">
              {user ? (
                <Link to="/helpPage">
                  <FiIcons.FiHelpCircle className="sidebarIcon" />
                  <span>Help</span>
                </Link>
              ) : (
                <Link to="/nouser">
                  <FiIcons.FiHelpCircle className="sidebarIcon" />
                  <span>Help</span>
                </Link>
              )}
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
