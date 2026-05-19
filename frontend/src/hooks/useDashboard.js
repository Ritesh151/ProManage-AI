import { useState, useEffect, useCallback } from 'react';
import { dashboardAPI } from '../services/api';

export function useDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardAPI.get();
      setStats(res.data.data || []);
    } catch (err) {
      setError(err);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
