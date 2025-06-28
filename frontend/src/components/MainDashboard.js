// frontend/src/components/MainDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainDashboard() {
  const navigate = useNavigate();

  return (
    <div className="section">
      <h2>🏥 Welcome to the Healthcare Dashboard</h2>
      <p>Select a role to proceed:</p>

      <div className="role-buttons">
        <button onClick={() => navigate('/patient')}>PATIENT</button>
        <button onClick={() => navigate('/doctor')}>DOCTOR</button>
        <button onClick={() => navigate('/lab')}>LAB</button>
        <button onClick={() => navigate('/pharmacy')}>PHARMACY</button>
        <button onClick={() => navigate('/insurance')}>INSURANCE</button>
      </div>
    </div>
  );
}

export default MainDashboard;
