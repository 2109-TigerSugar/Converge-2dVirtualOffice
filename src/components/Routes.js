import React from "react";
import { Routes, Route } from "react-router";
import About from "./About";
import LandingPage from "./LandingPage";
import Office from "./Office";


const RouteContent = () => {
  return (
    <div className="routes">
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/office' element={<Office />} />

      </Routes>
    </div>
  )
}

export default RouteContent
