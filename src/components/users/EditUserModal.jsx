import { useEffect, useState } from "react";

import { getEstates } from "../../services/estate.service";

import { updateUser } from "../../services/user.service";

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "Analyst",
  assignedEstate: "",
  password: "",
};

const EditUserModal = ({ open, user, onClose, onSuccess }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  const [estates, setEstates] = useState([]);

  const [loadingEstates, setLoadingEstates] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Existing User Into Form
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open || !user) {
      return;
    }

    const assignedEstate = user.assignedEstate;

    const assignedEstateId =
      typeof assignedEstate === "object"
        ? assignedEstate?._id || assignedEstate?.id || ""
        : assignedEstate || "";

    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Analyst",
      assignedEstate: assignedEstateId,
      password: "",
    });

    setError("");
  }, [open, user]);

  /*
  |--------------------------------------------------------------------------
  | Load Estates
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadEstates = async () => {
      try {
        setLoadingEstates(true);

        const response = await getEstates();

        const data = Array.isArray(response) ? response : response?.data || [];

        setEstates(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load estates.",
        );
      } finally {
        setLoadingEstates(false);
      }
    };

    loadEstates();
  }, [open]);

  /*
  |--------------------------------------------------------------------------
  | Escape Key
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, submitting, onClose]);

  if (!open || !user) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "role" && value !== "Estate Manager") {
      setForm((current) => ({
        ...current,
        role: value,
        assignedEstate: "",
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");

      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");

      return;
    }

    if (form.role === "Estate Manager" && !form.assignedEstate) {
      setError("Please select an estate for the Estate Manager.");

      return;
    }

    if (form.password && form.password.length < 6) {
      setError("New password must contain at least 6 characters.");

      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,

        assignedEstate:
          form.role === "Estate Manager" ? form.assignedEstate : null,
      };

      /*
       * Blank password means:
       * keep the existing password.
       */
      if (form.password) {
        payload.password = form.password;
      }

      const userId = user._id || user.id;

      const response = await updateUser(userId, payload);

      onSuccess?.(response);

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update user.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[1000]
        flex
        items-center
        justify-center
        bg-black/40
        p-4
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            px-6
            py-5
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Edit User
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Update user information, role and estate assignment.
            </p>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            aria-label="Close"
            className="
              rounded-lg
              px-3
              py-2
              text-xl
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:opacity-50
            "
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
            p-6
          "
        >
          {error && (
            <div
              role="alert"
              className="
                rounded-lg
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

          {/* Name */}

          <div>
            <label
              htmlFor="edit-user-name"
              className="
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Name
            </label>

            <input
              id="edit-user-name"
              name="name"
              value={form.name}
              disabled={submitting}
              onChange={handleChange}
              required
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                px-4
                py-3
                text-sm
                outline-none
                focus:border-green-600
                focus:ring-2
                focus:ring-green-100
                disabled:bg-slate-100
              "
            />
          </div>

          {/* Email */}

          <div>
            <label
              htmlFor="edit-user-email"
              className="
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Email
            </label>

            <input
              id="edit-user-email"
              name="email"
              type="email"
              value={form.email}
              disabled={submitting}
              onChange={handleChange}
              required
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                px-4
                py-3
                text-sm
                outline-none
                focus:border-green-600
                focus:ring-2
                focus:ring-green-100
                disabled:bg-slate-100
              "
            />
          </div>

          {/* Role */}

          <div>
            <label
              htmlFor="edit-user-role"
              className="
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Role
            </label>

            <select
              id="edit-user-role"
              name="role"
              value={form.role}
              disabled={submitting}
              onChange={handleChange}
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                focus:border-green-600
                focus:ring-2
                focus:ring-green-100
                disabled:bg-slate-100
              "
            >
              <option value="Admin">Admin</option>

              <option value="Analyst">Analyst</option>

              <option value="Estate Manager">Estate Manager</option>
            </select>
          </div>

          {/* Estate */}

          {form.role === "Estate Manager" && (
            <div>
              <label
                htmlFor="edit-user-estate"
                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Assigned Estate
              </label>

              <select
                id="edit-user-estate"
                name="assignedEstate"
                value={form.assignedEstate}
                disabled={submitting || loadingEstates}
                onChange={handleChange}
                required
                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-green-600
                  focus:ring-2
                  focus:ring-green-100
                  disabled:bg-slate-100
                "
              >
                <option value="">
                  {loadingEstates ? "Loading estates..." : "Select Estate"}
                </option>

                {estates.map((estate) => {
                  const estateId = estate.id || estate._id;

                  return (
                    <option key={estateId} value={estateId}>
                      {estate.name}
                      {estate.district ? ` — ${estate.district}` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Password */}

          <div>
            <label
              htmlFor="edit-user-password"
              className="
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              New Password
            </label>

            <input
              id="edit-user-password"
              name="password"
              type="password"
              value={form.password}
              disabled={submitting}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                px-4
                py-3
                text-sm
                outline-none
                focus:border-green-600
                focus:ring-2
                focus:ring-green-100
                disabled:bg-slate-100
              "
            />

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Leave blank if the password should not change.
            </p>
          </div>

          {/* Actions */}

          <div
            className="
              flex
              justify-end
              gap-3
              border-t
              pt-5
            "
          >
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="
                rounded-lg
                border
                border-slate-300
                bg-white
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                rounded-lg
                bg-green-700
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-green-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
