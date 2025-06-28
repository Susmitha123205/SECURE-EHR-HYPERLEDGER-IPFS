import React from 'react';
import Upload from '../components/Upload';
import Records from '../components/Record';

function Dashboard({ role }) {
  return (
    <div>
      <h2>{role.toUpperCase()} Dashboard</h2>
      <Upload role={role} />
      <Records role={role} />
    </div>
  );
}

export default Dashboard;
