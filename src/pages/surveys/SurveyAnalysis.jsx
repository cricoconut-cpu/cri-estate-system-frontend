import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getSurveyById } from "../../services/survey.service";

const SurveyAnalysis = () => {
  const { surveyId } = useParams();

  const [survey, setSurvey] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSurvey = async () => {
      try {
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

  if (loading) {
    return <div className="p-6">Loading survey analysis...</div>;
  }

  if (error) {
    return (
      <div
        className="
        p-6
        text-red-600
      "
      >
        {error}
      </div>
    );
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
        Survey Analysis
      </h1>

      <p
        className="
        mt-2
        text-slate-500
      "
      >
        {survey.estate?.name}
      </p>

      <div
        className="
        mt-8
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-3
      "
      >
        <StatCard title="Total Trees" value={survey.statistics?.totalTrees} />

        <StatCard title="Healthy" value={survey.statistics?.healthy} />

        <StatCard title="Moderate" value={survey.statistics?.moderate} />

        <StatCard title="Mild Stress" value={survey.statistics?.mildStress} />

        <StatCard
          title="Severe Stress"
          value={survey.statistics?.severeStress}
        />

        <StatCard title="Critical" value={survey.statistics?.critical} />
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
      p-6
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
        mt-3
        text-3xl
        font-bold
        text-slate-900
      "
      >
        {value ?? 0}
      </p>
    </div>
  );
};

export default SurveyAnalysis;
