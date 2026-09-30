import { useCallback, useEffect, useMemo, useState } from "react";

import CreateUserModal from "../../components/users/CreateUserModal";
import EditUserModal from "../../components/users/EditUserModal";

import { getUsers, updateUserStatus } from "../../services/user.service";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Users
  |--------------------------------------------------------------------------
  */

  const loadUsers = useCallback(async () => {
    try {
      setError("");

      const response = await getUsers();

      const data = Array.isArray(response) ? response : response?.data || [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load users.",
      );

      setUsers([]);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await loadUsers();

      setLoading(false);
    };

    load();
  }, [loadUsers]);

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !value ||
        user?.name?.toLowerCase().includes(value) ||
        user?.email?.toLowerCase().includes(value) ||
        user?.role?.toLowerCase().includes(value);

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

      admins: users.filter((user) => user.role === "Admin").length,

      analysts: users.filter((user) => user.role === "Analyst").length,

      managers: users.filter((user) => user.role === "Estate Manager").length,

      active: users.filter((user) => user.isActive !== false).length,
    };
  }, [users]);

  /*
  |--------------------------------------------------------------------------
  | Create Success
  |--------------------------------------------------------------------------
  */

  const handleCreateSuccess = async () => {
    setShowCreateModal(false);

    setSuccess("User created successfully.");

    await loadUsers();
  };

  /*
  |--------------------------------------------------------------------------
  | Edit Success
  |--------------------------------------------------------------------------
  */

  const handleEditSuccess = async () => {
    setEditingUser(null);

    setSuccess("User updated successfully.");

    await loadUsers();
  };

  /*
  |--------------------------------------------------------------------------
  | Activate / Deactivate
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (user) => {
    const userId = user._id || user.id;

    if (!userId) {
      return;
    }

    const currentlyActive = user.isActive !== false;

    /*
     * Ask for confirmation only when
     * disabling an account.
     */
    if (currentlyActive) {
      const confirmed = window.confirm(
        `Deactivate ${user.name}? They will no longer be able to use the system.`,
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setStatusUpdatingId(userId);

      setError("");
      setSuccess("");

      const response = await updateUserStatus(userId, !currentlyActive);

      setSuccess(
        response?.message ||
          (!currentlyActive
            ? "User activated successfully."
            : "User deactivated successfully."),
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update user status.",
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div
            className="
              h-8
              w-56
              animate-pulse
              rounded
              bg-slate-200
            "
          />

          <div
            className="
              mt-2
              h-4
              w-72
              animate-pulse
              rounded
              bg-slate-200
            "
          />
        </div>

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-5
          "
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="
                  h-28
                  animate-pulse
                  rounded-xl
                  bg-slate-200
                "
            />
          ))}
        </div>

        <div
          className="
            h-96
            animate-pulse
            rounded-xl
            bg-slate-200
          "
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            User Management
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Manage system users, roles, estate assignments and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setShowCreateModal(true);
          }}
          className="
            rounded-lg
            bg-green-700
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-green-800
          "
        >
          + Create User
        </button>
      </div>

      {/* =========================================================
          MESSAGES
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

      {success && (
        <div
          role="status"
          className="
            rounded-xl
            border
            border-green-200
            bg-green-50
            p-4
            text-sm
            text-green-700
          "
        >
          {success}
        </div>
      )}

      {/* =========================================================
          STATISTICS
      ========================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-5
        "
      >
        <StatCard title="Total Users" value={statistics.total} />

        <StatCard title="Active Users" value={statistics.active} />

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
        <div
          className="
            w-full
            md:max-w-md
          "
        >
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

        <div
          className="
            w-full
            md:w-56
          "
        >
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
          TABLE
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
            border-b
            px-6
            py-5
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-slate-900
            "
          >
            System Users
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "user" : "users"} displayed
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <div
            className="
              p-10
              text-center
            "
          >
            <p
              className="
                font-medium
                text-slate-700
              "
            >
              No users found
            </p>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Try changing the search or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="
                min-w-full
                text-sm
              "
            >
              <thead
                className="
                  bg-slate-50
                "
              >
                <tr>
                  <TableHeader>User</TableHeader>

                  <TableHeader>Role</TableHeader>

                  <TableHeader>Assigned Estate</TableHeader>

                  <TableHeader>Status</TableHeader>

                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const userId = user._id || user.id;

                  return (
                    <UserRow
                      key={userId || user.email}
                      user={user}
                      updating={statusUpdatingId === userId}
                      onEdit={() => {
                        setError("");
                        setSuccess("");
                        setEditingUser(user);
                      }}
                      onStatusChange={() => handleStatusChange(user)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================
          CREATE MODAL
      ========================================================== */}

      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* =========================================================
          EDIT MODAL
      ========================================================== */}

      <EditUserModal
        open={Boolean(editingUser)}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| User Row
|--------------------------------------------------------------------------
*/

const UserRow = ({ user, updating, onEdit, onStatusChange }) => {
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
    <tr
      className="
        border-t
        border-slate-100
        hover:bg-slate-50/50
      "
    >
      <td className="px-6 py-4">
        <p
          className="
            font-semibold
            text-slate-900
          "
        >
          {user?.name || "-"}
        </p>

        <p
          className="
            mt-1
            text-xs
            text-slate-500
          "
        >
          {user?.email || "-"}
        </p>
      </td>

      <td className="px-6 py-4">
        <RoleBadge role={user?.role} />
      </td>

      <td
        className="
          px-6
          py-4
          text-slate-600
        "
      >
        {estateName}
      </td>

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

      <td className="px-6 py-4">
        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          <button
            type="button"
            onClick={onEdit}
            className="
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-100
            "
          >
            Edit
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={onStatusChange}
            className={`
              rounded-lg
              px-3
              py-2
              text-xs
              font-semibold
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50

              ${
                isActive
                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }
            `}
          >
            {updating ? "Updating..." : isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
};

/*
|--------------------------------------------------------------------------
| Table Header
|--------------------------------------------------------------------------
*/

const TableHeader = ({ children }) => (
  <th
    className="
      whitespace-nowrap
      px-6
      py-4
      text-left
      font-semibold
      text-slate-600
    "
  >
    {children}
  </th>
);

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

const StatCard = ({ title, value }) => (
  <div
    className="
      rounded-xl
      border
      bg-white
      p-5
      shadow-sm
    "
  >
    <p
      className="
        text-sm
        text-slate-500
      "
    >
      {title}
    </p>

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

export default Users;
