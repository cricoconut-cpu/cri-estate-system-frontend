import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:ml-64">
        <Navbar />

        <main
          className="
          p-4
          sm:p-6
          lg:p-8
        "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
