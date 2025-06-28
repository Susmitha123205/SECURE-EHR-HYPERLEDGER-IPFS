import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  });

  const [error] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:4001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Auto login after registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      // ✅ Redirect to the correct dashboard
      if (data.role === "doctor") navigate("/dashboard/doctor");
      else if (data.role === "patient") navigate("/dashboard/patient");
      else if (data.role === "lab") navigate("/dashboard/lab");
      else if (data.role === "pharmacy") navigate("/dashboard/pharmacy");
      else if (data.role === "insurance") navigate("/dashboard/insurance");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Register Error:", err);
    alert("Server error");
  }
};

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="lab">Lab</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="insurance">Insurance</option>
        </select>
        <button type="submit">Register</button>
      </form>

      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
