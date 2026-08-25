import { Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/admin/AdminDashboard";

import AnalystDashboard from "../pages/analyst/AnalystDashboard";

import ManagerDashboard from "../pages/manager/ManagerDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="/analyst" element={<AnalystDashboard />} />

      <Route path="/manager" element={<ManagerDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
