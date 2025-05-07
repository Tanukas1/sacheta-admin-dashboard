import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddCategory from "./pages/WhatWe/AddCategory";
import AddGallery from "./pages/AddGallery";
import ViewGallery from "./pages/ViewGallery";
import Awareness from "./pages/WhatWeDo/Awareness";
import Donations from "./pages/Tables/DonationsEnquiry";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/gallery" element={<AddGallery />} />
        <Route path="/view-gallery" element={<ViewGallery />} />
        <Route path="/add-gallery" element={<Awareness />} />
        <Route path="/donations" element={<Donations />} />
      </Routes>
    </>
  );
}

export default App;
