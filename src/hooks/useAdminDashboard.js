import { useEffect, useState } from "react";

import { getAdminDashboard } from "../services/dashboard.service";

const useAdminDashboard = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminDashboard();

        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return {
    data,
    loading,
    error,
  };
};

export default useAdminDashboard;
