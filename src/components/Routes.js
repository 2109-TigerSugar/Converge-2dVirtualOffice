import React from "react";
import { Routes, Route } from "react-router";
import About from "./About";
import LandingPage from "./LandingPage";


const RouteContent = () => {
  return (
    <div className="routes">
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  )
}

export default RouteContent
