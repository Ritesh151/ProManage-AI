// src/components/ProjectModal.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiX, FiUser, FiBriefcase, FiDollarSign, FiCalendar, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import MultiSelect from './MultiSelect';
import { useCategories } from '../hooks/useCategories';
import { statusOptions } from '../utils/formatters';
import { technologiesMapping } from '../utils/technologiesMapping';

const initialForm = {
  projectName: '',
  category: '',
  scopeOfWork: [],
  description: '',
  cost: 0,
  technologies: { frontend: [], backend: [], database: [], other: [] },
  timeline: '',
  paymentTerms: '',
  clientName: '',
  clientEmail: '',
  summary: '',
  status: 'Active',
};

const FloatingInput = ({ label, name, type = 'text', value, onChange, required, readOnly, error }) => (
  <div className="relative mb-4">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      placeholder=" "
      className={`peer w-full px-4 pt-5 pb-2 rounded-xl border-2 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
        readOnly ? 'bg-gray-50 dark:bg-slate-800/30 text-gray-500 dark:text-gray-400' : ''
      } ${
        error 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
      }`}
    />
    <label className={`absolute left-4 transition-all duration-200 pointer-events-none bg-white dark:bg-slate-800 px-1 ${
      value || value === 0
        ? 'text-xs top-1 text-blue-600 dark:text-blue-400'
        : 'text-sm top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600'
    }`}>
      {label}{required && ' *'}
    </label>
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
    <label className={`absolute left-4 transition-all duration-200 pointer-events-none bg-white dark:bg-slate-800 px-1 ${
      value
        ? 'text-xs top-1 text-blue-600 dark:text-blue-400'
        : 'text-sm top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600'
    }`}>
      {label}
    </label>
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
);

const FloatingSelect = ({ label, name, value, onChange, options, required, error }) => {
  const hasValue = value && value !== '';
  return (
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
        <option value=""> </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <label className={`absolute left-4 transition-all duration-200 pointer-events-none bg-white dark:bg-slate-800 px-1 ${
        hasValue
          ? 'text-xs top-1 text-blue-600 dark:text-blue-400'
          : 'text-sm top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'
      }`}>
        {label}{required && ' *'}
      </label>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
    {Icon && <Icon size={16} className="text-blue-600 dark:text-blue-400" />}
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{title}</h3>
  </div>
);

const ProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [errors, setErrors] = useState({});
  const { categories, getScopeByCategory } = useCategories();
  const [scopeOptions, setScopeOptions] = useState([]);
  const [techOptions, setTechOptions] = useState({ frontend: [], backend: [], database: [], other: [] });

  useEffect(() => {
    if (isOpen) {
      setShowDrawer(true);
      if (project) {
        setForm({
          projectName: project.projectName || '',
          category: project.category || '',
          scopeOfWork: Array.isArray(project.scopeOfWork) ? project.scopeOfWork : [],
          description: project.description || '',
          cost: project.cost || 0,
          technologies: project.technologies || { frontend: [], backend: [], database: [], other: [] },
          timeline: project.timeline || '',
          paymentTerms: project.paymentTerms || '',
          clientName: project.clientName || '',
          clientEmail: project.clientEmail || '',
          summary: project.summary || '',
          status: project.status || 'Active',
        });
        setScopeOptions(getScopeByCategory(project.category));
        setTechOptions(technologiesMapping[project.category] || { frontend: [], backend: [], database: [], other: [] });
      } else {
        setForm(initialForm);
        setScopeOptions([]);
        setTechOptions({ frontend: [], backend: [], database: [], other: [] });
      }
      setErrors({});
    } else {
      setTimeout(() => setShowDrawer(false), 300);
    }
  }, [project, isOpen, getScopeByCategory]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.projectName?.trim()) newErrors.projectName = 'Project name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (form.scopeOfWork.length === 0) newErrors.scopeOfWork = 'Select at least one scope item';
    if (!form.clientName?.trim()) newErrors.clientName = 'Client name is required';
    if (!form.clientEmail?.trim()) newErrors.clientEmail = 'Client email is required';
    if (form.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) newErrors.clientEmail = 'Invalid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: name === 'cost' ? Number(value) || 0 : value };
    if (name === 'category') {
      updates.scopeOfWork = [];
      updates.technologies = { frontend: [], backend: [], database: [], other: [] };
      setScopeOptions(getScopeByCategory(value));
      setTechOptions(technologiesMapping[value] || { frontend: [], backend: [], database: [], other: [] });
    }
    setForm((prev) => ({ ...prev, ...updates }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleScopeChange = (selected) => {
    setForm((prev) => ({ ...prev, scopeOfWork: selected }));
    if (errors.scopeOfWork) setErrors((prev) => ({ ...prev, scopeOfWork: '' }));
  };

  const handleTechnologiesChange = (category, selected) => {
    setForm((prev) => ({
      ...prev,
      technologies: { ...prev.technologies, [category]: selected },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    setSubmitting(true);
    try {
      const data = {
        ...form,
        cost: Number(form.cost) || 0,
      };
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error saving project');
    } finally {
      setSubmitting(false);
    }
  };

  if (!showDrawer && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95, y: isOpen ? 0 : 20 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[90%] max-w-4xl max-h-[90vh] bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl flex flex-col pointer-events-auto border border-white/20 dark:border-slate-700/50 overflow-hidden">
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-pink-500" />

          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <FiBriefcase size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {project ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {project ? 'Update project details and specifications' : 'Enter project details to get started'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 custom-scrollbar">
            {/* Identification Section */}
            <div className="mb-6">
              <SectionTitle icon={FiSettings} title="Identification" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                  label="Sr. No"
                  value={project ? project.srNo || '' : 'Auto-generated'}
                  readOnly
                />
                <FloatingInput
                  label="Project ID"
                  value={project ? project.projectId || '' : 'Auto-generated'}
                  readOnly
                />
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="mb-6">
              <SectionTitle icon={FiBriefcase} title="Basic Information" />
              <div className="space-y-4">
                <FloatingInput
                  label="Project Name"
                  name="projectName"
                  value={form.projectName}
                  onChange={handleChange}
                  required
                  error={errors.projectName}
                />
                <FloatingSelect
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={categories}
                  required
                  error={errors.category}
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Scope of Work <span className="text-red-500">*</span>
                  </label>
                  <MultiSelect
                    options={scopeOptions}
                    selectedValues={form.scopeOfWork}
                    onChange={handleScopeChange}
                    placeholder={form.category ? 'Select scope items...' : 'Select a category first'}
                  />
                  {errors.scopeOfWork && <span className="text-xs text-red-500 mt-1 block">{errors.scopeOfWork}</span>}
                </div>
                <FloatingTextarea
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* Client Details Section */}
            <div className="mb-6">
              <SectionTitle icon={FiUser} title="Client Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                  label="Client Name"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                  error={errors.clientName}
                />
                <FloatingInput
                  label="Client Email"
                  name="clientEmail"
                  type="email"
                  value={form.clientEmail}
                  onChange={handleChange}
                  required
                  error={errors.clientEmail}
                />
              </div>
            </div>

            {/* Technologies Section */}
            <div className="mb-6">
              <SectionTitle icon={FiSettings} title="Technologies" />
              <div className="space-y-4">
                {techOptions.frontend?.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Frontend Technologies</label>
                    <MultiSelect
                      options={techOptions.frontend}
                      selectedValues={form.technologies.frontend || []}
                      onChange={(selected) => handleTechnologiesChange('frontend', selected)}
                      placeholder="Select frontend technologies..."
                    />
                  </div>
                )}
                {techOptions.backend?.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Backend Technologies</label>
                    <MultiSelect
                      options={techOptions.backend}
                      selectedValues={form.technologies.backend || []}
                      onChange={(selected) => handleTechnologiesChange('backend', selected)}
                      placeholder="Select backend technologies..."
                    />
                  </div>
                )}
                {techOptions.database?.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Database Technologies</label>
                    <MultiSelect
                      options={techOptions.database}
                      selectedValues={form.technologies.database || []}
                      onChange={(selected) => handleTechnologiesChange('database', selected)}
                      placeholder="Select databases..."
                    />
                  </div>
                )}
                {techOptions.other?.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tools & Others</label>
                    <MultiSelect
                      options={techOptions.other}
                      selectedValues={form.technologies.other || []}
                      onChange={(selected) => handleTechnologiesChange('other', selected)}
                      placeholder="Select tools..."
                    />
                  </div>
                )}
                {(!techOptions.frontend?.length && !techOptions.backend?.length && !techOptions.database?.length && !techOptions.other?.length) && (
                  <div className="text-center py-6 text-gray-400 dark:text-gray-500">
                    <p className="text-sm">Select a category to view technology options</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Timeline Section */}
            <div className="mb-6">
              <SectionTitle icon={FiDollarSign} title="Pricing & Timeline" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                  label="Cost (₹)"
                  name="cost"
                  type="number"
                  value={form.cost}
                  onChange={handleChange}
                />
                <FloatingInput
                  label="Timeline"
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                  placeholder="e.g., 3 Months"
                />
              </div>
              <div className="mt-4">
                <FloatingInput
                  label="Payment Terms"
                  name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={handleChange}
                  placeholder="e.g., 50% Advance, 50% on completion"
                />
              </div>
            </div>

            {/* Additional Section */}
            <div className="mb-6">
              <SectionTitle icon={FiCalendar} title="Additional Information" />
              <div className="space-y-4">
                <FloatingTextarea
                  label="Summary"
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  rows={3}
                />
                <FloatingSelect
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={statusOptions}
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  {project ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;