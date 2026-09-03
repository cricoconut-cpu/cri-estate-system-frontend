import { Building2, Map, TreePine, Users } from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";

import useAdminDashboard from "../../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const { data, loading, error } = useAdminDashboard();

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div
        className="
p-8
text-red-600
"
      >
        {error}
      </div>
    );
  }

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
        CRI Estate monitoring overview
      </p>

      <div
        className="
mt-8
grid
gap-6
sm:grid-cols-2
lg:grid-cols-4
"
      >
        <StatCard title="Total Estates" value={data.estates} icon={Building2} />

        <StatCard title="Users" value={data.users} icon={Users} />

        <StatCard title="Surveys" value={data.surveys} icon={Map} />

        <StatCard
          title="Total Trees"
          value={data.statistics.totalTrees || 0}
          icon={TreePine}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
