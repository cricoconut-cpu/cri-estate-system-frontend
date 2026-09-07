import { ArrowRight, MapPin, UserRound } from "lucide-react";

import { useNavigate } from "react-router-dom";

const EstateCard = ({ estate }) => {
  const navigate = useNavigate();

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
      {/* Header */}

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

          {estate.district}
        </div>
      </div>

      {/* Details */}

      <div
        className="
        mt-6
        space-y-3
      "
      >
        <div
          className="
          flex
          justify-between
          rounded-lg
          bg-slate-50
          p-3
        "
        >
          <span
            className="
            text-sm
            text-slate-500
          "
          >
            Area
          </span>

          <span
            className="
            font-semibold
          "
          >
            {estate.area}
          </span>
        </div>

        <div
          className="
          flex
          justify-between
          rounded-lg
          bg-slate-50
          p-3
        "
        >
          <span
            className="
            text-sm
            text-slate-500
          "
          >
            Established
          </span>

          <span
            className="
            font-semibold
          "
          >
            {estate.established}
          </span>
        </div>

        <div
          className="
          flex
          items-center
          gap-2
          rounded-lg
          bg-slate-50
          p-3
        "
        >
          <UserRound size={16} />

          <span
            className="
            text-sm
          "
          >
            {estate.manager?.name}
          </span>
        </div>
      </div>

      {/* Button */}

      <button
        onClick={() => navigate(`/estates/${estate.id}`)}
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
          hover:bg-green-800
        "
      >
        View Estate
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default EstateCard;
