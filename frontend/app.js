import React, { useState } from 'react';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import LabDashboard from './components/LabDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';
import InsuranceDashboard from './components/InsuranceDashboard';
import './style.css';

function App() {
  const [role, setRole] = useState(''); // no role selected by default

  return (
    <div className="container">
      <h1>Healthcare Portal</h1>

      {/* Role buttons */}
      <div className="roles">
        {["patient", "doctor", "lab", "pharmacy", "insurance"].map((r) => (
          <button key={r} onClick={() => setRole(r)}>
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Show Dashboard Based on Selected Role */}
      <div className="dashboard">
        {role === 'patient' && <PatientDashboard />}
        {role === 'doctor' && <DoctorDashboard />}
        {role === 'lab' && <LabDashboard />}
        {role === 'pharmacy' && <PharmacyDashboard />}
        {role === 'insurance' && <InsuranceDashboard />}
      </div>
    </div>
  );
}

export default App;
