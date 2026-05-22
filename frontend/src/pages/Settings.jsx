// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSettings, FiMoon, FiSun, FiZap, FiBell, FiCheck, FiEye, FiEyeOff, 
  FiSave, FiRefreshCw, FiGlobe, FiClock, FiCpu, FiSliders, FiLock,
  FiMail, FiMessageSquare, FiTrendingUp, FiDownload, FiDroplet
} from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { SettingSection } from '../components/SettingSection';
import { useSettings } from '../hooks/useSettings';

const COLORS = [
  { value: '#2563eb', label: 'Blue', class: 'from-blue-600 to-blue-500' },
  { value: '#8b5cf6', label: 'Purple', class: 'from-purple-600 to-purple-500' },
  { value: '#ec4899', label: 'Pink', class: 'from-pink-600 to-pink-500' },
  { value: '#f59e0b', label: 'Amber', class: 'from-amber-600 to-amber-500' },
  { value: '#10b981', label: 'Emerald', class: 'from-emerald-600 to-emerald-500' },
  { value: '#ef4444', label: 'Red', class: 'from-red-600 to-red-500' },
];

const MODELS_BY_PROVIDER = {
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-pro', 'gemini-ultra', 'gemini-flash'],
  ollama: ['llama3', 'mistral', 'codellama'],
};

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC', offset: 'UTC+0' },
  { value: 'America/New_York', label: 'Eastern Time', offset: 'UTC-5' },
  { value: 'America/Los_Angeles', label: 'Pacific Time', offset: 'UTC-8' },
  { value: 'Europe/London', label: 'London', offset: 'UTC+0' },
  { value: 'Asia/Kolkata', label: 'Mumbai', offset: 'UTC+5:30' },
  { value: 'Asia/Tokyo', label: 'Tokyo', offset: 'UTC+9' },
  { value: 'Australia/Sydney', label: 'Sydney', offset: 'UTC+11' },
];

const Settings = () => {
  const { settings, saving, updateSettings, updateSection, resetSettings } = useSettings();

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [activeSection, setActiveSection] = useState('general');

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
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
      setSaveMessage('Settings reset to defaults');
    }
  };

  const handleThemeChange = (mode) => {
    updateSection('theme', { mode });
    setSaveMessage(`Theme changed to ${mode} mode`);
  };

  const handleColorChange = (color) => {
    updateSection('theme', { primaryColor: color });
    setSaveMessage('Primary color updated');
  };

  const handleAIProviderChange = (provider) => {
    const models = MODELS_BY_PROVIDER[provider];
    updateSection('ai', { provider, model: models[0] });
    setSaveMessage(`AI provider changed to ${provider}`);
  };

  const handleModelChange = (model) => {
    updateSection('ai', { model });
    setSaveMessage(`Model changed to ${model}`);
  };

  const handleTemperatureChange = (temp) => {
    updateSection('ai', { temperature: parseFloat(temp) });
  };

  const handleMaxTokensChange = (tokens) => {
    updateSection('ai', { maxTokens: parseInt(tokens) });
  };

  const handleNotificationChange = (key, value) => {
    updateSection('notifications', { [key]: value });
    setSaveMessage(`${key.replace(/([A-Z])/g, ' $1').trim()} preference updated`);
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

  const sections = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'theme', label: 'Appearance', icon: FiDroplet },
    { id: 'ai', label: 'AI Settings', icon: FiCpu },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'api', label: 'API Keys', icon: FiLock },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-48 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <PageHeader
          title="Settings"
          description="Manage your application preferences and configurations"
          icon={FiSettings}
        />

        {/* Success Message */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="flex items-center gap-3 px-5 py-3 mb-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300"
            >
              <FiCheck size={18} />
              <span className="text-sm font-medium">{saveMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-8 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/10 to-pink-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{section.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingTab"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-pink-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <SettingSection
                title="General Settings"
                description="Basic application configuration"
                icon={FiSettings}
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Application Name
                    </label>
                    <input
                      type="text"
                      value={settings?.general?.appName || 'ProposalForge AI'}
                      onChange={(e) => updateSection('general', { appName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <FiGlobe size={14} />
                        Language
                      </div>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => handleLanguageChange(lang.value)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all ${
                            settings?.general?.language === lang.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-sm font-medium">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <FiClock size={14} />
                        Timezone
                      </div>
                    </label>
                    <select
                      value={settings?.general?.timezone || 'UTC'}
                      onChange={(e) => handleTimezoneChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label} ({tz.offset})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </SettingSection>
            )}

            {/* Theme Settings */}
            {activeSection === 'theme' && (
              <SettingSection
                title="Appearance"
                description="Customize the look and feel"
                icon={FiDroplet}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Theme Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { mode: 'light', icon: FiSun, label: 'Light' },
                        { mode: 'dark', icon: FiMoon, label: 'Dark' },
                      ].map(({ mode, icon: Icon, label }) => (
                        <button
                          key={mode}
                          onClick={() => handleThemeChange(mode)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                            settings?.theme?.mode === mode
                              ? 'border-blue-500 bg-gradient-to-r from-blue-600/10 to-pink-500/10 text-blue-700 dark:text-blue-400'
                              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon size={18} />
                          <span className="font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Primary Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => handleColorChange(color.value)}
                          className={`relative w-12 h-12 rounded-xl transition-all duration-200 ${
                            settings?.theme?.primaryColor === color.value
                              ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {settings?.theme?.primaryColor === color.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <FiCheck size={16} className="text-white" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}

            {/* AI Settings */}
            {activeSection === 'ai' && (
              <SettingSection
                title="AI Configuration"
                description="Configure AI model preferences"
                icon={FiCpu}
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      AI Provider
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['openai', 'gemini', 'ollama'].map((provider) => (
                        <button
                          key={provider}
                          onClick={() => handleAIProviderChange(provider)}
                          className={`px-4 py-2.5 rounded-xl border-2 transition-all capitalize ${
                            settings?.ai?.provider === provider
                              ? 'border-blue-500 bg-gradient-to-r from-blue-600/10 to-pink-500/10 text-blue-700 dark:text-blue-400'
                              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                          }`}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Model
                    </label>
                    <select
                      value={settings?.ai?.model || availableModels[0]}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Temperature
                      </label>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {settings?.ai?.temperature || 0.7}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings?.ai?.temperature || 0.7}
                      onChange={(e) => handleTemperatureChange(e.target.value)}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-slate-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="8000"
                      step="100"
                      value={settings?.ai?.maxTokens || 2000}
                      onChange={(e) => handleMaxTokensChange(e.target.value)}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-slate-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>100</span>
                      <span>{settings?.ai?.maxTokens || 2000}</span>
                      <span>8000</span>
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <SettingSection
                title="Notifications"
                description="Manage notification preferences"
                icon={FiBell}
              >
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', icon: FiMail, description: 'Receive updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', icon: FiMessageSquare, description: 'Get real-time browser notifications' },
                    { key: 'trainingAlerts', label: 'Training Alerts', icon: FiTrendingUp, description: 'Get notified when AI training completes' },
                    { key: 'exportAlerts', label: 'Export Alerts', icon: FiDownload, description: 'Get notified when exports are ready' },
                  ].map((notif) => {
                    const Icon = notif.icon;
                    const isChecked = settings?.notifications?.[notif.key] || false;
                    return (
                      <label key={notif.key} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-blue-200 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                            <Icon size={16} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{notif.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notif.description}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleNotificationChange(notif.key, e.target.checked)}
                            className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </SettingSection>
            )}

            {/* API Settings */}
            {activeSection === 'api' && (
              <SettingSection
                title="API Configuration"
                description="Manage API keys and credentials"
                icon={FiLock}
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKeyInput}
                        onChange={(e) => handleApiKeyChange(e.target.value)}
                        placeholder="sk-..."
                        className="w-full px-4 py-2.5 pr-20 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                      >
                        {showApiKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Your API key is stored securely and encrypted
                    </p>
                  </div>
                </div>
              </SettingSection>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                Reset to Defaults
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-medium hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
