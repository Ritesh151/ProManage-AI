import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiMoon, FiZap, FiBell, FiCheck, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { SettingSection } from '../components/SettingSection';
import { useSettings } from '../hooks/useSettings';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

const MODELS_BY_PROVIDER = {
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-pro', 'gemini-ultra', 'gemini-flash'],
  ollama: ['llama3', 'mistral', 'codellama'],
};

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'hi', label: 'Hindi' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'EST (UTC-5)' },
  { value: 'America/Los_Angeles', label: 'PST (UTC-8)' },
  { value: 'Europe/London', label: 'GMT (UTC+0)' },
  { value: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
];

const Settings = () => {
  const { settings, saving, updateSettings, updateSection, resetSettings } = useSettings();

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setApiKeyInput(settings?.api?.apiKey || '');
  }, [settings?.api?.apiKey]);

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const handleSave = () => {
    updateSettings({
      ...settings,
      api: { ...settings.api, apiKey: apiKeyInput },
    });
    setSaveMessage('Settings saved successfully');
  };

  const handleReset = () => {
    resetSettings();
    setSaveMessage('Settings reset to defaults');
  };

  const handleThemeChange = (mode) => {
    updateSection('theme', { mode });
    setSaveMessage('Theme updated');
  };

  const handleColorChange = (color) => {
    updateSection('theme', { primaryColor: color });
    setSaveMessage('Color updated');
  };

  const handleAIProviderChange = (provider) => {
    const models = MODELS_BY_PROVIDER[provider];
    updateSection('ai', { provider, model: models[0] });
    setSaveMessage('AI provider updated');
  };

  const handleModelChange = (model) => {
    updateSection('ai', { model });
    setSaveMessage('Model updated');
  };

  const handleTemperatureChange = (temp) => {
    updateSection('ai', { temperature: parseFloat(temp) });
  };

  const handleNotificationChange = (key, value) => {
    updateSection('notifications', { [key]: value });
    setSaveMessage('Notification preference updated');
  };

  const handleLanguageChange = (language) => {
    updateSection('general', { language });
    setSaveMessage('Language updated');
  };

  const handleTimezoneChange = (timezone) => {
    updateSection('general', { timezone });
    setSaveMessage('Timezone updated');
  };

  const handleApiKeyChange = (value) => {
    setApiKeyInput(value);
  };

  const currentProvider = settings?.ai?.provider || 'openai';
  const availableModels = MODELS_BY_PROVIDER[currentProvider] || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your application preferences"
        icon={FiSettings}
      />

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-lg"
        >
          <FiCheck />
          <span className="text-sm font-medium">{saveMessage}</span>
        </motion.div>
      )}

      {/* General Settings */}
      <SettingSection
        title="General Settings"
        description="Basic application configuration"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
          <input
            type="text"
            value={settings?.general?.appName || ''}
            onChange={(e) => updateSection('general', { appName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings?.general?.language || 'en'}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings?.general?.timezone || 'UTC'}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </SettingSection>

      {/* Theme Settings */}
      <SettingSection
        title="Theme Settings"
        description="Customize the appearance"
        icon={FiMoon}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme Mode</label>
          <div className="flex gap-3">
            {['light', 'dark'].map((mode) => (
              <button
                key={mode}
                onClick={() => handleThemeChange(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  settings?.theme?.mode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  settings?.theme?.primaryColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </SettingSection>

      {/* AI Settings */}
      <SettingSection
        title="AI Settings"
        description="Configure AI model preferences"
        icon={FiZap}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">AI Provider</label>
          <div className="space-y-2">
            {['openai', 'gemini', 'ollama'].map((provider) => (
              <label key={provider} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value={provider}
                  checked={settings?.ai?.provider === provider}
                  onChange={() => handleAIProviderChange(provider)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <select
            value={settings?.ai?.model || availableModels[0]}
            onChange={(e) => handleModelChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature: {settings?.ai?.temperature || 0.7}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings?.ai?.temperature || 0.7}
            onChange={(e) => handleTemperatureChange(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
          <input
            type="number"
            value={settings?.ai?.maxTokens || 2000}
            onChange={(e) => updateSection('ai', { maxTokens: parseInt(e.target.value) })}
            min="100"
            max="8000"
            step="100"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </SettingSection>

      {/* Notification Settings */}
      <SettingSection
        title="Notifications"
        description="Manage notification preferences"
        icon={FiBell}
      >
        {[
          { key: 'emailNotifications', label: 'Email Notifications' },
          { key: 'pushNotifications', label: 'Push Notifications' },
          { key: 'trainingAlerts', label: 'Training Alerts' },
          { key: 'exportAlerts', label: 'Export Alerts' },
        ].map((notif) => (
          <label key={notif.key} className="flex items-center justify-between cursor-pointer py-2">
            <span className="text-sm font-medium text-gray-700">{notif.label}</span>
            <input
              type="checkbox"
              checked={settings?.notifications?.[notif.key] || false}
              onChange={(e) => handleNotificationChange(notif.key, e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-600"
            />
          </label>
        ))}
      </SettingSection>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3"
      >
        <button
          onClick={handleReset}
          disabled={saving}
          className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <FiSave size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
