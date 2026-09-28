import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import AnalystDashboard from "../pages/analyst/AnalystDashboard";
import Login from "../pages/auth/Login";
import EstateDetails from "../pages/estates/EstateDetails";
import Estates from "../pages/estates/Estates";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import Unauthorized from "../pages/shared/Unauthorized";
import SurveyAnalysis from "../pages/surveys/SurveyAnalysis";
import UploadSurvey from "../pages/surveys/UploadSurvey";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================================================
          PUBLIC ROUTES
      ========================================================== */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =========================================================
          PROTECTED APPLICATION
      ========================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* =====================================================
            ADMIN DASHBOARD
        ====================================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ANALYST DASHBOARD
        ====================================================== */}

        <Route
          path="/analyst"
          element={
            <ProtectedRoute allowedRoles={["Analyst"]}>
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ESTATE MANAGER DASHBOARD
        ====================================================== */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["Estate Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ESTATES
        ====================================================== */}

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

        <Route
          path="/estates/:estateId"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Analyst", "Estate Manager"]}
            >
              <EstateDetails />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SURVEY UPLOAD
        ====================================================== */}

        <Route
          path="/surveys/upload"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Analyst"]}>
              <UploadSurvey />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SURVEY ANALYSIS
        ====================================================== */}

        <Route
          path="/surveys/:surveyId"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Analyst", "Estate Manager"]}
            >
              <SurveyAnalysis />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* =========================================================
          UNKNOWN ROUTES
      ========================================================== */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
