import React, { useState } from "react";
import { Link } from "react-router-dom";
function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    linkedId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="linkedId" placeholder="Linked ID" onChange={handleChange} required />
        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="lab">Lab</option>
          <option value="insurance">Insurance</option>
          <option value="pharmacy">Pharmacy</option>
        </select>
        <input type="submit" value="Register" />
      </form>
<p>
  Already have an account? <Link to="/login">Login here</Link>
</p>

    </div>
  );
}

export default Register;
