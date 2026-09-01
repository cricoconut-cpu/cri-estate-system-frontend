import api from "../api/axios";

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
