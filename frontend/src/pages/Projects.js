import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiDownload, FiRefreshCw, FiFolder, FiCheckCircle, FiAward, FiCalendar, FiX } from 'react-icons/fi';
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



const StatsCard = ({ label, value, icon: Icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1.5">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <Icon className="text-gray-500" size={20} />
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
  const [timelineProject, setTimelineProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);
  const [search, setSearch] = useState('');
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

  const completedProjects = projects.filter((p) => p.status === 'Completed');
  const revenueTotal = completedProjects.reduce((s, p) => s + (p.cost || 0), 0);

  const stats = [
    { label: 'Total Projects', value: pagination.total || 0, icon: FiFolder },
    { label: 'Active', value: projects.filter((p) => p.status === 'Active').length, icon: FiCheckCircle },
    { label: 'Completed', value: completedProjects.length, icon: FiAward },
    { label: 'Cost of Project', value: formatCurrency(revenueTotal), icon: FaRupeeSign },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between gap-5 mb-8"
      >
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Projects
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage and track all projects
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadProjects}
            className="
              w-10
              h-10
              rounded-lg
              bg-white
              border
              border-gray-200
              shadow-sm
              hover:bg-gray-50
              transition-all
              flex
              justify-center
              items-center
            "
          >
            <FiRefreshCw size={16} className={loading ? "animate-spin text-gray-500" : "text-gray-500"} />
          </button>

          <div ref={exportRef} className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="
                px-4
                h-10
                rounded-lg
                bg-white
                border
                border-gray-200
                shadow-sm
                font-medium
                text-sm
                text-gray-600
                hover:bg-gray-50
                transition-all
                flex
                items-center
                gap-2
              "
            >
              <FiDownload size={14} />
              Export
            </button>

            {exportOpen && (
              <div className="absolute right-0 top-12 w-36 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  PDF
                </button>
              </div>
            )}
          </div>

          <button
            onClick={openCreate}
            className="
              px-4
              h-10
              rounded-lg
              bg-gray-900
              text-white
              text-sm
              font-medium
              hover:bg-gray-800
              transition-all
              duration-200
              flex
              items-center
              gap-2
              shadow-sm
            "
          >
            <FiPlus size={14} />
            Create Project
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <StatsCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              onChange={handleSearch}
              className="
                w-full
                h-10
                pl-10
                pr-4
                rounded-lg
                bg-gray-50
                border
                border-gray-200
                focus:ring-2
                focus:ring-gray-300
                focus:border-transparent
                outline-none
                text-sm
                text-gray-700
                placeholder:text-gray-400
              "
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="
              h-10
              px-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              outline-none
              text-sm
              text-gray-600
              min-w-[140px]
              cursor-pointer
            "
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
            className="
              h-10
              px-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              outline-none
              text-sm
              text-gray-600
              min-w-[160px]
              cursor-pointer
            "
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <ProjectTable
            projects={projects}
            onEdit={openEdit}
            onDelete={(p) => setDeleteTarget(p)}
            onTimeline={(p) => setTimelineProject(p)}
          />
          <div className="p-5 border-t border-gray-100">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </motion.div>
      )}

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
      {timelineProject && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50 drawer-overlay"
            onClick={() => setTimelineProject(null)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-[700px] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  <FiCalendar className="text-gray-500" size={16} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{timelineProject.projectName}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {timelineProject.category} &middot; {timelineProject.scopeOfWork?.length || 0} tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTimelineProject(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <FiX size={20} />
              </button>
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
                  <FiCalendar className="mx-auto text-gray-300" size={48} />
                  <p className="text-gray-400 text-lg font-medium mt-4">No scope items</p>
                  <p className="text-gray-400 text-sm mt-1">Add scope of work to see the timeline</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Projects;
