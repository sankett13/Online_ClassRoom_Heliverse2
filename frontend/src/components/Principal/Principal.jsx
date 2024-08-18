import React, { useState, useEffect } from "react";

const PrincipalView = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    startTime: "",
    endTime: "",
    days: "",
    teacherId: "", // New field to store the selected teacher
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Teacher", // Default role
    department: "", // New department field
  });

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchClassrooms();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:8080/teachers", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/students", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/classroom", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const handleClassroomCreation = async () => {
    try {
      const response = await fetch("http://localhost:8080/create/classroom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newClassroom),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setClassrooms([...classrooms, data]);
      setNewClassroom({
        name: "",
        startTime: "",
        endTime: "",
        days: "",
        teacherId: "",
      });
    } catch (error) {
      console.error("Error creating classroom:", error);
    }
  };

  // const handleAssignTeacher = async () => {
  //   try {
  //     await fetch(`/api/classrooms/${selectedTeacher}/assign-teacher`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ teacherId: selectedTeacher }),
  //     });
  //     // Update state if needed after assigning
  //   } catch (error) {
  //     console.error("Error assigning teacher:", error);
  //   }
  // };

  const handleDelete = async (id, role) => {
    try {
      await fetch(`http://localhost:8080/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (role === "teacher") {
        setTeachers(teachers.filter((teacher) => teacher._id !== id));
      } else if (role === "student") {
        setStudents(students.filter((student) => student._id !== id));
      }
    } catch (error) {
      console.error(`Error deleting ${role}:`, error);
    }
  };

  const handleUserCreation = async () => {
    try {
      const response = await fetch("http://localhost:8080/create/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      if (data.role === "Teacher") {
        setTeachers([...teachers, data]);
      } else {
        setStudents([...students, data]);
      }
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "Teacher",
        department: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEdit = (user, role) => {
    setEditingUser({ ...user, role });
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/update/user/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ editingUser }), // No need to wrap editingUser in another object
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const updatedUser = await response.json();
      window.location.reload();
      if (updatedUser.role === "Teacher") {
        setTeachers(
          teachers.map((teacher) =>
            teacher._id === updatedUser._id ? updatedUser : teacher
          )
        );
        setEditingUser(updatedUser);
      } else {
        setStudents(
          students.map((student) =>
            student._id === updatedUser._id ? updatedUser : student
          )
        );
        setEditingUser(updatedUser);
      }

      // Close the edit modal
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="p-8">
      {/* Teachers and Students Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Teachers and Students</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Teachers</h3>
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-200">Name</th>
                  <th className="py-2 px-4 bg-gray-200">Email</th>
                  <th className="py-2 px-4 bg-gray-200">Dept</th>
                  <th className="py-2 px-4 bg-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className="py-2 px-4">{teacher.name}</td>
                    <td className="py-2 px-4">{teacher.email}</td>
                    <td className="py-2 px-4">{teacher.department}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEdit(teacher, "Teacher")}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(teacher._id, "teacher")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Students</h3>
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-200">Name</th>
                  <th className="py-2 px-4 bg-gray-200">Email</th>
                  <th className="py-2 px-4 bg-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="py-2 px-4">{student.name}</td>
                    <td className="py-2 px-4">{student.email}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEdit(student, "Student")}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(student._id, "student")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Classroom */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create a Classroom</h2>
        <div className="grid grid-cols-2 gap-8">
          <input
            type="text"
            placeholder="Classroom Name"
            value={newClassroom.name}
            onChange={(e) =>
              setNewClassroom({ ...newClassroom, name: e.target.value })
            }
            className="border border-gray-400 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Start Time"
            value={newClassroom.startTime}
            onChange={(e) =>
              setNewClassroom({ ...newClassroom, startTime: e.target.value })
            }
            className="border border-gray-400 p-2 rounded"
          />
          <input
            type="text"
            placeholder="End Time"
            value={newClassroom.endTime}
            onChange={(e) =>
              setNewClassroom({ ...newClassroom, endTime: e.target.value })
            }
            className="border border-gray-400 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Days"
            value={newClassroom.days}
            onChange={(e) =>
              setNewClassroom({ ...newClassroom, days: e.target.value })
            }
            className="border border-gray-400 p-2 rounded"
          />
          <select
            value={newClassroom.teacherId}
            onChange={(e) =>
              setNewClassroom({ ...newClassroom, teacherId: e.target.value })
            }
            className="border border-gray-400 p-2 rounded"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleClassroomCreation}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Create Classroom
          </button>
        </div>
      </div>

      {/* Create User */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create a User</h2>
        <div className="grid grid-cols-2 gap-8">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border border-gray-400 p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border border-gray-400 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border border-gray-400 p-2 rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border border-gray-400 p-2 rounded"
          >
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
          <input
            type="text"
            placeholder="Department"
            value={newUser.department}
            onChange={(e) =>
              setNewUser({ ...newUser, department: e.target.value })
            }
            className="border border-gray-400 p-2 rounded"
          />
          <button
            onClick={handleUserCreation}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create User
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className="border border-gray-400 p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="border border-gray-400 p-2 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={editingUser.password}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, password: e.target.value })
                }
                className="border border-gray-400 p-2 rounded"
              />
              <select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                className="border border-gray-400 p-2 rounded"
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
              <input
                type="text"
                placeholder="Department"
                value={editingUser.department}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, department: e.target.value })
                }
                className="border border-gray-400 p-2 rounded"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpdateUser}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalView;
