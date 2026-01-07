import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faHouse, faUser, faCompass, faPlus, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (<>
    {/* Desktop Navbar - hidden on mobile, visible on md and up */}
    <nav className="md-visible fixed bg-neutral-900 top-0 left-0 w-20 h-screen p-2 text-white z-20">
      <div className="flex flex-col justify-between w-full h-full">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        <ul className="flex flex-col gap-10 items-center grow text-white mt-10">
          <li className="text-xl cursor-pointer" onClick={() => navigate('/home')}><FontAwesomeIcon icon={faHouse} size="lg" /></li>
          <li className="text-xl cursor-pointer" onClick={() => navigate('/explore')}><FontAwesomeIcon icon={faCompass} size="lg" /></li>
          <li className="text-xl cursor-pointer" onClick={() => navigate('/createpost')}><FontAwesomeIcon icon={faPlus} size="lg" /></li>
          <li className="text-xl cursor-pointer" onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser} size="lg" /></li>
        </ul>
        <div className="flex flex-col justify-around items-center">
          <p className="text-center my-4 cursor-pointer" onClick={() => navigate('/')}><FontAwesomeIcon icon={faDoorOpen} size="lg" /></p>
        </div>
      </div>
    </nav>

    {/* Mobile Navbar - visible on mobile, hidden on md and up */}
    <nav className="fixed bg-neutral-900 left-0 bottom-0 w-full p-2 block md:hidden z-20">
      <ul className="flex justify-around items-center text-center w-full text-white">
        <li className="text-xl cursor-pointer" onClick={() => navigate('/home')}><FontAwesomeIcon icon={faHouse} size="lg" /></li>
        <li className="text-xl cursor-pointer" onClick={() => navigate('/explore')}><FontAwesomeIcon icon={faCompass} size="lg" /></li>
        <li className="text-xl cursor-pointer" onClick={() => navigate('/createpost')}><FontAwesomeIcon icon={faPlus} size="lg" /></li>
        <li className="text-xl cursor-pointer" onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser} size="lg" /></li>
        <li className="text-xl cursor-pointer" onClick={() => navigate('/')}><FontAwesomeIcon icon={faDoorOpen}/></li>
      </ul>
    </nav>
  </>)
}

export default Navbar;