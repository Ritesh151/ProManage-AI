import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiFileText, FiGrid } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportAPI } from '../services/api';

const ExportData = () => {
  const [loading, setLoading] = useState('');

  const handleExport = async (type, apiCall, extension) => {
    setLoading(type);
    try {
      const res = await apiCall();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `projects.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported as ${type.toUpperCase()}`);
    } catch {
      toast.error(`Failed to export ${type.toUpperCase()}`);
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
      color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      action: () => handleExport('csv', exportAPI.csv, 'csv'),
    },
    {
      type: 'excel',
      icon: FiGrid,
      label: 'Export Excel',
      desc: 'Download all projects as Excel',
      color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      action: () => handleExport('excel', exportAPI.excel, 'xlsx'),
    },
    {
      type: 'pdf',
      icon: FiFileText,
      label: 'Export PDF',
      desc: 'Download all projects as PDF',
      color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
      action: () => handleExport('pdf', exportAPI.pdf, 'pdf'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-tight">Export</h1>
        <p className="text-secondary mt-1.5">Export project data in various formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exports.map((exp, i) => (
          <motion.button
            key={exp.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={exp.action}
            disabled={loading === exp.type}
            className={`p-8 rounded-xl border-2 ${exp.color} transition-all text-left card-hover disabled:opacity-60`}
          >
            <exp.icon size={40} className="mb-4" />
            <h3 className="text-lg font-bold mb-1">{exp.label}</h3>
            <p className="text-sm opacity-80">{exp.desc}</p>
            {loading === exp.type && (
              <div className="flex items-center gap-2 mt-4 text-sm font-medium">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Exporting...
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-100"
      >
        <h2 className="font-semibold text-text mb-2">Export Information</h2>
        <ul className="text-sm text-secondary space-y-2">
          <li>CSV export includes all project fields</li>
          <li>Excel export creates a formatted spreadsheet</li>
          <li>PDF export generates a professional report</li>
          <li>All exports include all projects in the database</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default ExportData;
