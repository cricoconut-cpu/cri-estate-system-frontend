import { useEffect, useState } from "react";

import { getEstates } from "../../services/estate.service";

import EstateCard from "../../components/estate/EstateCard";

const Estates = () => {
  const [estates, setEstates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadEstates = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getEstates();

        setEstates(response?.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load estates.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEstates();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading estates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div
          className="
          rounded-lg
          border
          border-red-200
          bg-red-50
          p-4
          text-red-600
        "
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1
          className="
          text-3xl
          font-bold
          text-slate-900
        "
        >
          Estates
        </h1>

        <p
          className="
          mt-2
          text-slate-500
        "
        >
          Manage and analyse estate surveys
        </p>
      </div>

      {estates.length === 0 ? (
        <div
          className="
          mt-8
          rounded-xl
          border
          bg-white
          p-8
          text-center
        "
        >
          <p className="text-slate-500">No estates found.</p>
        </div>
      ) : (
        <div
          className="
          mt-8
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-3
        "
        >
          {estates.map((estate) => (
            <EstateCard key={estate._id} estate={estate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Estates;
