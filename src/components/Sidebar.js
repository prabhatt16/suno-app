import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import * as SiIcons from "react-icons/si";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as HiIcons from "react-icons/hi";

import "./Sidebar.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function Sidebar() {
  const [user] = useAuthState(auth);

  return (
    <div className="sidebar-menu active">
      <ul className="sidebar-menu-items">
        <li className="sidebar-text">
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
        <li className="sidebar-text">
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
        <li className="sidebar-text">
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
        {/* <li className="sidebar-text">
          <Link to="/saveItems">
            <FaIcons.FaRegBookmark className="sidebarIcon" />
            <span>Saved</span>
          </Link>
        </li> */}
        <li className="sidebar-text">
          {user ? (
            <Link to="/historyPage">
              <RiIcons.RiHistoryLine className="sidebarIcon" />
              <span>Recently Played</span>
            </Link>
          ) : (
            <Link to="/nouser">
              <RiIcons.RiHistoryLine className="sidebarIcon" />
              <span>Recently Played</span>
            </Link>
          )}
        </li>
        <div className="lastItem">
          <li className="sidebar-text">
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
    </div>
  );
}

export default Sidebar;
