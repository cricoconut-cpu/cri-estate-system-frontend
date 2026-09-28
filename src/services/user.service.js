import api from "../api/axios";

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};