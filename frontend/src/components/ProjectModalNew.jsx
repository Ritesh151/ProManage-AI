// src/components/ProjectModalNew.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiX, FiChevronDown, FiLoader, FiAlertCircle, FiUser, FiBriefcase, FiSettings, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useProjectForm } from '../hooks/useProjectForm';
import { scopeService } from '../services/scopeService';
import { formatCurrencyINR } from '../utils/currencyFormatter';

const BRANCHES = ['Kutch Infoline', 'Lakshmi Healthcare Services', 'OptiMatrix', 'OptiMatrix Cash', 'OptiMatrix Domestic', 'OptiMatrix Export'];
const BUSINESS_TYPES = ['Startup', 'Large Corporate', 'MSME', 'Retail / E-commerce', 'Manufacturing / Production'];
const TURNOVER_OPTIONS = ['<50K', '50K–10 Lakh', '10–50 Lakh', '50 Lakh+'];
const GOOGLE_RANKING_OPTIONS = ['Not Listed', 'Page 2+', 'Page 1'];
const FEATURES_OPTIONS = ['Whatsapp Integration', 'Payment Integration', 'Custom'];
const TIMELINE_UNITS = ['Days', 'Weeks', 'Months'];
const STATUSES = ['Active', 'Completed', 'On Hold', 'Cancelled'];

const TECHNOLOGIES_BY_CATEGORY = {
  'Mobile Application Development': {
    frontend: ['Flutter', 'React Native', 'Kotlin', 'Swift'],
    backend: ['Node JS', 'Laravel', 'Django', 'Spring Boot'],
    database: ['Firebase', 'MongoDB', 'PostgreSQL', 'SQLite'],
    other: []
  },
  'Website Development': {
    frontend: ['React JS', 'Next JS', 'Vue JS', 'HTML5', 'Tailwind CSS', 'Bootstrap'],
    backend: ['Node JS', 'Express JS', 'Laravel', 'PHP'],
    database: ['MongoDB', 'MySQL', 'PostgreSQL'],
    other: []
  },
  'Software Development': {
    frontend: ['React JS', 'Electron', 'Flutter Desktop'],
    backend: ['Node JS', '.NET', 'Java Spring'],
    database: ['MongoDB', 'MySQL', 'PostgreSQL'],
    other: []
  },
  'Core PHP/Laravel': {
    frontend: ['Blade', 'HTML5', 'Bootstrap'],
    backend: ['Laravel', 'PHP'],
    database: ['MySQL', 'MariaDB'],
    other: []
  },
  'SEO': {
    frontend: ['SEO Tools'],
    backend: [],
    database: [],
    other: []
  },
  'Digital Marketing': {
    frontend: ['Analytics Dashboard', 'Marketing Tools'],
    backend: [],
    database: [],
    other: []
  }
};

const FloatingInput = ({ label, name, type = 'text', value, onChange, required, readOnly, error, placeholder }) => (
  <div className="relative mb-4">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      placeholder={placeholder || ' '}
      className={`peer w-full px-4 pt-5 pb-2 rounded-xl border-2 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
        readOnly ? 'bg-gray-50 dark:bg-slate-800/30 text-gray-500' : ''
      } ${
        error 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
      }`}
    />
    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
      value || placeholder !== ' '
        ? 'text-xs top-1 text-blue-600 dark:text-blue-400'
        : 'text-sm top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600'
    }`}>
      {label}{required && ' *'}
    </label>
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
);

const FloatingSelect = ({ label, name, value, onChange, options, required, error }) => (
  <div className="relative mb-4">
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`peer w-full px-4 pt-5 pb-2 rounded-xl border-2 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer ${
        error 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
      }`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <label className="absolute left-4 text-xs top-1 text-blue-600 dark:text-blue-400 pointer-events-none">
      {label}{required && ' *'}
    </label>
    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
);

const FloatingTextarea = ({ label, name, value, onChange, rows = 3, error }) => (
  <div className="relative mb-4">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder=" "
      className={`peer w-full px-4 pt-5 pb-2 rounded-xl border-2 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
        error 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
      }`}
    />
    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
      value
        ? 'text-xs top-1 text-blue-600 dark:text-blue-400'
        : 'text-sm top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600'
    }`}>
      {label}
    </label>
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
);

const TechMultiSelect = ({ label, options, selectedValues, onChange, required, error, placeholder }) => {
  const selectOptions = options.map(opt => ({ value: opt, label: opt }));
  const selectedOptions = selectedValues.map(val => ({ value: val, label: val }));

  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    onChange(values);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}{required && ' *'}
      </label>
      <Select
        isMulti
        isSearchable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        menuPlacement="auto"
        menuPortalTarget={document.body}
        options={selectOptions}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder || `Select ${label.toLowerCase()}...`}
        className={`${error ? 'border-red-500' : ''}`}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base, state) => ({
            ...base,
            minHeight: 44,
            borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#e5e7eb',
            borderWidth: 2,
            borderRadius: 12,
            fontSize: 14,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
            '&:hover': {
              borderColor: error ? '#ef4444' : '#3b82f6',
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#eff6ff',
            borderRadius: 8,
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#1d4ed8',
            fontSize: 12,
            fontWeight: 500,
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#1d4ed8',
            ':hover': { backgroundColor: '#dbeafe', color: '#1e40af' },
          }),
        }}
      />
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};

const MultiSelectDropdown = ({ label, options, selectedValues, onChange, required, error, placeholder, priceMap }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}{required && ' *'}
      </label>
      <div className="relative">
        <div
          className="w-full min-h-[44px] px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 cursor-pointer flex flex-wrap items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 dark:text-gray-500 text-sm">{placeholder || 'Select options...'}</span>
          ) : (
            selectedValues.map(val => (
              <span key={val} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                {val}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(val);
                  }}
                  className="hover:text-blue-900 dark:hover:text-blue-300 ml-1"
                >
                  ×
                </button>
              </span>
            ))
          )}
          <FiChevronDown className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-50"
            >
              {options.map(option => (
                <label key={option} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={() => handleToggle(option)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </div>
                  {priceMap && priceMap[option] !== undefined && (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {formatCurrencyINR(priceMap[option])}
                    </span>
                  )}
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};

const AccordionSection = ({ title, icon: Icon, isOpen, onToggle, children, completed }) => (
  <div className="mb-4 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white/30 dark:bg-slate-800/30">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={18} className="text-blue-600 dark:text-blue-400" />}
        <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        {completed && (
          <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">✓</span>
        )}
      </div>
      <FiChevronDown className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 py-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ProjectModalNew = ({ isOpen, onClose, onSubmit, project }) => {
  const {
    formData,
    updateFormData,
    updateNestedField,
    errors,
    validateForm,
    calculatedCost,
    calculatedEndDate,
    calculateCost,
  } = useProjectForm(project);

  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesFull, setCategoriesFull] = useState([]);
  const [scopeItems, setScopeItems] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingScopes, setLoadingScopes] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [scopeError, setScopeError] = useState('');
  const [openSections, setOpenSections] = useState({
    clientInfo: true,
    projectDetails: false,
  });

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoryError('');
      try {
        const categories = await scopeService.getCategories();
        const cats = Array.isArray(categories) ? categories : [];
        setCategoriesFull(cats);
        setCategories(cats.map(cat => cat.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchScopeItems = async () => {
      if (!formData.category) {
        setScopeItems([]);
        setScopeError('');
        return;
      }
      setLoadingScopes(true);
      setScopeError('');
      try {
        const response = await scopeService.getScopeByCategory(formData.category);
        setScopeItems(response.data || []);
      } catch (error) {
        console.error('Error fetching scope items:', error);
        setScopeError('Failed to load scope items');
        setScopeItems([]);
      } finally {
        setLoadingScopes(false);
      }
    };
    fetchScopeItems();
  }, [formData.category]);

  const handleCategoryChange = (e) => {
    updateFormData('category', e.target.value);
    updateFormData('scopeOfWork', []);
    calculateCost([], []);
  };

  const handleScopeChange = (selected) => {
    updateFormData('scopeOfWork', selected);
    calculateCost(selected, scopeItems);
  };

  const handleFeatureChange = (selected) => {
    updateFormData('features', selected);
  };

  const handleSocialMediaToggle = (value) => {
    updateFormData('hasSocialMedia', value);
    if (!value) {
      updateNestedField('socialMediaProfiles', 'instagram', '');
      updateNestedField('socialMediaProfiles', 'facebook', '');
      updateNestedField('socialMediaProfiles', 'linkedin', '');
      updateNestedField('socialMediaProfiles', 'other', '');
    }
  };

  const handleSalesTeamToggle = (value) => {
    updateFormData('hasSalesTeam', value);
  };

  const handleTimelineChange = (field, value) => {
    updateNestedField('timeline', field, value);
  };

  const handleExtraToggle = (field, value) => {
    updateFormData(field, value);
  };

  const EXTRAS_COST_PER_ITEM = 1500;
  const PAGE_COST = 1500;

  const costBreakdown = useMemo(() => {
    const scopeCost = calculatedCost;

    const extrasTotal = [
      !formData.hasClientDomain,
      !formData.hasClientLogo,
      !formData.hasClientContent,
    ].filter(Boolean).length * EXTRAS_COST_PER_ITEM;

    const numPages = parseInt(formData.numberOfPages) || 0;
    const pagesCost = numPages * PAGE_COST;

    const timelineMonths = formData.timeline.unit === 'Months'
      ? parseInt(formData.timeline.value) || 0
      : formData.timeline.unit === 'Weeks'
      ? Math.ceil((parseInt(formData.timeline.value) || 0) / 4.33)
      : Math.ceil((parseInt(formData.timeline.value) || 0) / 30);

    let timelineExtraCost = 0;
    if (timelineMonths === 1) {
      timelineExtraCost = Math.round(scopeCost * 0.05);
    } else if (timelineMonths === 2) {
      timelineExtraCost = Math.round(scopeCost * 0.10);
    }

    const grandTotal = scopeCost + extrasTotal + pagesCost + timelineExtraCost;

    return {
      scopeCost,
      extrasTotal,
      pagesCost,
      timelineExtraCost,
      grandTotal,
      timelineMonths,
    };
  }, [calculatedCost, formData.hasClientDomain, formData.hasClientLogo, formData.hasClientContent, formData.numberOfPages, formData.timeline.value, formData.timeline.unit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    setSubmitting(true);
    try {
      const selectedCategory = categoriesFull.find(cat => cat.name === formData.category);
      const scopeDetails = scopeItems
        .filter(item => formData.scopeOfWork.includes(item.title || item.name))
        .map(item => ({
          scopeId: item._id || '',
          title: item.title || item.name,
          price: item.price || 0,
        }));

      const submitData = {
        ...formData,
        projectEndDate: calculatedEndDate,
        cost: costBreakdown.grandTotal,
        scopeCost: costBreakdown.scopeCost,
        extrasCost: costBreakdown.extrasTotal,
        pagesCost: costBreakdown.pagesCost,
        timelineExtraCost: costBreakdown.timelineExtraCost,
        timeline: `${formData.timeline.value} ${formData.timeline.unit}`,
        timelineValue: parseInt(formData.timeline.value),
        timelineUnit: formData.timeline.unit,
        projectCategory: selectedCategory
          ? { id: selectedCategory._id, name: selectedCategory.name }
          : { id: '', name: formData.category },
        scopeOfWorkDetails: scopeDetails,
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  if (!showModal && !isOpen) return null;

  const getTechOptions = () => {
    return TECHNOLOGIES_BY_CATEGORY[formData.category] || { frontend: [], backend: [], database: [], other: [] };
  };

  const techOptions = getTechOptions();

  return (
    <AnimatePresence>
      {(isOpen || showModal) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-pink-500" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                  <FiBriefcase size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {project ? 'Edit Project' : 'Create New Project'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project ? 'Update project details and specifications' : 'Enter project details and specifications'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={handleSubmit}>
                {/* CLIENT INFORMATION SECTION */}
                <AccordionSection
                  title="Client Information"
                  icon={FiUser}
                  isOpen={openSections.clientInfo}
                  onToggle={() => setOpenSections(prev => ({ ...prev, clientInfo: !prev.clientInfo }))}
                  completed={formData.clientName && formData.clientMobileNumber && formData.companyName}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Client Name"
                        name="clientName"
                        value={formData.clientName}
                        onChange={(e) => updateFormData('clientName', e.target.value)}
                        required
                        error={errors.clientName}
                      />
                      <FloatingInput
                        label="Client Mobile Number"
                        name="clientMobileNumber"
                        type="tel"
                        value={formData.clientMobileNumber}
                        onChange={(e) => updateFormData('clientMobileNumber', e.target.value)}
                        required
                        error={errors.clientMobileNumber}
                        placeholder="10-digit Indian mobile"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Client Email"
                        name="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => updateFormData('clientEmail', e.target.value)}
                        error={errors.clientEmail}
                      />
                      <FloatingInput
                        label="Inquiry Date"
                        name="inquiryDate"
                        type="date"
                        value={formData.inquiryDate}
                        onChange={(e) => updateFormData('inquiryDate', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) => updateFormData('companyName', e.target.value)}
                        required
                        error={errors.companyName}
                      />
                      <FloatingInput
                        label="Company Location"
                        name="companyLocation"
                        value={formData.companyLocation}
                        onChange={(e) => updateFormData('companyLocation', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingSelect
                        label="Business Type"
                        name="businessType"
                        value={formData.businessType}
                        onChange={(e) => updateFormData('businessType', e.target.value)}
                        options={BUSINESS_TYPES}
                        required
                        error={errors.businessType}
                      />
                      <FloatingInput
                        label="Years in Business"
                        name="yearsInBusiness"
                        type="number"
                        value={formData.yearsInBusiness}
                        onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
                        error={errors.yearsInBusiness}
                        placeholder="Years"
                      />
                    </div>

                    <FloatingTextarea
                      label="Your Services"
                      name="yourServices"
                      value={formData.yourServices}
                      onChange={(e) => updateFormData('yourServices', e.target.value)}
                      rows={3}
                    />

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Sales or Marketing Team?</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                            formData.hasSalesTeam === true
                              ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                          }`}
                          onClick={() => handleSalesTeamToggle(true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                            formData.hasSalesTeam === false
                              ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                          }`}
                          onClick={() => handleSalesTeamToggle(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Social Media Profiles?</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                            formData.hasSocialMedia
                              ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                          }`}
                          onClick={() => handleSocialMediaToggle(true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                            !formData.hasSocialMedia
                              ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                          }`}
                          onClick={() => handleSocialMediaToggle(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {formData.hasSocialMedia && (
                      <div className="space-y-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FloatingInput
                            label="Instagram URL"
                            name="instagram"
                            type="url"
                            value={formData.socialMediaProfiles.instagram}
                            onChange={(e) => updateNestedField('socialMediaProfiles', 'instagram', e.target.value)}
                            error={errors.instagramURL}
                          />
                          <FloatingInput
                            label="Facebook URL"
                            name="facebook"
                            type="url"
                            value={formData.socialMediaProfiles.facebook}
                            onChange={(e) => updateNestedField('socialMediaProfiles', 'facebook', e.target.value)}
                            error={errors.facebookURL}
                          />
                          <FloatingInput
                            label="LinkedIn URL"
                            name="linkedin"
                            type="url"
                            value={formData.socialMediaProfiles.linkedin}
                            onChange={(e) => updateNestedField('socialMediaProfiles', 'linkedin', e.target.value)}
                            error={errors.linkedinURL}
                          />
                          <FloatingInput
                            label="Other URL"
                            name="other"
                            type="url"
                            value={formData.socialMediaProfiles.other}
                            onChange={(e) => updateNestedField('socialMediaProfiles', 'other', e.target.value)}
                            error={errors.otherURL}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingSelect
                        label="Annual Turnover"
                        name="annualTurnover"
                        value={formData.annualTurnover}
                        onChange={(e) => updateFormData('annualTurnover', e.target.value)}
                        options={TURNOVER_OPTIONS}
                      />
                      <FloatingSelect
                        label="Current Google Ranking"
                        name="currentGoogleRanking"
                        value={formData.currentGoogleRanking}
                        onChange={(e) => updateFormData('currentGoogleRanking', e.target.value)}
                        options={GOOGLE_RANKING_OPTIONS}
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Business Profile?</span>
                        <div className="flex gap-2">
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${formData.hasGoogleBusinessProfile ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasGoogleBusinessProfile', true)}>Yes</button>
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${!formData.hasGoogleBusinessProfile ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasGoogleBusinessProfile', false)}>No</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Client has Domain?</span>
                        <div className="flex gap-2">
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${formData.hasClientDomain ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasClientDomain', true)}>Yes</button>
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${!formData.hasClientDomain ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasClientDomain', false)}>No</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Client has Logo?</span>
                        <div className="flex gap-2">
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${formData.hasClientLogo ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasClientLogo', true)}>Yes</button>
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${!formData.hasClientLogo ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasClientLogo', false)}>No</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Client has Content?</span>
                        <div className="flex gap-2">
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${formData.hasClientContent ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasClientContent', true)}>Yes</button>
                          <button type="button" className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${!formData.hasClientContent ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`} onClick={() => handleExtraToggle('hasClientContent', false)}>No</button>
                        </div>
                      </div>
                    </div>

                    <MultiSelectDropdown
                      label="Features"
                      options={FEATURES_OPTIONS}
                      selectedValues={formData.features}
                      onChange={handleFeatureChange}
                      placeholder="Select features..."
                    />

                    {formData.features.includes('Custom') && (
                      <FloatingInput
                        label="Enter Custom Feature"
                        name="customFeature"
                        value={formData.customFeatures.join(', ')}
                        onChange={(e) => updateFormData('customFeatures', e.target.value.split(',').map(f => f.trim()))}
                        placeholder="Enter custom features separated by comma"
                      />
                    )}
                  </div>
                </AccordionSection>

                {/* PROJECT DETAILS SECTION */}
                <AccordionSection
                  title="Project Details"
                  icon={FiBriefcase}
                  isOpen={openSections.projectDetails}
                  onToggle={() => setOpenSections(prev => ({ ...prev, projectDetails: !prev.projectDetails }))}
                  completed={formData.projectName && formData.category && formData.scopeOfWork.length > 0}
                >
                  <div className="space-y-4">
                    <FloatingSelect
                      label="Branch"
                      name="branch"
                      value={formData.branch}
                      onChange={(e) => updateFormData('branch', e.target.value)}
                      options={BRANCHES}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Project ID"
                        name="projectId"
                        value={formData.projectId || 'PF-2026-AUTO'}
                        readOnly
                      />
                      <FloatingInput
                        label="Project Name"
                        name="projectName"
                        value={formData.projectName}
                        onChange={(e) => updateFormData('projectName', e.target.value)}
                        required
                        error={errors.projectName}
                      />
                    </div>

                    <FloatingSelect
                      label="Project Category"
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      options={categories}
                      required
                      error={errors.category}
                    />
                    {categoryError && <span className="text-xs text-red-500">{categoryError}</span>}

                    <MultiSelectDropdown
                      label="Scope of Work"
                      options={scopeItems.map(item => item.name)}
                      selectedValues={formData.scopeOfWork}
                      onChange={handleScopeChange}
                      required
                      error={errors.scopeOfWork}
                      priceMap={Object.fromEntries(scopeItems.map(item => [item.name, item.price]))}
                      placeholder={
                        loadingScopes
                          ? 'Loading scope items...'
                          : scopeError
                          ? 'Failed to load scopes'
                          : formData.category
                          ? scopeItems.length === 0
                            ? 'No scopes available for this category'
                            : 'Select scope items...'
                          : 'Select a category first'
                      }
                    />

                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-pink-500/10">
                      <span className="font-semibold text-gray-900 dark:text-white">Project Scope Cost</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrencyINR(calculatedCost)}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FloatingInput
                        label="Timeline Value"
                        name="timelineValue"
                        type="number"
                        value={formData.timeline.value}
                        onChange={(e) => handleTimelineChange('value', e.target.value)}
                        required
                        error={errors.timeline}
                      />
                      <FloatingSelect
                        label="Timeline Unit"
                        name="timelineUnit"
                        value={formData.timeline.unit}
                        onChange={(e) => handleTimelineChange('unit', e.target.value)}
                        options={TIMELINE_UNITS}
                      />
                      <FloatingInput
                        label="Project End Date"
                        name="projectEndDate"
                        type="date"
                        value={calculatedEndDate}
                        readOnly
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Number of Pages"
                        name="numberOfPages"
                        type="number"
                        value={formData.numberOfPages}
                        onChange={(e) => updateFormData('numberOfPages', e.target.value)}
                        error={errors.numberOfPages}
                      />
                      <FloatingSelect
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={(e) => updateFormData('status', e.target.value)}
                        options={STATUSES}
                      />
                    </div>

                    <FloatingTextarea
                      label="Project Details"
                      name="projectDetails"
                      value={formData.projectDetails}
                      onChange={(e) => updateFormData('projectDetails', e.target.value)}
                      rows={4}
                    />

                    <div className="space-y-4 pt-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Technologies Used</h4>
                      {techOptions.frontend && techOptions.frontend.length > 0 && (
                        <TechMultiSelect
                          label="Frontend Technologies"
                          options={techOptions.frontend}
                          selectedValues={formData.technologies.frontend}
                          onChange={(selected) => updateNestedField('technologies', 'frontend', selected)}
                          required
                          error={errors.frontendTech}
                          placeholder="Select frontend technologies..."
                        />
                      )}
                      {techOptions.backend && techOptions.backend.length > 0 && (
                        <TechMultiSelect
                          label="Backend Technologies"
                          options={techOptions.backend}
                          selectedValues={formData.technologies.backend}
                          onChange={(selected) => updateNestedField('technologies', 'backend', selected)}
                          placeholder="Select backend technologies..."
                        />
                      )}
                      {techOptions.database && techOptions.database.length > 0 && (
                        <TechMultiSelect
                          label="Database Technologies"
                          options={techOptions.database}
                          selectedValues={formData.technologies.database}
                          onChange={(selected) => updateNestedField('technologies', 'database', selected)}
                          placeholder="Select databases..."
                        />
                      )}
                    </div>
                  </div>
                </AccordionSection>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-white/80 dark:bg-slate-900/80">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scope Cost</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrencyINR(costBreakdown.scopeCost)}</p>
                  </div>
                  {costBreakdown.extrasTotal > 0 && (
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <p className="text-xs text-orange-600 dark:text-orange-400">Extras</p>
                      <p className="font-semibold text-orange-700 dark:text-orange-300">+{formatCurrencyINR(costBreakdown.extrasTotal)}</p>
                    </div>
                  )}
                  {costBreakdown.pagesCost > 0 && (
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <p className="text-xs text-purple-600 dark:text-purple-400">Pages</p>
                      <p className="font-semibold text-purple-700 dark:text-purple-300">+{formatCurrencyINR(costBreakdown.pagesCost)}</p>
                    </div>
                  )}
                  {costBreakdown.timelineExtraCost > 0 && (
                    <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">Timeline</p>
                      <p className="font-semibold text-yellow-700 dark:text-yellow-300">+{formatCurrencyINR(costBreakdown.timelineExtraCost)}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Grand Total</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                      {formatCurrencyINR(costBreakdown.grandTotal)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      ) : (
                        <><FiSave size={16} /> {project ? 'Update Project' : 'Create Project'}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModalNew;
