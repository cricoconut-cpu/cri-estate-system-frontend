import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header
      className="
      h-16
      bg-white
      border-b
      flex
      items-center
      justify-between
      px-6
    "
    >
      <div>
        <p
          className="
          font-semibold
        "
        >
          {user?.name}
        </p>

        <p
          className="
          text-sm
          text-slate-500
        "
        >
          {user?.role}
        </p>
      </div>

      <button
        onClick={logout}
        className="
          rounded-lg
          bg-red-600
          px-4
          py-2
          text-white
          hover:bg-red-700
        "
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
