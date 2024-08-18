import React, { useState, useEffect } from "react";

const TeacherView = () => {
  const [students, setStudents] = useState([]);
  const [editingUser, setEditingUser] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [editing, setEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/teacher/students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (student) => {
    setEditingUser({
      name: student.name,
      email: student.email,
      password: "", // Clear the password field for security
      department: student.department,
    });
    setCurrentStudentId(student._id);
    setEditing(true);
  };

  const handleInputChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/teacher/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...editingUser, role: "Student" }),
      });
      if (!response.ok) {
        throw new Error("Failed to add student");
      }
      const data = await response.json();
      setStudents([...students, data]);
      setEditingUser({ name: "", email: "", password: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/update/user/${currentStudentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ editingUser }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update student");
      }
      const updatedStudent = await response.json();
      setStudents(
        students.map((student) =>
          student._id === currentStudentId ? updatedStudent : student
        )
      );
      setEditingUser({ name: "", email: "", password: "", department: "" });
      setEditing(false);
      setCurrentStudentId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Students in Your Classroom</h2>

      {/* Display error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Student List Table */}
      <table className="min-w-full bg-white shadow-md rounded mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200">Name</th>
            <th className="py-2 px-4 bg-gray-200">Email</th>
            <th className="py-2 px-4 bg-gray-200">Department</th>
            <th className="py-2 px-4 bg-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="py-2 px-4">{student.name}</td>
              <td className="py-2 px-4">{student.email}</td>
              <td className="py-2 px-4">{student.department}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Student Form */}
      <h3 className="text-xl font-bold mb-4">
        {editing ? "Edit Student" : "Add a New Student"}
      </h3>
      <form
        onSubmit={editing ? handleUpdateStudent : handleAddStudent}
        className="mb-8"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={editingUser.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter student name"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={editingUser.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter student email"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="department"
          >
            Department
          </label>
          <input
            type="text"
            name="department"
            value={editingUser.department}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter department"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={editingUser.password}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter student password"
            required={!editing} // Make password optional during edit
          />
        </div>
        <button
          type="submit"
          className={`${
            editing ? "bg-blue-500" : "bg-green-500"
          } text-white px-4 py-2 rounded`}
        >
          {editing ? "Update Student" : "Add Student"}
        </button>
        {editing && (
          <button
            type="button"
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditing(false);
              setEditingUser({
                name: "",
                email: "",
                password: "",
                department: "",
              });
              setCurrentStudentId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default TeacherView;
