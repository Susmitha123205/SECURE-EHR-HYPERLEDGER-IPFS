const mongoose = require("mongoose");
const User = require("./data/userModel"); // adjust if path is different

mongoose.connect("mongodb://localhost:27017/healthcare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("✅ Connected to MongoDB");

  const users = await User.find({});
  if (users.length === 0) {
    console.log("⚠️  No users found.");
  } else {
    console.log("📋 Registered Users:");
    users.forEach((user) => {
      console.log(`- ${user.email} | ${user.role}`);
    });
  }

  mongoose.connection.close();
});
