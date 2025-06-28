import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";
import LabDashboard from "./components/LabDashboard";
import PharmacyDashboard from "./components/PharmacyDashboard";
import InsuranceDashboard from "./components/InsuranceDashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import "./style.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/lab" element={<LabDashboard />} />
        <Route path="/dashboard/pharmacy" element={<PharmacyDashboard />} />
        <Route path="/dashboard/insurance" element={<InsuranceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
