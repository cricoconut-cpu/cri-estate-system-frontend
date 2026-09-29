import { useEffect, useState } from "react";

import { createUser } from "../../services/user.service";

import { getEstates } from "../../services/estate.service";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "Analyst",
  assignedEstate: "",
};

const CreateUserModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);

  const [estates, setEstates] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load estates
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) return;

    const loadEstates = async () => {
      try {
        const response = await getEstates();

        const estateData = Array.isArray(response)
          ? response
          : response?.data || [];

        setEstates(estateData);
      } catch (error) {
        setError("Failed to load estates.");
      }
    };

    loadEstates();
  }, [open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      setError("");

      await createUser(form);

      setForm(initialForm);

      onSuccess();

      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create user.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-xl
          bg-white
          p-6
          shadow-xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            Create User
          </h2>

          <button
            onClick={onClose}
            className="
              text-slate-400
              hover:text-slate-700
            "
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            className="
              mt-4
              rounded-lg
              bg-red-50
              p-3
              text-sm
              text-red-700
            "
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="
            mt-5
            space-y-4
          "
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            required
            className="
              w-full
              rounded-lg
              border
              px-4
              py-3
            "
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="
              w-full
              rounded-lg
              border
              px-4
              py-3
            "
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="
              w-full
              rounded-lg
              border
              px-4
              py-3
            "
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="
              w-full
              rounded-lg
              border
              bg-white
              px-4
              py-3
            "
          >
            <option value="Admin">Admin</option>

            <option value="Analyst">Analyst</option>

            <option value="Estate Manager">Estate Manager</option>
          </select>

          {form.role === "Estate Manager" && (
            <select
              name="assignedEstate"
              value={form.assignedEstate}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-lg
                border
                bg-white
                px-4
                py-3
              "
            >
              <option value="">Select Estate</option>

              {estates.map((estate) => (
                <option
                  key={estate._id || estate.id}
                  value={estate._id || estate.id}
                >
                  {estate.name}
                </option>
              ))}
            </select>
          )}

          <div
            className="
              flex
              justify-end
              gap-3
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                border
                px-5
                py-2
              "
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="
                rounded-lg
                bg-green-700
                px-5
                py-2
                text-white
              "
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
