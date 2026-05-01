const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const leetcodeRoutes = require("./routes/leetcodeRoutes");
const contestRoutes = require("./routes/contestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});
app.use("/users", userRoutes);
app.use("/problems", problemRoutes);
app.use("/leetcode", leetcodeRoutes);
app.use("/contest", contestRoutes);

module.exports = app;

