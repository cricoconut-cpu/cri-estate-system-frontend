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

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export const updateUser = async (userId, userData) => {
  const response = await api.patch(`/users/${userId}`, userData);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Activate / Deactivate User
|--------------------------------------------------------------------------
*/

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.patch(`/users/${userId}/status`, {
    isActive,
  });

  return response.data;
};
