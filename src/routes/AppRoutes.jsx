import { Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";

import DashboardLayout from "../layouts/DashboardLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";

import AnalystDashboard from "../pages/analyst/AnalystDashboard";

import ManagerDashboard from "../pages/manager/ManagerDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/analyst" element={<AnalystDashboard />} />

        <Route path="/manager" element={<ManagerDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
