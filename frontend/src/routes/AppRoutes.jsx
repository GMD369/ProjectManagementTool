import { Routes, Route } from "react-router-dom";
import React from "react";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
// import Projects from "../pages/Projects";
// import Tasks from "../pages/Tasks";
// import Team from "../pages/Team";
// import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
       <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/projects" element={<Projects />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/team" element={<Team />} />
      <Route path="/profile" element={<Profile />} /> */}
    </Routes>
  );
};

export default AppRoutes;
