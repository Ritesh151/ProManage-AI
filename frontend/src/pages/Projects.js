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
      loadProjects();
    }, 500),
    [loadProjects]
  );

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
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 space-y-8">

      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between gap-5"
      >

        <div>

          <h1
            className="
text-4xl
font-bold
bg-gradient-to-r
from-blue-600
via-purple-600
to-pink-500
bg-clip-text
text-transparent
"
          >
            Projects
          </h1>

          <p className="mt-2 text-gray-500">
            Manage and track all projects
          </p>

        </div>

        <div className="flex gap-3 flex-wrap">

          <button
            onClick={loadProjects}
            className="
w-14
h-14
rounded-2xl
bg-white
shadow-lg
hover:scale-105
hover:shadow-xl
transition-all
flex
justify-center
items-center
"
          >
            <FiRefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>


          <div
            ref={exportRef}
            className="relative"
          >

            <button
              onClick={() =>
                setExportOpen(!exportOpen)
              }
              className="
px-6
h-14
rounded-2xl
bg-white
shadow-lg
font-medium
hover:scale-105
transition-all
flex
items-center
gap-2
"
            >
              <FiDownload />
              Export
            </button>

            {
              exportOpen && (

                <div
                  className="
absolute
right-0
top-16
w-44
bg-white
rounded-2xl
shadow-2xl
overflow-hidden
z-50
"
                >

                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-5 py-4 hover:bg-gray-50 text-left"
                  >
                    CSV
                  </button>

                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full px-5 py-4 hover:bg-gray-50 text-left"
                  >
                    Excel
                  </button>

                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-5 py-4 hover:bg-gray-50 text-left"
                  >
                    PDF
                  </button>

                </div>

              )

            }

          </div>


          <button
            onClick={openCreate}
            className="
px-7
h-14
rounded-2xl
text-white
font-medium
bg-gradient-to-r
from-blue-600
to-purple-600
shadow-xl
hover:scale-105
hover:shadow-2xl
transition-all
flex
items-center
gap-3
"
          >
            <FiPlus />
            Create Project
          </button>

        </div>

      </motion.div>



      {/* Stats */}

      <div
        className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-6
"
      >

        {
          stats.map((stat, i) => (

            <motion.div
              key={stat.label}
              whileHover={{
                y: -8
              }}
              className="
bg-white/80
backdrop-blur-xl
rounded-3xl
shadow-xl
border
border-white
"
            >

              <StatsCard
                {...stat}
                index={i}
              />

            </motion.div>

          ))
        }

      </div>


      {/* Filters */}

      <div
        className="
bg-white/80
backdrop-blur-xl
rounded-[30px]
shadow-xl
p-6
border
border-white
"
      >

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <FiSearch
              className="
absolute
left-5
top-1/2
-translate-y-1/2
text-gray-400
"
            />

            <input
              type="text"
              placeholder="Search projects..."
              onChange={handleSearch}
              className="
w-full
h-14
pl-14
pr-5
rounded-2xl
bg-gray-50
border-0
focus:ring-2
focus:ring-blue-500
outline-none
"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(
                e.target.value
              )
              setPage(1)
            }}
            className="
h-14
px-6
rounded-2xl
bg-gray-50
outline-none
border-0
min-w-[180px]
"
          >

            <option value="">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="On Hold">
              On Hold
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(
                e.target.value
              )
              setPage(1)
            }}
            className="
h-14
px-6
rounded-2xl
bg-gray-50
outline-none
border-0
min-w-[200px]
"
          >

            <option value="">
              All Categories
            </option>

            {
              categories.map((cat) => (

                <option
                  key={cat}
                  value={cat}
                >

                  {cat}

                </option>

              ))
            }

          </select>

        </div>

      </div>



      {/* Table */}

      {
        loading ? (

          <Loader />

        ) : (

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="
bg-white/80
backdrop-blur-xl
rounded-[35px]
shadow-2xl
border
border-white
p-6
space-y-5
"
          >

            <ProjectTable
              projects={projects}
              onEdit={openEdit}
              onDelete={(p) =>
                setDeleteTarget(p)
              }
            />

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={(p) =>
                setPage(p)
              }
            />

          </motion.div>

        )
      }

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditProject(null)
        }}
        onSubmit={
          editProject
            ? handleUpdate
            : handleCreate
        }
        project={editProject}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.projectName}"?`}
      />

    </div>
  );
};

export default Projects;
