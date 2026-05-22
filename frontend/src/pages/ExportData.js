// src/pages/ExportData.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiFileText, FiGrid, FiDownload, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportAPI } from '../services/api';

const ExportData = () => {
  const [loading, setLoading] = useState('');
  const [exportHistory, setExportHistory] = useState([]);

  const handleExport = async (type, apiCall, extension) => {
    setLoading(type);
    try {
      const res = await apiCall();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `projects_${new Date().toISOString().slice(0,19)}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      // Add to export history
      setExportHistory(prev => [{
        id: Date.now(),
        type,
        fileName: `projects_${new Date().toISOString().slice(0,19)}.${extension}`,
        timestamp: new Date(),
        status: 'completed'
      }, ...prev].slice(0, 5));
      
      toast.success(`Exported as ${type.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to export ${type.toUpperCase()}`);
      console.error('Export error:', error);
    } finally {
      setLoading('');
    }
  };

  const exports = [
    {
      type: 'csv',
      icon: FiFile,
      label: 'Export CSV',
      desc: 'Download all projects as CSV',
      features: ['Compatible with Excel', 'Lightweight format', 'Easy to manipulate'],
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-200 dark:border-green-800/30',
      color: 'text-green-600 dark:text-green-400',
      action: () => handleExport('csv', exportAPI.csv, 'csv'),
    },
    {
      type: 'excel',
      icon: FiGrid,
      label: 'Export Excel',
      desc: 'Download all projects as Excel',
      features: ['Formatted spreadsheet', 'Multiple sheets', 'Advanced filtering'],
      gradient: 'from-blue-600 to-indigo-600',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      borderColor: 'border-blue-200 dark:border-blue-800/30',
      color: 'text-blue-600 dark:text-blue-400',
      action: () => handleExport('excel', exportAPI.excel, 'xlsx'),
    },
    {
      type: 'pdf',
      icon: FiFileText,
      label: 'Export PDF',
      desc: 'Download all projects as PDF',
      features: ['Professional report', 'Print-ready format', 'Shareable document'],
      gradient: 'from-red-600 to-orange-600',
      bgGradient: 'from-red-500/10 to-orange-500/10',
      borderColor: 'border-red-200 dark:border-red-800/30',
      color: 'text-red-600 dark:text-red-400',
      action: () => handleExport('pdf', exportAPI.pdf, 'pdf'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
              <FiDownload size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Export Center
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Export project data in various formats
              </p>
            </div>
          </div>
        </motion.div>

        {/* Export Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {exports.map((exp) => (
            <motion.div
              key={exp.type}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${exp.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              <button
                onClick={exp.action}
                disabled={loading === exp.type}
                className={`relative w-full p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border ${exp.borderColor} hover:shadow-2xl transition-all duration-300 text-left overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {/* Top Border Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${exp.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Background Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${exp.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`p-3 rounded-xl ${exp.bgGradient} inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <exp.icon size={32} className={exp.color} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${exp.color}`}>
                    {exp.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {exp.desc}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2 mb-4">
                    {exp.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <FiCheckCircle size={10} className={exp.color} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {loading === exp.type && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className={`text-sm font-medium ${exp.color}`}>Exporting...</span>
                    </div>
                  )}
                </div>

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 dark:from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Export Information & History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Information Card */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                  <FiInfo size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  Export Information
                </h2>
              </div>
              <ul className="space-y-3">
                {[
                  'CSV export includes all project fields - compatible with Excel and Google Sheets',
                  'Excel export creates a formatted spreadsheet with multiple sheets and advanced styling',
                  'PDF export generates a professional report perfect for sharing and printing',
                  'All exports include all projects from your current filtered view',
                  'Export files are automatically named with timestamp for easy tracking'
                ].map((info, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-pink-500 mt-1.5 flex-shrink-0" />
                    <span>{info}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Export History Card */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                  <FiDownload size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  Recent Exports
                </h2>
              </div>
              
              {exportHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 flex items-center justify-center">
                    <FiDownload size={20} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No exports yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your recent exports will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map((exp, idx) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                          <FiCheckCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {exp.fileName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(exp.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium uppercase">
                        {exp.type}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExportData;