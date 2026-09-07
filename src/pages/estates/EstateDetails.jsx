import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getEstateById } from "../../services/estate.service";

const EstateDetails = () => {
  const { estateId } = useParams();

  const navigate = useNavigate();

  const [estate, setEstate] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEstate = async () => {
      try {
        const response = await getEstateById(estateId);

        setEstate(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadEstate();
  }, [estateId]);

  if (loading) {
    return <div className="p-6">Loading estate...</div>;
  }

  if (!estate) {
    return <div className="p-6">Estate not found</div>;
  }

  return (
    <div>
      <h1
        className="
        text-3xl
        font-bold
        text-slate-900
      "
      >
        {estate.name}
      </h1>

      <p
        className="
        mt-2
        text-slate-500
      "
      >
        Estate Details
      </p>

      <div
        className="
        mt-8
        grid
        gap-6
        md:grid-cols-3
      "
      >
        <div
          className="
          rounded-xl
          bg-white
          border
          p-6
        "
        >
          <p
            className="
            text-sm
            text-slate-500
          "
          >
            District
          </p>

          <p
            className="
            mt-2
            font-semibold
          "
          >
            {estate.district}
          </p>
        </div>

        <div
          className="
          rounded-xl
          bg-white
          border
          p-6
        "
        >
          <p
            className="
            text-sm
            text-slate-500
          "
          >
            Area
          </p>

          <p
            className="
            mt-2
            font-semibold
          "
          >
            {estate.area}
          </p>
        </div>

        <div
          className="
          rounded-xl
          bg-white
          border
          p-6
        "
        >
          <p
            className="
            text-sm
            text-slate-500
          "
          >
            Manager
          </p>

          <p
            className="
            mt-2
            font-semibold
          "
          >
            {estate.manager?.name}
          </p>
        </div>
      </div>

      <div
        className="
        mt-10
      "
      >
        <h2
          className="
          text-xl
          font-bold
        "
        >
          Available Surveys
        </h2>

        <div
          className="
          mt-4
          rounded-xl
          border
          bg-white
          p-6
        "
        >
          <p
            className="
            text-slate-500
          "
          >
            Survey years will load here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EstateDetails;
