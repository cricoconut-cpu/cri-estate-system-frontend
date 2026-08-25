import { Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
