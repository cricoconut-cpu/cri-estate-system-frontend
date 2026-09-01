import { Building2, Map, Users } from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";

const AdminDashboard = () => {
  return (
    <div>
      <h1
        className="
text-3xl
font-bold
text-slate-900
"
      >
        Admin Dashboard
      </h1>

      <p
        className="
mt-2
text-slate-500
"
      >
        System overview
      </p>

      <div
        className="
mt-8
grid
gap-6
sm:grid-cols-2
lg:grid-cols-3
"
      >
        <StatCard title="Total Estates" value="11" icon={Building2} />

        <StatCard title="Users" value="4" icon={Users} />

        <StatCard title="Surveys" value="1" icon={Map} />
      </div>
    </div>
  );
};

export default AdminDashboard;
