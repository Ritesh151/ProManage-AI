import { useState, useEffect, useCallback, useMemo } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const analyticsData = await analyticsService.getFullAnalytics();
      setData(analyticsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const changePeriod = useCallback((newPeriod) => {
    setPeriod(newPeriod);
  }, []);

  const overview = useMemo(() => data?.overview || null, [data]);
  const revenue = useMemo(() => data?.revenue || null, [data]);
  const revenueData = useMemo(() => data?.revenue?.monthlyData || [], [data]);
  const activities = useMemo(() => data?.recentActivities || [], [data]);
  const categoryDistribution = useMemo(() => data?.categoryDistribution || [], [data]);
  const statusDistribution = useMemo(() => data?.statusDistribution || [], [data]);
  const monthlyGrowth = useMemo(() => data?.overview?.monthlyGrowth || 0, [data]);

  return {
    data,
    overview,
    revenue,
    revenueData,
    activities,
    categoryDistribution,
    statusDistribution,
    monthlyGrowth,
    loading,
    error,
    period,
    changePeriod,
    refetch: fetchAnalytics,
  };
};
