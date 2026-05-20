import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [period, setPeriod] = useState('monthly');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        period,
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      };

      const [overviewData, revenueData, activitiesData, metricsData] = await Promise.all([
        analyticsService.getOverview(params).catch(() => analyticsService.getMockOverview()),
        analyticsService.getRevenue(params).catch(() => analyticsService.getMockRevenue()),
        analyticsService.getActivities(params).catch(() => analyticsService.getMockActivities()),
        analyticsService.getMetrics(params).catch(() => ({})),
      ]);

      setOverview(overviewData);
      setRevenue(revenueData);
      setActivities(activitiesData);
      setMetrics(metricsData);
    } catch (err) {
      setError(err.message);
      setOverview(analyticsService.getMockOverview());
      setRevenue(analyticsService.getMockRevenue());
      setActivities(analyticsService.getMockActivities());
    } finally {
      setLoading(false);
    }
  }, [period, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const updateDateRange = useCallback((start, end) => {
    setDateRange({ start, end });
  }, []);

  const changePeriod = useCallback((newPeriod) => {
    setPeriod(newPeriod);
  }, []);

  return {
    overview,
    revenue,
    activities,
    metrics,
    loading,
    error,
    dateRange,
    period,
    updateDateRange,
    changePeriod,
    refetch: fetchAnalytics,
  };
};
