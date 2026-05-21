import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiX, FiChevronDown, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectForm } from '../hooks/useProjectForm';
import { scopeService } from '../services/scopeService';
import { formatCurrencyINR } from '../utils/currencyFormatter';
import './ProjectModalNew.css';

const BRANCHES = ['Kutch Infoline', 'Lakshmi Healthcare Services', 'OptiMatrix', 'OptiMatrix Cash', 'OptiMatrix Domestic', 'OptiMatrix Export'];
const BUSINESS_TYPES = ['Startup', 'Large Corporate', 'MSME', 'Retail / E-commerce', 'Manufacturing / Production'];
const TURNOVER_OPTIONS = ['<50K', '50K–10 Lakh', '10–50 Lakh', '50 Lakh+'];
const GOOGLE_RANKING_OPTIONS = ['Not Listed', 'Page 2+', 'Page 1'];
const FEATURES_OPTIONS = ['Whatsapp Integration', 'Payment Integration', 'Custom'];
const TIMELINE_UNITS = ['Days', 'Weeks', 'Months'];
const STATUSES = ['Active', 'Completed', 'On Hold', 'Cancelled'];

const TECHNOLOGIES_BY_CATEGORY = {
  'Website Development': {
    frontend: ['React JS', 'Next JS', 'Vue JS', 'Angular', 'Svelte'],
    backend: ['Node JS', 'Laravel', 'Express', 'Django', 'FastAPI'],
    database: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase'],
    other: ['Webpack', 'Vite', 'Docker', 'AWS']
  },
  'Mobile App Development': {
    frontend: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    backend: ['Node JS', 'Django', 'FastAPI', 'Spring Boot'],
    database: ['MongoDB', 'Firebase', 'PostgreSQL'],
    other: ['Firebase', 'AWS', 'Docker']
  },
  'E-commerce': {
    frontend: ['React JS', 'Next JS', 'Vue JS'],
    backend: ['Node JS', 'Laravel', 'Django'],
    database: ['MongoDB', 'MySQL', 'PostgreSQL'],
    other: ['Stripe', 'PayPal', 'AWS', 'Docker']
  },
  'Custom Software': {
    frontend: ['React JS', 'Angular', 'Vue JS'],
    backend: ['Node JS', 'Python', 'Java', 'C#'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Oracle'],
    other: ['Docker', 'Kubernetes', 'AWS', 'Azure']
  },
  'AI/ML Solutions': {
    frontend: ['React JS', 'Vue JS'],
    backend: ['Python', 'Node JS', 'FastAPI'],
    database: ['MongoDB', 'PostgreSQL'],
    other: ['TensorFlow', 'PyTorch', 'AWS', 'Google Cloud']
  }
};

const FloatingInput = ({ label, name, type = 'text', value, onChange, required, readOnly, error, placeholder }) => (
  <div className="floating-input-group">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      placeholder={placeholder || ' '}
      className={`floating-input ${readOnly ? 'read-only' : ''} ${error ? 'error' : ''}`}
    />
    <label className="floating-label">
      {label}{required && ' *'}
    </label>
    {error && <span className="error-text">{error}</span>}
  </div>
);

const FloatingSelect = ({ label, name, value, onChange, options, required, error }) => (
  <div className="floating-input-group">
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`floating-input ${error ? 'error' : ''}`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <label className="floating-label">
      {label}{required && ' *'}
    </label>
    {error && <span className="error-text">{error}</span>}
  </div>
);

const FloatingTextarea = ({ label, name, value, onChange, rows = 3, error }) => (
  <div className="floating-input-group">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder=" "
      className={`floating-input ${error ? 'error' : ''}`}
    />
    <label className="floating-label">{label}</label>
    {error && <span className="error-text">{error}</span>}
  </div>
);

const MultiSelectDropdown = ({ label, options, selectedValues, onChange, required, error, placeholder, priceMap }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="multi-select-group">
      <div className="multi-select-header">
        <label className="floating-label">{label}{required && ' *'}</label>
        <div className="multi-select-trigger" onClick={() => setIsOpen(!isOpen)}>
          <div className="multi-select-values">
            {selectedValues.length === 0 ? (
              <span className="placeholder">{placeholder || 'Select options...'}</span>
            ) : (
              selectedValues.map(val => (
                <span key={val} className="multi-select-tag">
                  {val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(val);
                    }}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
          <FiChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="multi-select-dropdown"
          >
            {options.map(option => (
              <label key={option} className="multi-select-option">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleToggle(option)}
                />
                <span className="option-label">{option}</span>
                {priceMap && priceMap[option] !== undefined && (
                  <span className="option-price">{formatCurrencyINR(priceMap[option])}</span>
                )}
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

const AccordionSection = ({ title, isOpen, onToggle, children, completed }) => (
  <div className="accordion-section">
    <button
      type="button"
      onClick={onToggle}
      className={`accordion-header ${isOpen ? 'open' : ''}`}
    >
      <div className="accordion-title">
        <span className="accordion-icon">{isOpen ? '▼' : '▶'}</span>
        <span>{title}</span>
        {completed && <span className="completion-badge">✓</span>}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="accordion-content"
        >
          {children}
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
        cost: calculatedCost,
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
        /* Overlay container - provides fixed positioning, backdrop blur, and perfect centering via flexbox */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-overlay"
          onClick={onClose}
        >
          {/* Modal Container - nested inside overlay for proper centering, scrollable body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'tween', duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed, never scrolls */}
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {project ? 'Edit Project' : 'New Project'}
                </h2>
                <p className="modal-subtitle">
                  {project ? 'Update project details' : 'Enter project details'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="modal-close-btn"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Form Wrapper - flex-1 + min-h-0 REQUIRED for scroll to work */}
            <div className="modal-form-wrapper">
              <form onSubmit={handleSubmit} className="modal-form">
              {/* CLIENT INFORMATION SECTION */}
              <AccordionSection
                title="CLIENT INFORMATION"
                isOpen={openSections.clientInfo}
                onToggle={() => setOpenSections(prev => ({ ...prev, clientInfo: !prev.clientInfo }))}
                completed={formData.clientName && formData.clientMobileNumber && formData.companyName}
              >
                <div className="section-content">
                  <div className="form-grid-2">
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

                  <div className="form-grid-2">
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

                  <div className="form-grid-2">
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

                  <FloatingSelect
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={(e) => updateFormData('businessType', e.target.value)}
                    options={BUSINESS_TYPES}
                    required
                    error={errors.businessType}
                  />

                  <FloatingTextarea
                    label="Your Services"
                    name="yourServices"
                    value={formData.yourServices}
                    onChange={(e) => updateFormData('yourServices', e.target.value)}
                    rows={3}
                  />

                  <div className="form-grid-2">
                    <FloatingInput
                      label="How old are you in business?"
                      name="yearsInBusiness"
                      type="number"
                      value={formData.yearsInBusiness}
                      onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
                      error={errors.yearsInBusiness}
                      placeholder="Years"
                    />
                    <div className="button-group">
                      <label className="button-group-label">Sales or Marketing Team?</label>
                      <div className="button-group-buttons">
                        <button
                          type="button"
                          className={`btn-toggle ${formData.hasSalesTeam === true ? 'active' : ''}`}
                          onClick={() => handleSalesTeamToggle(true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle ${formData.hasSalesTeam === false ? 'active' : ''}`}
                          onClick={() => handleSalesTeamToggle(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <label className="button-group-label">Social Media Profiles?</label>
                    <div className="button-group-buttons">
                      <button
                        type="button"
                        className={`btn-toggle ${formData.hasSocialMedia ? 'active' : ''}`}
                        onClick={() => handleSocialMediaToggle(true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`btn-toggle ${!formData.hasSocialMedia ? 'active' : ''}`}
                        onClick={() => handleSocialMediaToggle(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {formData.hasSocialMedia && (
                    <div className="social-media-fields">
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
                  )}

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

                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.hasGoogleBusinessProfile}
                        onChange={(e) => updateFormData('hasGoogleBusinessProfile', e.target.checked)}
                      />
                      <span>Google Business Profile</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.hasClientDomain}
                        onChange={(e) => updateFormData('hasClientDomain', e.target.checked)}
                      />
                      <span>Client Domain</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.hasClientLogo}
                        onChange={(e) => updateFormData('hasClientLogo', e.target.checked)}
                      />
                      <span>Client Logo</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.hasClientContent}
                        onChange={(e) => updateFormData('hasClientContent', e.target.checked)}
                      />
                      <span>Client Content Available</span>
                    </label>
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
                title="PROJECT DETAILS"
                isOpen={openSections.projectDetails}
                onToggle={() => setOpenSections(prev => ({ ...prev, projectDetails: !prev.projectDetails }))}
                completed={formData.projectName && formData.category && formData.scopeOfWork.length > 0}
              >
                <div className="section-content">
                  <FloatingSelect
                    label="Branch"
                    name="branch"
                    value={formData.branch}
                    onChange={(e) => updateFormData('branch', e.target.value)}
                    options={BRANCHES}
                  />

                  <div className="form-grid-2">
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

                  <div className="floating-input-group">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      required
                      className={`floating-input ${errors.category ? 'error' : ''}`}
                      disabled={loadingCategories}
                    >
                      <option value="">Select project category</option>
                      {loadingCategories ? (
                        <option value="" disabled>Loading categories...</option>
                      ) : categoryError ? (
                        <option value="" disabled>Failed to load categories</option>
                      ) : (
                        categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      )}
                    </select>
                    <label className="floating-label">
                      Project Category *
                    </label>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                    {categoryError && !errors.category && <span className="error-text">{categoryError}</span>}
                  </div>

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

                  <div className="cost-display">
                    <span className="cost-label">Project Cost</span>
                    <span className="cost-value">{formatCurrencyINR(calculatedCost)}</span>
                  </div>

                  <div className="form-grid-3">
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

                  <FloatingInput
                    label="Number of Pages"
                    name="numberOfPages"
                    type="number"
                    value={formData.numberOfPages}
                    onChange={(e) => updateFormData('numberOfPages', e.target.value)}
                    error={errors.numberOfPages}
                  />

                  <FloatingTextarea
                    label="Project Details"
                    name="projectDetails"
                    value={formData.projectDetails}
                    onChange={(e) => updateFormData('projectDetails', e.target.value)}
                    rows={4}
                  />

                  {techOptions.frontend && techOptions.frontend.length > 0 && (
                    <MultiSelectDropdown
                      label="Frontend Technologies"
                      options={techOptions.frontend}
                      selectedValues={formData.technologies.frontend}
                      onChange={(selected) => updateNestedField('technologies', 'frontend', selected)}
                      placeholder="Select frontend technologies..."
                    />
                  )}

                  {techOptions.backend && techOptions.backend.length > 0 && (
                    <MultiSelectDropdown
                      label="Backend Technologies"
                      options={techOptions.backend}
                      selectedValues={formData.technologies.backend}
                      onChange={(selected) => updateNestedField('technologies', 'backend', selected)}
                      placeholder="Select backend technologies..."
                    />
                  )}

                  {techOptions.database && techOptions.database.length > 0 && (
                    <MultiSelectDropdown
                      label="Database Technologies"
                      options={techOptions.database}
                      selectedValues={formData.technologies.database}
                      onChange={(selected) => updateNestedField('technologies', 'database', selected)}
                      placeholder="Select databases..."
                    />
                  )}

                  {techOptions.other && techOptions.other.length > 0 && (
                    <MultiSelectDropdown
                      label="Tools / Other"
                      options={techOptions.other}
                      selectedValues={formData.technologies.other}
                      onChange={(selected) => updateNestedField('technologies', 'other', selected)}
                      placeholder="Select tools..."
                    />
                  )}

                  <FloatingSelect
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    options={STATUSES}
                  />
                </div>
              </AccordionSection>
              </form>
            </div>

            {/* Footer - Fixed, never scrolls */}
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <div className="spinner" />
                ) : (
                  <><FiSave size={16} /> {project ? 'Update' : 'Create'}</>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModalNew;
