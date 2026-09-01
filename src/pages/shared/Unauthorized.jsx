const Unauthorized = () => {
  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-100
    "
    >
      <div
        className="
        rounded-xl
        bg-white
        p-8
        shadow
        text-center
      "
      >
        <h1
          className="
          text-3xl
          font-bold
          text-red-600
        "
        >
          Access Denied
        </h1>

        <p
          className="
          mt-3
          text-slate-500
        "
        >
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
