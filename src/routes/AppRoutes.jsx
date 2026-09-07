import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Unauthorized from "../pages/shared/Unauthorized";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AnalystDashboard from "../pages/analyst/AnalystDashboard";
import Estates from "../pages/estates/Estates";
import ManagerDashboard from "../pages/manager/ManagerDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Application Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Analyst Dashboard */}
        <Route
          path="/analyst"
          element={
            <ProtectedRoute allowedRoles={["Analyst"]}>
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />

        {/* Estates */}
        <Route
          path="/estates"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Analyst", "Estate Manager"]}
            >
              <Estates />
            </ProtectedRoute>
          }
        />

        {/* Estate Manager Dashboard */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["Estate Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
