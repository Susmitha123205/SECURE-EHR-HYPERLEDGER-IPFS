const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/healthcare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  { email: "patient1@example.com", password: "pass123", role: "patient", linkedId: "P001" },
  { email: "doctor1@example.com", password: "pass123", role: "doctor", linkedId: "D001" },
  { email: "lab1@example.com", password: "pass123", role: "lab", linkedId: "L001" },
  { email: "pharmacy1@example.com", password: "pass123", role: "pharmacy", linkedId: "PH001" },
  { email: "insurance1@example.com", password: "pass123", role: "insurance", linkedId: "I001" },
];

const run = async () => {
  for (const userData of users) {
    const hashed = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData, password: hashed });
    await user.save();
    console.log(`✅ Registered: ${user.email}`);
  }
  process.exit();
};

run();
