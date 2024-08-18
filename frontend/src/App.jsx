import { Routes, Route } from "react-router-dom";
import "./App.css";
import PrincipalView from "./components/Principal/Principal";
import TeacherView from "./components/Teacher/Teacher";
import Login from "./components/Login";
import ClassmatesView from "./components/Student/Student";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/principal" element={<PrincipalView />} />
      <Route path="/teacher" element={<TeacherView />} />
      <Route path="/classmates" element={<ClassmatesView />} />
    </Routes>
  );
}

export default App;
