import { NavLink } from "react-router-dom";

import { Building2, LayoutDashboard, Map, Upload, Users } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Admin", "Analyst", "Estate Manager"],
    },

    {
      name: "Estates",
      path: "/estates",
      icon: Building2,
      roles: ["Admin", "Analyst", "Estate Manager"],
    },

    {
      name: "Map",
      path: "/map",
      icon: Map,
      roles: ["Admin", "Analyst", "Estate Manager"],
    },

    {
      name: "Upload Survey",
      path: "/surveys/upload",
      icon: Upload,
      roles: ["Admin", "Analyst"],
    },

    {
      name: "Users",
      path: "/users",
      icon: Users,
      roles: ["Admin"],
    },
  ];

  return (
    <aside
      className="
      hidden
      lg:flex
      fixed
      left-0
      top-0
      h-screen
      w-64
      flex-col
      bg-green-900
      text-white
      p-5
    "
    >
      <h1
        className="
        text-xl
        font-bold
        mb-8
      "
      >
        CRI Estate
      </h1>

      <nav
        className="
        space-y-2
      "
      >
        {menu
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                ${isActive ? "bg-green-700" : "hover:bg-green-800"}
                `
                }
              >
                <Icon size={20} />

                {item.name}
              </NavLink>
            );
          })}
      </nav>
    </aside>
  );
};

export default Sidebar;
