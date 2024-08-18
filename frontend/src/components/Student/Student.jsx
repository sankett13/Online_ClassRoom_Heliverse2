import React, { useState, useEffect } from "react";

const ClassmatesView = () => {
  const [classmates, setClassmates] = useState([]);

  useEffect(() => {
    fetchClassmates();
  }, []);

  const fetchClassmates = async () => {
    try {
      const response = await fetch("http://localhost:8080/student/classmates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch classmates");
      }
      const data = await response.json();
      setClassmates(data);
    } catch (error) {
      console.error("Error fetching classmates:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Your Classmates</h2>
      {classmates.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left w-1/2">Name</th>
              <th className="py-2 px-4 bg-gray-200 text-left w-1/2">Email</th>
            </tr>
          </thead>
          <tbody>
            {classmates.map((classmate) => (
              <tr key={classmate._id}>
                <td className="py-2 px-4 text-left">{classmate.name}</td>
                <td className="py-2 px-4 text-left">{classmate.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No classmates found.</p>
      )}
    </div>
  );
};

export default ClassmatesView;
