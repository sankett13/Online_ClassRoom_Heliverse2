const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
  name: String,
  startTime: String,
  endTime: String,
  days: String,
  teacherId: String,
  studentId: String,
});

const classroom = mongoose.model("classroom", classroomSchema);
module.exports = classroom;
