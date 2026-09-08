import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getEstateById } from "../../services/estate.service";

import { getEstateSurveys } from "../../services/survey.service";

const EstateDetails = () => {
  const { estateId } = useParams();

  const navigate = useNavigate();

  const [estate, setEstate] = useState(null);

  const [surveys, setSurveys] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        setError("");

        const [estateResponse, surveyResponse] = await Promise.all([
          getEstateById(estateId),

          getEstateSurveys(estateId),
        ]);

        setEstate(estateResponse.data);

        setSurveys(surveyResponse.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load estate details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [estateId]);

  if (loading) {
    return <div className="p-6">Loading estate details...</div>;
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

  if (!estate) {
    return <div className="p-6">Estate not found.</div>;
  }

  return (
    <div>
      {/* Header */}

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
      </div>

      {/* Estate Information Cards */}

      <div
        className="
        mt-8
        grid
        gap-6
        md:grid-cols-3
        "
      >
        <InfoCard title="District" value={estate.district} />

        <InfoCard title="Area" value={estate.area} />

        <InfoCard title="Manager" value={estate.manager?.name || "-"} />
      </div>

      {/* Surveys */}

      <div
        className="
        mt-10
        "
      >
        <h2
          className="
          text-xl
          font-bold
          text-slate-900
          "
        >
          Available Surveys
        </h2>

        {surveys.length === 0 ? (
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
              No surveys available for this estate.
            </p>
          </div>
        ) : (
          <div
            className="
              mt-4
              grid
              gap-6
              md:grid-cols-2
              "
          >
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="
                      rounded-xl
                      border
                      bg-white
                      p-6
                      shadow-sm
                      "
              >
                <h3
                  className="
                        text-lg
                        font-semibold
                        "
                >
                  Survey Year: {survey.year}
                </h3>

                <p
                  className="
                        mt-3
                        text-sm
                        text-slate-500
                        "
                >
                  Survey Date:{" "}
                  {new Date(survey.surveyDate).toLocaleDateString()}
                </p>

                <p
                  className="
                        mt-2
                        text-sm
                        text-slate-500
                        "
                >
                  Total Trees:{" "}
                  <span
                    className="
                          font-semibold
                          text-slate-900
                          "
                  >
                    {survey.statistics?.totalTrees || 0}
                  </span>
                </p>

                <p
                  className="
                        mt-2
                        text-sm
                        text-slate-500
                        "
                >
                  Status:{" "}
                  <span
                    className="
                          font-semibold
                          text-green-700
                          "
                  >
                    {survey.status}
                  </span>
                </p>

                <button
                  onClick={() => navigate(`/surveys/${survey._id}`)}
                  className="
                        mt-5
                        rounded-lg
                        bg-green-700
                        px-4
                        py-2
                        text-white
                        hover:bg-green-800
                        "
                >
                  Open Analysis
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ title, value }) => {
  return (
    <div
      className="
      rounded-xl
      border
      bg-white
      p-6
      "
    >
      <p
        className="
        text-sm
        text-slate-500
        "
      >
        {title}
      </p>

      <p
        className="
        mt-2
        font-semibold
        text-slate-900
        "
      >
        {value || "-"}
      </p>
    </div>
  );
};

export default EstateDetails;
