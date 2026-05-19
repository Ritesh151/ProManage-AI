import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiDownload, FiRefreshCw, FiFolder, FiCheckCircle, FiClock } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProjectTable from '../components/ProjectTable';
import ProjectModal from '../components/ProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { useApp } from '../context/AppContext';
import { useCategories } from '../hooks/useCategories';
import debounce from '../utils/debounce';
import { exportAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const StatsCard = ({ label, value, icon: Icon, color, index }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
  };
  const c = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1.5 ${c.text}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={c.icon} size={22} />
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const { projects, loading, pagination, fetchProjects, createProject, updateProject, deleteProject } = useApp();
  const { categories } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);
  const searchRef = useRef('');
  const exportRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProjects = useCallback(() => {
    const params = { page, limit: 10 };
    if (searchRef.current) params.search = searchRef.current;
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    fetchProjects(params);
  }, [fetchProjects, page, statusFilter, categoryFilter]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const debouncedSearch = debounce((value) => {
    searchRef.current = value;
    setPage(1);
  }, 500);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleCreate = async (data) => {
    await createProject(data);
    toast.success('Project created');
    setPage(1);
    loadProjects();
  };

  const handleUpdate = async (data) => {
    await updateProject(editProject._id, data);
    toast.success('Project updated');
    setEditProject(null);
    loadProjects();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget._id);
    toast.success('Project deleted');
    setDeleteTarget(null);
    loadProjects();
  };

  const openEdit = (project) => {
    setEditProject(project);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditProject(null);
    setModalOpen(true);
  };

  const handleExport = async (format) => {
    setExportOpen(false);
    try {
      const apis = { csv: exportAPI.csv, excel: exportAPI.excel, pdf: exportAPI.pdf };
      const res = await apis[format]();
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projects.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error('Export failed');
    }
  };

  const stats = [
    { label: 'Total Projects', value: pagination.total || 0, icon: FiFolder, color: 'blue' },
    { label: 'Active', value: projects.filter((p) => p.status === 'Active').length, icon: FiCheckCircle, color: 'green' },
    { label: 'On Hold', value: projects.filter((p) => p.status === 'On Hold').length, icon: FiClock, color: 'amber' },
    { label: 'Revenue', value: formatCurrency(projects.reduce((s, p) => s + (p.cost || 0), 0)), icon: FaRupeeSign, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight">Projects</h1>
          <p className="text-sm text-gray-400 mt-1.5">Manage and track all projects</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProjects}
            className="w-[50px] h-[50px] flex items-center justify-center border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary transition-all"
            title="Refresh"
          >
            <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <div ref={exportRef} className="relative">
            <button onClick={() => setExportOpen(!exportOpen)} className="btn-secondary px-5">
              <FiDownload size={16} /> Export
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-[160px] bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                <button onClick={() => handleExport('csv')} className="w-full px-4 py-3 text-sm text-text hover:bg-gray-50 text-left transition-colors">CSV</button>
                <button onClick={() => handleExport('excel')} className="w-full px-4 py-3 text-sm text-text hover:bg-gray-50 text-left transition-colors">Excel</button>
                <button onClick={() => handleExport('pdf')} className="w-full px-4 py-3 text-sm text-text hover:bg-gray-50 text-left transition-colors">PDF</button>
              </div>
            )}
          </div>
          <button onClick={openCreate} className="btn-primary px-5">
            <FiPlus size={18} /> Create Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            onChange={handleSearch}
            className="w-full h-[50px] pl-11 pr-4 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text placeholder:text-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-[50px] px-4 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-500 transition-all appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="h-[50px] px-4 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-500 transition-all appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <ProjectTable
            projects={projects}
            onEdit={openEdit}
            onDelete={(p) => setDeleteTarget(p)}
          />
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={(p) => setPage(p)}
          />
        </motion.div>
      )}

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditProject(null); }}
        onSubmit={editProject ? handleUpdate : handleCreate}
        project={editProject}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.projectName}"?`}
      />
    </div>
  );
};

export default Projects;
