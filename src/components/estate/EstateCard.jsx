import { ArrowRight, MapPin } from "lucide-react";

import { useNavigate } from "react-router-dom";

const EstateCard = ({ estate }) => {
  const navigate = useNavigate();

  const handleViewEstate = () => {
    navigate(`/estates/${estate._id}`);
  };

  return (
    <div
      className="
      rounded-xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      transition
      hover:shadow-md
    "
    >
      {/* Estate Header */}

      <div
        className="
        flex
        items-start
        justify-between
        gap-4
      "
      >
        <div>
          <h2
            className="
            text-xl
            font-semibold
            text-slate-900
          "
          >
            {estate.name}
          </h2>

          <div
            className="
            mt-2
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
          "
          >
            <MapPin size={16} />

            <span>{estate.location || "Location not available"}</span>
          </div>
        </div>
      </div>

      {/* Estate Information */}

      <div
        className="
        mt-6
        grid
        grid-cols-2
        gap-4
      "
      >
        <div
          className="
          rounded-lg
          bg-slate-50
          p-4
        "
        >
          <p
            className="
            text-xs
            text-slate-500
          "
          >
            Area
          </p>

          <p
            className="
            mt-1
            font-semibold
            text-slate-900
          "
          >
            {estate.area ?? "-"} {estate.area != null && "ha"}
          </p>
        </div>

        <div
          className="
          rounded-lg
          bg-slate-50
          p-4
        "
        >
          <p
            className="
            text-xs
            text-slate-500
          "
          >
            Estate ID
          </p>

          <p
            className="
            mt-1
            truncate
            text-sm
            font-medium
            text-slate-700
          "
          >
            {estate._id}
          </p>
        </div>
      </div>

      {/* View Estate Button */}

      <button
        type="button"
        onClick={handleViewEstate}
        className="
          mt-6
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-green-700
          px-4
          py-3
          font-semibold
          text-white
          transition
          hover:bg-green-800
          focus:outline-none
          focus:ring-2
          focus:ring-green-500
          focus:ring-offset-2
        "
      >
        View Estate
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default EstateCard;
