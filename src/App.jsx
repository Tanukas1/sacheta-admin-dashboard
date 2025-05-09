import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddCategory from "./pages/WhatWe/AddCategory";
import AddGallery from "./pages/AddGallery";
import ViewGallery from "./pages/ViewGallery";
import Awareness from "./pages/WhatWeDo/Awareness";
import Donations from "./pages/Tables/DonationsEnquiry";
import VerifyDonations from './pages/Tables/VerifyDonations';
import Sponsor from './pages/Tables/Sponser';
import Ocassional from './pages/Tables/Ocassional';
import Honor from './pages/Tables/Honor';
import Memory from './pages/Tables/Memory';
import ProtectedRoute from "./utils/Protected";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/gallery" element={<AddGallery />} />
        <Route path="/view-gallery" element={<ViewGallery />} />
        <Route path="/add-gallery" element={<Awareness />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/verify-donations" element={<VerifyDonations />} />
        <Route path="/sponser" element={<Sponsor />} />
        <Route path="/ocassional" element={<Ocassional />} />
        <Route path="/honor" element={<Honor />} />
        <Route path="/memory" element={<Memory />} />
      </Route>
    </Routes>
  );
}

export default App;
