// src/pages/Projects.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiDownload, FiRefreshCw, FiFolder, FiCheckCircle, FiAward, FiCalendar, FiX, FiMoreHorizontal, FiFilter } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProjectTable from '../components/ProjectTable';
import ProjectModalNew from '../components/ProjectModalNew';
import ConfirmModal from '../components/ConfirmModal'; 
import GanttChart from '../components/GanttChart';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { useApp } from '../context/AppContext';
import { useCategories } from '../hooks/useCategories';
import debounce from '../utils/debounce';
import { exportAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const StatsCard = ({ label, value, icon: Icon, index, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative overflow-hidden backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-pink-500/0 group-hover:from-blue-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
      
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5 tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend === 'up' ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 group-hover:scale-110 transition-transform duration-300">
            <Icon className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </motion.div>
  );
};

const Projects = () => {
  const { projects, loading, pagination, fetchProjects, createProject, updateProject, deleteProject } = useApp();
  const { categories } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [timelineProject, setTimelineProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);
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
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    fetchProjects(params);
  }, [fetchProjects, page, statusFilter, categoryFilter, search]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    if (search !== undefined) {
      loadProjects();
    }
  }, [search]);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleCreate = async (data) => {
    await createProject(data);
    toast.success('Project created successfully');
    setPage(1);
    loadProjects();
  };

  const handleUpdate = async (data) => {
    await updateProject(editProject._id, data);
    toast.success('Project updated successfully');
    setEditProject(null);
    loadProjects();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget._id);
    toast.success('Project deleted successfully');
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

  const completedProjects = projects.filter((p) => p.status === 'Completed');
  const revenueTotal = completedProjects.reduce((s, p) => s + (p.cost || 0), 0);

  const stats = [
    { label: 'Total Projects', value: pagination.total || 0, icon: FiFolder, trend: 12 },
    { label: 'Active', value: projects.filter((p) => p.status === 'Active').length, icon: FiCheckCircle, trend: 8 },
    { label: 'Completed', value: completedProjects.length, icon: FiAward, trend: 15 },
    { label: 'Total Revenue', value: formatCurrency(revenueTotal), icon: FaRupeeSign, trend: 23 },
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

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  Projects
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Manage and track all your projects
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadProjects}
                  className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex justify-center items-center"
                >
                  <FiRefreshCw size={16} className={loading ? "animate-spin text-blue-600" : "text-gray-600 dark:text-gray-300"} />
                </motion.button>

                <div ref={exportRef} className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExportOpen(!exportOpen)}
                    className="px-4 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-sm font-medium text-sm text-gray-700 dark:text-gray-200 hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <FiDownload size={14} />
                    Export
                  </motion.button>

                  <AnimatePresence>
                    {exportOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 w-36 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden z-50"
                      >
                        {['csv', 'excel', 'pdf'].map((format) => (
                          <button
                            key={format}
                            onClick={() => handleExport(format)}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-pink-500/10 transition-all"
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openCreate}
                  className="px-5 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white text-sm font-medium hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <FiPlus size={14} />
                  Create Project
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {stats.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} index={i} />
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden">
            <div className="p-5">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    onChange={handleSearch}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-11 px-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 outline-none text-sm text-gray-700 dark:text-gray-300 min-w-[140px] cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-11 px-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 outline-none text-sm text-gray-700 dark:text-gray-300 min-w-[160px] cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-11 px-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-pink-500/10 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-2"
                >
                  <FiFilter size={14} />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
            >
              <ProjectTable
                projects={projects}
                onEdit={openEdit}
                onDelete={(p) => setDeleteTarget(p)}
                onTimeline={(p) => setTimelineProject(p)}
              />
              <div className="p-5 border-t border-white/20 dark:border-slate-700/50">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <ProjectModalNew
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditProject(null);
          }}
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

        {/* Timeline Drawer */}
        <AnimatePresence>
          {timelineProject && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setTimelineProject(null)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="fixed right-0 top-0 h-full w-full max-w-[700px] backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 shadow-2xl z-50 flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                      <FiCalendar className="text-blue-600 dark:text-blue-400" size={16} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{timelineProject.projectName}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {timelineProject.category} &middot; {timelineProject.scopeOfWork?.length || 0} tasks
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimelineProject(null)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {timelineProject.scopeOfWork && timelineProject.scopeOfWork.length > 0 ? (
                    <GanttChart
                      scopeOfWork={timelineProject.scopeOfWork}
                      createdAt={timelineProject.createdAt}
                      timeline={timelineProject.timeline}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                        <FiCalendar className="text-gray-400" size={32} />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mt-4">No scope items</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add scope of work to see the timeline</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;
