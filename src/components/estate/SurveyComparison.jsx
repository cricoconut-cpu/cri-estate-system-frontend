import { useEffect, useMemo, useState } from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const HEALTH_CONFIG = [
  {
    key: "healthy",
    label: "Healthy",
  },
  {
    key: "moderate",
    label: "Moderate",
  },
  {
    key: "mildStress",
    label: "Mild Stress",
  },
  {
    key: "severeStress",
    label: "Severe Stress",
  },
  {
    key: "critical",
    label: "Critical",
  },
];

const SurveyComparison = ({ surveys = [] }) => {
  /*
   * ------------------------------------------------------------
   * Prepare valid surveys
   * ------------------------------------------------------------
   */

  const comparisonSurveys = useMemo(() => {
    return [...surveys]
      .filter(
        (survey) => survey?.statistics && Number.isFinite(Number(survey.year)),
      )
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [surveys]);

  /*
   * ------------------------------------------------------------
   * Selected years
   * ------------------------------------------------------------
   */

  const [yearA, setYearA] = useState("");
  const [yearB, setYearB] = useState("");

  /*
   * ------------------------------------------------------------
   * Automatically select the two latest years
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (comparisonSurveys.length < 2) {
      setYearA("");
      setYearB("");
      return;
    }

    const previousSurvey = comparisonSurveys[comparisonSurveys.length - 2];

    const latestSurvey = comparisonSurveys[comparisonSurveys.length - 1];

    setYearA(String(previousSurvey.year));
    setYearB(String(latestSurvey.year));
  }, [comparisonSurveys]);

  /*
   * ------------------------------------------------------------
   * Selected survey objects
   * ------------------------------------------------------------
   */

  const surveyA = comparisonSurveys.find(
    (survey) => String(survey.year) === yearA,
  );

  const surveyB = comparisonSurveys.find(
    (survey) => String(survey.year) === yearB,
  );

  const statisticsA = surveyA?.statistics || {};

  const statisticsB = surveyB?.statistics || {};

  /*
   * ------------------------------------------------------------
   * Comparison table
   * ------------------------------------------------------------
   */

  const comparisonRows = useMemo(() => {
    if (!surveyA || !surveyB) {
      return [];
    }

    const metrics = [
      {
        key: "totalTrees",
        label: "Total Trees",
      },
      ...HEALTH_CONFIG,
    ];

    return metrics.map((metric) => {
      const valueA = Number(statisticsA[metric.key] || 0);

      const valueB = Number(statisticsB[metric.key] || 0);

      const change = valueB - valueA;

      const percentageChange = valueA !== 0 ? (change / valueA) * 100 : null;

      return {
        ...metric,
        valueA,
        valueB,
        change,
        percentageChange,
      };
    });
  }, [surveyA, surveyB, statisticsA, statisticsB]);

  /*
   * ------------------------------------------------------------
   * Chart data
   * ------------------------------------------------------------
   */

  const chartData = useMemo(() => {
    if (!surveyA || !surveyB) {
      return [];
    }

    return HEALTH_CONFIG.map(({ key, label }) => ({
      condition: label,

      [String(yearA)]: Number(statisticsA[key] || 0),

      [String(yearB)]: Number(statisticsB[key] || 0),
    }));
  }, [surveyA, surveyB, statisticsA, statisticsB, yearA, yearB]);

  /*
   * ------------------------------------------------------------
   * Don't display anything until at least two surveys exist
   * ------------------------------------------------------------
   */

  if (comparisonSurveys.length < 2) {
    return null;
  }

  /*
   * ------------------------------------------------------------
   * Render
   * ------------------------------------------------------------
   */

  return (
    <section className="space-y-6">
      {/* ========================================================
          HEADER
      ========================================================= */}

      <div>
        <h2
          className="
            text-2xl
            font-bold
            text-slate-900
          "
        >
          Multi-Year Analysis
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Compare tree health statistics between different survey years.
        </p>
      </div>

      {/* ========================================================
          YEAR SELECTION
      ========================================================= */}

      <div
        className="
          grid
          gap-5
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm
          md:grid-cols-2
        "
      >
        {/* Earlier Survey */}

        <div>
          <label
            htmlFor="comparison-year-a"
            className="
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            Earlier Survey
          </label>

          <select
            id="comparison-year-a"
            value={yearA}
            onChange={(event) => setYearA(event.target.value)}
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
              text-slate-800
              outline-none
              focus:border-green-500
              focus:ring-2
              focus:ring-green-100
            "
          >
            {comparisonSurveys.map((survey) => (
              <option
                key={survey._id || survey.id || survey.year}
                value={survey.year}
              >
                {survey.year}
              </option>
            ))}
          </select>
        </div>

        {/* Later Survey */}

        <div>
          <label
            htmlFor="comparison-year-b"
            className="
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            Later Survey
          </label>

          <select
            id="comparison-year-b"
            value={yearB}
            onChange={(event) => setYearB(event.target.value)}
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
              text-slate-800
              outline-none
              focus:border-green-500
              focus:ring-2
              focus:ring-green-100
            "
          >
            {comparisonSurveys.map((survey) => (
              <option
                key={survey._id || survey.id || survey.year}
                value={survey.year}
              >
                {survey.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================
          SELECTED SURVEY SUMMARIES
      ========================================================= */}

      {surveyA && surveyB && (
        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <SurveySummary survey={surveyA} />

          <SurveySummary survey={surveyB} />
        </div>
      )}

      {/* ========================================================
          COMPARISON TABLE
      ========================================================= */}

      {surveyA && surveyB && (
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              border-b
              px-6
              py-5
            "
          >
            <h3
              className="
                text-xl
                font-semibold
                text-slate-900
              "
            >
              Survey Comparison
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Changes between {yearA} and {yearB}.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table
              className="
                min-w-full
                text-sm
              "
            >
              <thead
                className="
                  bg-slate-50
                "
              >
                <tr>
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-slate-600
                    "
                  >
                    Indicator
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      font-semibold
                      text-slate-600
                    "
                  >
                    {yearA}
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      font-semibold
                      text-slate-600
                    "
                  >
                    {yearB}
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      font-semibold
                      text-slate-600
                    "
                  >
                    Change
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      font-semibold
                      text-slate-600
                    "
                  >
                    % Change
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.key}
                    className="
                        border-t
                        border-slate-100
                      "
                  >
                    <td
                      className="
                          px-6
                          py-4
                          font-medium
                          text-slate-800
                        "
                    >
                      {row.label}
                    </td>

                    <td
                      className="
                          px-6
                          py-4
                          text-right
                          text-slate-700
                        "
                    >
                      {row.valueA.toLocaleString()}
                    </td>

                    <td
                      className="
                          px-6
                          py-4
                          text-right
                          font-semibold
                          text-slate-900
                        "
                    >
                      {row.valueB.toLocaleString()}
                    </td>

                    <td
                      className={`
                          px-6
                          py-4
                          text-right
                          font-semibold

                          ${
                            row.change > 0
                              ? "text-green-700"
                              : row.change < 0
                                ? "text-red-700"
                                : "text-slate-500"
                          }
                        `}
                    >
                      {row.change > 0 ? "+" : ""}

                      {row.change.toLocaleString()}
                    </td>

                    <td
                      className={`
                          px-6
                          py-4
                          text-right

                          ${
                            row.percentageChange === null
                              ? "text-slate-400"
                              : row.percentageChange > 0
                                ? "text-green-700"
                                : row.percentageChange < 0
                                  ? "text-red-700"
                                  : "text-slate-500"
                          }
                        `}
                    >
                      {row.percentageChange === null
                        ? "N/A"
                        : `${
                            row.percentageChange > 0 ? "+" : ""
                          }${row.percentageChange.toFixed(1)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          HEALTH COMPARISON CHART
      ========================================================= */}

      {surveyA && surveyB && (
        <div
          className="
            rounded-xl
            border
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="mb-5">
            <h3
              className="
                text-xl
                font-semibold
                text-slate-900
              "
            >
              Tree Health Comparison
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Number of trees in each health condition for the selected years.
            </p>
          </div>

          <div
            className="
              h-[420px]
              w-full
            "
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="condition" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar dataKey={String(yearA)} name={String(yearA)} />

                <Bar dataKey={String(yearB)} name={String(yearB)} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};

/*
|--------------------------------------------------------------------------
| Survey Summary
|--------------------------------------------------------------------------
*/

const SurveySummary = ({ survey }) => {
  const statistics = survey?.statistics || {};

  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Survey Year
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-900
            "
          >
            {survey.year}
          </p>
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

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
        "
      >
        <SummaryValue label="Total" value={statistics.totalTrees} />

        <SummaryValue label="Healthy" value={statistics.healthy} />

        <SummaryValue label="Moderate" value={statistics.moderate} />

        <SummaryValue label="Mild Stress" value={statistics.mildStress} />

        <SummaryValue label="Severe Stress" value={statistics.severeStress} />

        <SummaryValue label="Critical" value={statistics.critical} />
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Summary Value
|--------------------------------------------------------------------------
*/

const SummaryValue = ({ label, value }) => {
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
          text-lg
          font-semibold
          text-slate-800
        "
      >
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
};

export default SurveyComparison;
