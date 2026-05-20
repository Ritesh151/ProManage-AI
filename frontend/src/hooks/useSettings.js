import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';

export const useSettings = () => {
  const [settings, setSettings] = useState(settingsService.getDefaultSettings());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setSettings(settingsService.getLocalSettings());
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await settingsService.updateSettings(newSettings);
      setSettings(updated);
    } catch (err) {
      setError(err.message);
      setSettings(newSettings);
    } finally {
      setSaving(false);
    }
  }, []);

  const updateSection = useCallback((section, data) => {
    const updated = {
      ...settings,
      [section]: { ...settings[section], ...data },
    };
    updateSettings(updated);
  }, [settings, updateSettings]);

  const resetSettings = useCallback(() => {
    const defaults = settingsService.getDefaultSettings();
    updateSettings(defaults);
  }, [updateSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    saving,
    error,
    updateSettings,
    updateSection,
    resetSettings,
    refetch: fetchSettings,
  };
};
