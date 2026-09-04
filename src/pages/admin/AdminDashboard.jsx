import { Building2, CalendarDays, Map, Users } from "lucide-react";

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
        <StatCard
          title="Total Estates"
          value={data.totalEstates}
          icon={Building2}
        />

        <StatCard title="Total Users" value={data.totalUsers} icon={Users} />

        <StatCard title="Total Surveys" value={data.totalSurveys} icon={Map} />

        <StatCard
          title="Latest Survey Year"
          value={data.latestSurvey?.year || "-"}
          icon={CalendarDays}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
