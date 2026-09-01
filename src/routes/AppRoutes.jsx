import { Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";

import Unauthorized from "../pages/shared/Unauthorized";

import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AnalystDashboard from "../pages/analyst/AnalystDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyst"
          element={
            <ProtectedRoute allowedRoles={["Analyst"]}>
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["Estate Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
