import { useEffect, useMemo, useState } from "react";

import { useParams } from "react-router-dom";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getSurveyById } from "../../services/survey.service";

const SurveyAnalysis = () => {
  const { surveyId } = useParams();

  const [survey, setSurvey] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getSurveyById(surveyId);

        setSurvey(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load survey.");
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [surveyId]);

  const statistics = survey?.statistics || {};

  const healthData = useMemo(() => {
    return [
      {
        name: "Healthy",
        value: statistics.healthy || 0,
      },

      {
        name: "Moderate",
        value: statistics.moderate || 0,
      },

      {
        name: "Mild Stress",
        value: statistics.mildStress || 0,
      },

      {
        name: "Severe Stress",
        value: statistics.severeStress || 0,
      },

      {
        name: "Critical",
        value: statistics.critical || 0,
      },
    ];
  }, [statistics]);

  const totalTrees = statistics.totalTrees || 0;

  const percentageData = healthData.map((item) => ({
    ...item,

    percentage:
      totalTrees > 0 ? ((item.value / totalTrees) * 100).toFixed(1) : "0.0",
  }));

  if (loading) {
    return <div className="p-6">Loading survey analysis...</div>;
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

  if (!survey) {
    return <div className="p-6">Survey not found.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}

      <div>
        <h1
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          Survey Analysis
        </h1>

        <p
          className="
            mt-2
            text-slate-500
          "
        >
          {survey.estate?.name || "Estate"}
          {" • "}
          Survey Year: {survey.year}
        </p>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          Survey Date:{" "}
          {survey.surveyDate
            ? new Date(survey.surveyDate).toLocaleDateString()
            : "-"}
        </p>
      </div>

      {/* Statistics */}

      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >
        <StatCard title="Total Trees" value={statistics.totalTrees} />

        <StatCard title="Healthy" value={statistics.healthy} />

        <StatCard title="Moderate" value={statistics.moderate} />

        <StatCard title="Mild Stress" value={statistics.mildStress} />

        <StatCard title="Severe Stress" value={statistics.severeStress} />

        <StatCard title="Critical" value={statistics.critical} />
      </div>

      {/* Charts */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >
        {/* Donut Chart */}

        <div
          className="
            rounded-xl
            border
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="mb-4">
            <h2
              className="
                text-xl
                font-semibold
                text-slate-900
              "
            >
              Tree Health Distribution
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Distribution of trees by health condition
            </p>
          </div>

          <div
            className="
              h-[350px]
              w-full
            "
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={125}
                  paddingAngle={2}
                  label
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}

        <div
          className="
            rounded-xl
            border
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="mb-4">
            <h2
              className="
                text-xl
                font-semibold
                text-slate-900
              "
            >
              Tree Health Comparison
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Number of trees in each condition
            </p>
          </div>

          <div
            className="
              h-[350px]
              w-full
            "
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={healthData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" name="Trees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Percentage Breakdown */}

      <div
        className="
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <h2
          className="
            text-xl
            font-semibold
            text-slate-900
          "
        >
          Health Condition Breakdown
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Percentage of total surveyed trees
        </p>

        <div
          className="
            mt-6
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-5
          "
        >
          {percentageData.map((item) => (
            <div
              key={item.name}
              className="
                rounded-lg
                bg-slate-50
                p-4
              "
            >
              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                {item.name}
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                {item.percentage}%
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                {item.value.toLocaleString()} trees
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
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
          text-2xl
          font-bold
          text-slate-900
        "
      >
        {(value || 0).toLocaleString()}
      </p>
    </div>
  );
};

export default SurveyAnalysis;
