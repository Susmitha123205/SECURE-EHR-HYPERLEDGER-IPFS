// backend/app.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const patientRoutes = require('./routes/Patient/Patient');
const doctorRoutes = require('./routes/Doctor/Doctor');
const labRoutes = require('./routes/Lab/Lab');
const pharmacyRoutes = require('./routes/Pharmacy/Pharmacy');
const insuranceRoutes = require('./routes/Insurance/Insurance');

const app = express();
const recordRoutes = require("./routes/recordRoutes");

//Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'healthcare-secret',
  resave: false,
  saveUninitialized: true
}));
app.use("/api", recordRoutes); // ✅ Very important

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", require("./routes/Patient/Patient"));

app.use("/api/doctor", doctorRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/insurance", insuranceRoutes);
//app.use("/api/patient", patientRoutes);  // NOTE: already under /api/patient
app.use("/api/upload", require("./routes/upload"));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Healthcare backend is running");
});

// ✅ Start Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});




