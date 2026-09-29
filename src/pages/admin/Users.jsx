import { useEffect, useMemo, useState } from "react";

import { getUsers } from "../../services/user.service";

import CreateUserModal from "../../components/users/CreateUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getUsers();

      const data = Array.isArray(response) ? response : response?.data || [];

      setUsers(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchSearch =
        !value ||
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value);

      const matchRole = roleFilter === "All" || user.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div
      className="
        space-y-6
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
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
            Manage system users and roles.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="
            rounded-lg
            bg-green-700
            px-5
            py-3
            text-white
            hover:bg-green-800
          "
        >
          + Create User
        </button>
      </div>

      {error && (
        <div
          className="
            rounded-lg
            bg-red-50
            p-4
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* Filters */}

      <div
        className="
          flex
          gap-4
          rounded-xl
          border
          bg-white
          p-5
        "
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="
            flex-1
            rounded-lg
            border
            px-4
            py-2
          "
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="
            rounded-lg
            border
            px-4
          "
        >
          <option>All</option>

          <option>Admin</option>

          <option>Analyst</option>

          <option>Estate Manager</option>
        </select>
      </div>

      {/* Table */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
        "
      >
        <table
          className="
            min-w-full
          "
        >
          <thead
            className="
              bg-slate-50
            "
          >
            <tr>
              <th className="px-6 py-4 text-left">Name</th>

              <th className="px-6 py-4 text-left">Email</th>

              <th className="px-6 py-4 text-left">Role</th>

              <th className="px-6 py-4 text-left">Estate</th>

              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="
                    border-t
                  "
              >
                <td className="px-6 py-4">{user.name}</td>

                <td className="px-6 py-4">{user.email}</td>

                <td className="px-6 py-4">
                  <span
                    className="
                        rounded-full
                        bg-green-50
                        px-3
                        py-1
                        text-sm
                        text-green-700
                      "
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {user.assignedEstate?.name || "-"}
                </td>

                <td className="px-6 py-4">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);

          loadUsers();
        }}
      />
    </div>
  );
};

export default Users;
