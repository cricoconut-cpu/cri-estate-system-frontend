import { useEffect, useMemo, useState } from "react";

import { getUsers } from "../../services/user.service";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  /*
  |--------------------------------------------------------------------------
  | Load Users
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getUsers();

        /*
         * Supports:
         *
         * {
         *   success: true,
         *   data: [...]
         * }
         *
         * or direct array response.
         */

        const userData = Array.isArray(response)
          ? response
          : response?.data || [];

        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load users.",
        );

        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filter Users
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user?.name?.toLowerCase().includes(searchValue) ||
        user?.email?.toLowerCase().includes(searchValue) ||
        user?.role?.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "All" || user?.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    return {
      total: users.length,

      admins: users.filter((user) => user?.role === "Admin").length,

      analysts: users.filter((user) => user?.role === "Analyst").length,

      managers: users.filter((user) => user?.role === "Estate Manager").length,
    };
  }, [users]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          User Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View system users and their assigned roles.
        </p>
      </div>

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* =========================================================
          USER STATISTICS
      ========================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        <StatCard title="Total Users" value={statistics.total} />

        <StatCard title="Admins" value={statistics.admins} />

        <StatCard title="Analysts" value={statistics.analysts} />

        <StatCard title="Estate Managers" value={statistics.managers} />
      </div>

      {/* =========================================================
          FILTERS
      ========================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-xl
          border
          bg-white
          p-5
          shadow-sm
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div className="w-full md:max-w-md">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>

          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or role..."
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              px-4
              py-2.5
              text-sm
              outline-none
              focus:border-green-600
              focus:ring-2
              focus:ring-green-100
            "
          />
        </div>

        <div className="w-full md:w-56">
          <label htmlFor="role-filter" className="sr-only">
            Filter by role
          </label>

          <select
            id="role-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-4
              py-2.5
              text-sm
              text-slate-700
              outline-none
              focus:border-green-600
              focus:ring-2
              focus:ring-green-100
            "
          >
            <option value="All">All Roles</option>

            <option value="Admin">Admin</option>

            <option value="Analyst">Analyst</option>

            <option value="Estate Manager">Estate Manager</option>
          </select>
        </div>
      </div>

      {/* =========================================================
          USERS TABLE
      ========================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-6
            py-5
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              System Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"} displayed
            </p>
          </div>
        </div>

        {/* Empty State */}

        {!error && filteredUsers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-700">No users found</p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-slate-600
                    "
                  >
                    User
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-slate-600
                    "
                  >
                    Role
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-slate-600
                    "
                  >
                    Assigned Estate
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-slate-600
                    "
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id || user._id || user.email}
                    user={user}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| User Row
|--------------------------------------------------------------------------
*/

const UserRow = ({ user }) => {
  const assignedEstate = user?.assignedEstate;

  let estateName = "-";

  if (typeof assignedEstate === "string") {
    estateName = assignedEstate;
  }

  if (assignedEstate && typeof assignedEstate === "object") {
    estateName = assignedEstate.name || assignedEstate.estateCode || "-";
  }

  const isActive = user?.isActive !== false;

  return (
    <tr className="border-t border-slate-100">
      {/* User */}

      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-slate-900">{user?.name || "-"}</p>

          <p className="mt-1 text-xs text-slate-500">{user?.email || "-"}</p>
        </div>
      </td>

      {/* Role */}

      <td className="px-6 py-4">
        <RoleBadge role={user?.role} />
      </td>

      {/* Estate */}

      <td className="px-6 py-4 text-slate-600">{estateName}</td>

      {/* Status */}

      <td className="px-6 py-4">
        <span
          className={`
            inline-flex
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold

            ${
              isActive
                ? "bg-green-50 text-green-700"
                : "bg-slate-100 text-slate-600"
            }
          `}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );
};

/*
|--------------------------------------------------------------------------
| Role Badge
|--------------------------------------------------------------------------
*/

const RoleBadge = ({ role }) => {
  let classes = "bg-slate-100 text-slate-700";

  if (role === "Admin") {
    classes = "bg-purple-50 text-purple-700";
  }

  if (role === "Analyst") {
    classes = "bg-blue-50 text-blue-700";
  }

  if (role === "Estate Manager") {
    classes = "bg-green-50 text-green-700";
  }

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${classes}
      `}
    >
      {role || "-"}
    </span>
  );
};

/*
|--------------------------------------------------------------------------
| Statistic Card
|--------------------------------------------------------------------------
*/

const StatCard = ({ title, value }) => {
  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >
      <p className="text-sm text-slate-500">{title}</p>

      <p
        className="
          mt-2
          text-3xl
          font-bold
          text-slate-900
        "
      >
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
};

export default Users;
