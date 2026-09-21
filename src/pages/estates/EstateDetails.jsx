import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SurveyComparison from "../../components/estate/SurveyComparison.jsx";

import { getEstateById } from "../../services/estate.service";
import { getEstateSurveys } from "../../services/survey.service";

const EstateDetails = () => {
  const { estateId } = useParams();
  const navigate = useNavigate();

  const [estate, setEstate] = useState(null);
  const [surveys, setSurveys] = useState([]);

  const [loading, setLoading] = useState(true);
  const [surveyLoading, setSurveyLoading] = useState(true);

  const [error, setError] = useState("");
  const [surveyError, setSurveyError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Estate + Surveys
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setSurveyLoading(true);

      setError("");
      setSurveyError("");

      try {
        const estateResponse = await getEstateById(estateId);

        setEstate(estateResponse?.data || null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load estate."
        );
      } finally {
        setLoading(false);
      }

      try {
        const surveyResponse =
          await getEstateSurveys(estateId);

        const surveyData =
          surveyResponse?.data || [];

        const sortedSurveys = [...surveyData].sort(
          (a, b) =>
            Number(b.year) - Number(a.year)
        );

        setSurveys(sortedSurveys);
      } catch (err) {
        setSurveys([]);

        if (err.response?.status === 404) {
          setSurveyError(
            "No surveys have been recorded for this estate yet."
          );
        } else {
          setSurveyError(
            err.response?.data?.message ||
              "Failed to load estate surveys."
          );
        }
      } finally {
        setSurveyLoading(false);
      }
    };

    if (estateId) {
      loadData();
    }
  }, [estateId]);

  /*
  |--------------------------------------------------------------------------
  | Surveys available for comparison
  |--------------------------------------------------------------------------
  */

  const comparisonSurveys = useMemo(() => {
    return surveys.filter(
      (survey) =>
        survey?.statistics &&
        Number.isFinite(Number(survey.year))
    );
  }, [surveys]);

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-72 rounded bg-slate-200" />

          <div className="mt-3 h-4 w-48 rounded bg-slate-200" />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 rounded-xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Estate Error
  |--------------------------------------------------------------------------
  */

  if (error || !estate) {
    return (
      <div className="p-6">
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-5
            text-red-600
          "
        >
          {error || "Estate not found."}
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-8">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div>
        <button
          type="button"
          onClick={() => navigate("/estates")}
          className="
            mb-4
            text-sm
            font-medium
            text-green-700
            hover:text-green-800
          "
        >
          ← Back to Estates
        </button>

        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
            text-slate-900
          "
        >
          {estate.name}
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          Estate Details
        </p>
      </div>


      {/* =========================================================
          ESTATE INFORMATION
      ========================================================== */}

      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        <InfoCard
          title="Estate ID"
          value={
            estate.estateCode ||
            estate.id ||
            estate._id ||
            "-"
          }
        />

        <InfoCard
          title="District"
          value={estate.district || "-"}
        />

        <InfoCard
          title="Area"
          value={estate.area || "-"}
        />

        <InfoCard
          title="Manager"
          value={
            estate.manager?.name ||
            estate.manager ||
            "-"
          }
        />
      </div>


      {/* =========================================================
          SURVEY HISTORY
      ========================================================== */}

      <section>

        <div
          className="
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              Survey History
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Available surveys recorded for this estate
            </p>
          </div>

          <div
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {surveys.length}{" "}
            {surveys.length === 1
              ? "survey"
              : "surveys"}
          </div>
        </div>


        {/* Survey Loading */}

        {surveyLoading && (
          <div
            className="
              mt-5
              rounded-xl
              border
              bg-white
              p-6
            "
          >
            <p className="text-sm text-slate-500">
              Loading surveys...
            </p>
          </div>
        )}


        {/* Survey Error */}

        {!surveyLoading && surveyError && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              p-5
              text-sm
              text-amber-700
            "
          >
            {surveyError}
          </div>
        )}


        {/* No Surveys */}

        {!surveyLoading &&
          !surveyError &&
          surveys.length === 0 && (
            <div
              className="
                mt-5
                rounded-xl
                border
                bg-white
                p-8
                text-center
              "
            >
              <p
                className="
                  font-medium
                  text-slate-700
                "
              >
                No surveys available
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Survey records will appear here once
                they are uploaded.
              </p>
            </div>
          )}


        {/* Survey Cards */}

        {!surveyLoading &&
          surveys.length > 0 && (
            <div
              className="
                mt-5
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {surveys.map((survey) => (
                <SurveyCard
                  key={
                    survey._id ||
                    survey.id ||
                    `${estateId}-${survey.year}`
                  }
                  survey={survey}
                  onOpen={() =>
                    navigate(
                      `/surveys/${
                        survey._id ||
                        survey.id
                      }`
                    )
                  }
                />
              ))}
            </div>
          )}

      </section>


      {/* =========================================================
          MULTI-YEAR COMPARISON
      ========================================================== */}

      {comparisonSurveys.length >= 2 && (
        <SurveyComparison
          surveys={comparisonSurveys}
        />
      )}

    </div>
  );
};


/*
|--------------------------------------------------------------------------
| Information Card
|--------------------------------------------------------------------------
*/

const InfoCard = ({ title, value }) => {
  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
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
          truncate
          text-lg
          font-semibold
          text-slate-900
        "
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
};


/*
|--------------------------------------------------------------------------
| Survey Card
|--------------------------------------------------------------------------
*/

const SurveyCard = ({ survey, onOpen }) => {
  const statistics = survey.statistics || {};

  const surveyDate = survey.surveyDate
    ? new Date(
        survey.surveyDate
      ).toLocaleDateString()
    : "-";

  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            Survey Year
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-900
            "
          >
            {survey.year}
          </h3>
        </div>

        <span
          className="
            rounded-full
            bg-green-50
            px-3
            py-1
            text-xs
            font-semibold
            capitalize
            text-green-700
          "
        >
          {survey.status || "completed"}
        </span>
      </div>


      {/* Survey Date */}

      <div className="mt-5">
        <p
          className="
            text-xs
            text-slate-400
          "
        >
          Survey Date
        </p>

        <p
          className="
            mt-1
            text-sm
            font-medium
            text-slate-700
          "
        >
          {surveyDate}
        </p>
      </div>


      {/* Total Trees */}

      <div
        className="
          mt-5
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
          Total Trees
        </p>

        <p
          className="
            mt-1
            text-2xl
            font-bold
            text-slate-900
          "
        >
          {Number(
            statistics.totalTrees || 0
          ).toLocaleString()}
        </p>
      </div>


      {/* Health Summary */}

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-3
          text-sm
        "
      >
        <MiniStat
          label="Healthy"
          value={statistics.healthy}
        />

        <MiniStat
          label="Moderate"
          value={statistics.moderate}
        />

        <MiniStat
          label="Mild Stress"
          value={statistics.mildStress}
        />

        <MiniStat
          label="Severe Stress"
          value={statistics.severeStress}
        />

        <MiniStat
          label="Critical"
          value={statistics.critical}
        />
      </div>


      {/* Open Analysis */}

      <button
        type="button"
        onClick={onOpen}
        className="
          mt-6
          w-full
          rounded-lg
          bg-green-700
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-green-800
        "
      >
        Open Analysis
      </button>

    </div>
  );
};


/*
|--------------------------------------------------------------------------
| Mini Statistic
|--------------------------------------------------------------------------
*/

const MiniStat = ({ label, value }) => {
  return (
    <div>
      <p
        className="
          text-xs
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          font-semibold
          text-slate-800
        "
      >
        {Number(
          value || 0
        ).toLocaleString()}
      </p>
    </div>
  );
};


export default EstateDetails;