import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
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

const FloatingInput = ({ label, name, type = 'text', value, onChange, required, readOnly }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      placeholder=" "
      className={`peer input-premium ${readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
    />
    <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-medium text-gray-500 transition-all
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
      peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary">
      {label}{required && ' *'}
    </label>
  </div>
);

const FloatingTextarea = ({ label, name, value, onChange, rows = 3 }) => (
  <div className="relative">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder=" "
      className="peer textarea-premium"
    />
    <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-medium text-gray-500 transition-all
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
      peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary">
      {label}
    </label>
  </div>
);

const FloatingSelect = ({ label, name, value, onChange, options, required }) => {
  const hasValue = value && value !== '';
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="peer select-premium"
      >
        <option value=""> </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <label className={`absolute left-4 px-1 bg-white transition-all pointer-events-none
        ${hasValue
          ? '-top-2.5 text-xs font-medium text-gray-500'
          : 'top-3.5 text-sm text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:font-medium'
        }`}>
        {label}{required && ' *'}
      </label>
    </div>
  );
};

const ProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
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
    } else {
      setTimeout(() => setShowDrawer(false), 300);
    }
  }, [project, isOpen, getScopeByCategory]);

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
  };

  const handleScopeChange = (selected) => {
    setForm((prev) => ({ ...prev, scopeOfWork: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) { toast.error('Project name is required'); return; }
    if (!form.category) { toast.error('Select a category'); return; }
    if (form.scopeOfWork.length === 0) { toast.error('Select at least one scope item'); return; }
    if (!form.clientName.trim()) { toast.error('Client name is required'); return; }
    if (!form.clientEmail.trim()) { toast.error('Client email is required'); return; }
    setSubmitting(true);
    try {
      const data = {
        ...form,
        cost: Number(form.cost) || 0,
      };
      await onSubmit(data);
      onClose();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (!showDrawer && !isOpen) return null;

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 z-50 drawer-overlay"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed right-0 top-0 h-full w-full max-w-[700px] bg-white shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-text">
              {project ? 'Edit Project' : 'New Project'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {project ? 'Update project details' : 'Enter project details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <p className="section-title">Identification</p>
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Sr. No" value={project ? project.srNo || '' : 'Auto'} readOnly />
              <FloatingInput label="Project ID" value={project ? project.projectId || '' : 'Auto'} readOnly />
            </div>
          </div>

          <div className="mb-8">
            <p className="section-title">Basic Information</p>
            <div className="space-y-4">
              <FloatingInput label="Project Name" name="projectName" value={form.projectName} onChange={handleChange} required />
              <FloatingSelect label="Category" name="category" value={form.category} onChange={handleChange} options={categories} required />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Scope of Work *</label>
                <MultiSelect
                  options={scopeOptions}
                  selectedValues={form.scopeOfWork}
                  onChange={handleScopeChange}
                  placeholder={form.category ? 'Select scope items...' : 'Select a category first'}
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="section-title">Client Details</p>
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Client Name" name="clientName" value={form.clientName} onChange={handleChange} required />
              <FloatingInput label="Client Email" name="clientEmail" type="email" value={form.clientEmail} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-8">
            <p className="section-title">Project Details</p>
            <div className="space-y-4">
              <FloatingTextarea label="Description" name="description" value={form.description} onChange={handleChange} />

              <div className="mt-6 border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold text-text mb-4">Technologies</p>
                <div className="space-y-4">
                  {techOptions.frontend && techOptions.frontend.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Frontend Technologies</label>
                      <MultiSelect
                        options={techOptions.frontend}
                        selectedValues={form.technologies.frontend || []}
                        onChange={(selected) => setForm((prev) => ({ ...prev, technologies: { ...prev.technologies, frontend: selected } }))}
                        placeholder="Select frontend technologies..."
                      />
                    </div>
                  )}
                  {techOptions.backend && techOptions.backend.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Backend Technologies</label>
                      <MultiSelect
                        options={techOptions.backend}
                        selectedValues={form.technologies.backend || []}
                        onChange={(selected) => setForm((prev) => ({ ...prev, technologies: { ...prev.technologies, backend: selected } }))}
                        placeholder="Select backend technologies..."
                      />
                    </div>
                  )}
                  {techOptions.database && techOptions.database.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Database Technologies</label>
                      <MultiSelect
                        options={techOptions.database}
                        selectedValues={form.technologies.database || []}
                        onChange={(selected) => setForm((prev) => ({ ...prev, technologies: { ...prev.technologies, database: selected } }))}
                        placeholder="Select databases..."
                      />
                    </div>
                  )}
                  {techOptions.other && techOptions.other.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Tools / Other</label>
                      <MultiSelect
                        options={techOptions.other}
                        selectedValues={form.technologies.other || []}
                        onChange={(selected) => setForm((prev) => ({ ...prev, technologies: { ...prev.technologies, other: selected } }))}
                        placeholder="Select tools..."
                      />
                    </div>
                  )}
                  {(!techOptions.frontend && !techOptions.backend && !techOptions.database && !techOptions.other) && (
                    <p className="text-sm text-gray-400">Select a category to view technology options.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="section-title">Pricing & Timeline</p>
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Cost" name="cost" type="number" value={form.cost} onChange={handleChange} />
              <FloatingInput label="Timeline" name="timeline" value={form.timeline} onChange={handleChange} />
            </div>
            <div className="mt-4">
              <FloatingInput label="Payment Terms" name="paymentTerms" value={form.paymentTerms} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-8">
            <p className="section-title">Additional</p>
            <div className="space-y-4">
              <FloatingTextarea label="Summary" name="summary" value={form.summary} onChange={handleChange} />
              <FloatingSelect label="Status" name="status" value={form.status} onChange={handleChange} options={statusOptions} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 -mx-6 -mb-6 mt-8">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary min-w-[160px]"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><FiSave size={18} /> {project ? 'Update' : 'Create'}</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default ProjectModal;
