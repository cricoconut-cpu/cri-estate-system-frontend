import api from "../api/axios";

export const getSurveySummary = async () => {
  const response = await api.get("/surveys/summary");

  return response.data;
};

export const getEstateSurveys = async (estateId) => {
  const response = await api.get(`/surveys/estate/${estateId}`);

  return response.data;
};

export const getSurveyMap = async (surveyId) => {
  const response = await api.get(`/surveys/${surveyId}/map`);

  return response.data;
};

export const getSurveyGeoJson = async (surveyId) => {
  const response = await api.get(`/surveys/${surveyId}/geojson`);

  return response.data;
};

export const getSurveyById = async (surveyId) => {
  const response = await api.get(`/surveys/${surveyId}`);

  return response.data;
};

export const createSurvey = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/surveys", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to upload survey.");
  }

  return data;
};
