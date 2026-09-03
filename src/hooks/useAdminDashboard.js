import { useEffect, useState } from "react";

import { getEstates } from "../services/estate.service";

import { getUsers } from "../services/user.service";

import { getSurveySummary } from "../services/survey.service";

const useAdminDashboard = () => {
  const [data, setData] = useState({
    estates: 0,
    users: 0,
    surveys: 0,
    statistics: {},
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [estates, users, surveySummary] = await Promise.all([
          getEstates(),

          getUsers(),

          getSurveySummary(),
        ]);

        setData({
          estates: estates.data.length,

          users: users.data.length,

          surveys: surveySummary.data.totalSurveys,

          statistics: surveySummary.data.statistics,
        });
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
