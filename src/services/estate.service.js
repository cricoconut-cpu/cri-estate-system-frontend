import api from "../api/axios";

export const getEstates = async () => {
  const response = await api.get("/estates");

  return response.data;
};

export const getEstateById = async (estateId) => {
  const response = await api.get(`/estates/${estateId}`);

  return response.data;
};
