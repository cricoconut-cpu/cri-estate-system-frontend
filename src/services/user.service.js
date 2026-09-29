import api from "../api/axios";

/*
|--------------------------------------------------------------------------
| Get Users
|--------------------------------------------------------------------------
*/

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);

  return response.data;
};
