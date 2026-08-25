import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { loginUser } from "../../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const data = await loginUser(email, password);

      login(data.user, data.token);

      const role = data.user.role;

      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Analyst") {
        navigate("/analyst");
      } else if (role === "Estate Manager") {
        navigate("/manager");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
min-h-screen
flex
items-center
justify-center
bg-slate-100
px-4
"
    >
      <div
        className="
w-full
max-w-md
rounded-xl
bg-white
p-8
shadow-lg
"
      >
        <h1
          className="
text-2xl
font-bold
text-slate-900
"
        >
          CRI Estate System
        </h1>

        <p
          className="
mt-2
text-sm
text-slate-500
"
        >
          Sign in to continue
        </p>

        {error && (
          <div
            className="
mt-4
rounded-md
bg-red-50
p-3
text-sm
text-red-600
"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="
mt-6
space-y-4
"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
w-full
rounded-lg
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-green-500
"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
w-full
rounded-lg
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-green-500
"
          />

          <button
            disabled={loading}
            className="
w-full
rounded-lg
bg-green-700
py-3
font-semibold
text-white
hover:bg-green-800
disabled:opacity-50
"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
