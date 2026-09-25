import api from "../api/axios";

/*
|--------------------------------------------------------------------------
| Survey Summary
|--------------------------------------------------------------------------
*/

export const getSurveySummary = async () => {
  const response = await api.get("/surveys/summary");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Estate Surveys
|--------------------------------------------------------------------------
*/

export const getEstateSurveys = async (estateId) => {
  const response = await api.get(`/surveys/estate/${estateId}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Survey Map
|--------------------------------------------------------------------------
*/

export const getSurveyMap = async (surveyId) => {
  const response = await api.get(`/surveys/${surveyId}/map`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Survey GeoJSON
|--------------------------------------------------------------------------
*/

export const getSurveyGeoJson = async (surveyId) => {
  const response = await api.get(`/surveys/${surveyId}/geojson`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Survey By ID
|--------------------------------------------------------------------------
*/

export const getSurveyById = async (surveyId) => {
  const response = await api.get(`/surveys/${surveyId}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create / Replace Survey
|--------------------------------------------------------------------------
*/

export const createSurvey = async (formData) => {
  const response = await api.post("/surveys", formData);

  return response.data;
};
