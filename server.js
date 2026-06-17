require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Connection failed:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const bcrypt = require("bcryptjs");

// Signup route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User created successfully!" });
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ message: "Incorrect password" });
  }

  // Create the token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful!", token });
});

// Middleware - checks if token is valid
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// GET all tasks - protected
app.get("/tasks", verifyToken, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST a new task - protected
app.post("/tasks", verifyToken, async (req, res) => {
  const newTask = new Task({ title: req.body.title });
  await newTask.save();
  res.json(newTask);
});

// PATCH - protected
app.patch("/tasks/:id", verifyToken, async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// DELETE - protected
app.delete("/tasks/:id", verifyToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});