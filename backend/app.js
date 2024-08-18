const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("./userModel");
const classroom = require("./classroomModel");
const cookieParser = require("cookie-parser");
const app = express();

//Secret Key
const JWT_SECRET = "wlkvxddawqwsdffuhhijnljhyrsdfvbnvgcsxfvcgmhgbnv23564";

// Connection to MongoDB
const url =
  "mongodb+srv://sanket13052004:HUM6bBajwplg0k5R@cluster0.sgzvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);

    const foundUser = await user.findOne({ email });
    // console.log(foundUser);
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (foundUser.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: foundUser._id,
        role: foundUser.role,
        department: foundUser.department,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    // console.log(token);

    // const decode = jwt.verify(token, JWT_SECRET);
    // console.log(decode);

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", role: foundUser.role });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all teachers
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await user.find({ role: "Teacher" });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all students
app.get("/students", async (req, res) => {
  try {
    const students = await user.find({ role: "Student" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all classrooms
app.get("/classrooms", async (req, res) => {
  try {
    const classrooms = await classroom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a classroom
app.post("/create/classroom", async (req, res) => {
  const newClassroom = req.body;
  try {
    const createdClassroom = await classroom.create(newClassroom);
    res.status(201).json(createdClassroom);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a user
app.post("/create/user", async (req, res) => {
  const newUser = req.body;
  try {
    const createdUser = await user.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/teacher/students", async (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    const decode = jwt.verify(token, JWT_SECRET);
    // console.log(decode.role);
    const students = await user.find({
      role: "Student",
      department: decode.department,
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/teacher/students", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, JWT_SECRET);
    const newStudent = req.body;

    const createdStudent = await user.create({
      ...newStudent,
      department: decode.department,
    });
    if (!createdStudent) {
      throw new Error("Failed to create student");
    }

    res.status(200).json(createdStudent);
  } catch (error) {
    console.log(error);
  }
});

app.post("/student/classmates", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, JWT_SECRET);
    const classmates = await user.find({
      department: decode.department,
      role: "Student",
    });

    res.status(200).json(classmates);
  } catch (error) {
    console.log(error);
  }
});
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  console.log(id);
  const deletedUser = await user.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted successfully", deletedUser });
});

app.put("/update/user/:id", async (req, res) => {
  try {
    console.log("here");
    const { editingUser } = req.body;
    console.log(editingUser);
    const id = req.params.id;
    console.log(id);
    const updatedUser = await user.findByIdAndUpdate(id, editingUser, {
      new: true,
    });
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.log(error);
  }
});
// Start Server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
