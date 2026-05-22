// src/pages/ExportCenter.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, FiFileText, FiFile, FiGrid, FiTable, FiBookOpen, 
  FiCheck, FiAlertCircle, FiTrendingUp, FiClock, FiSettings
} from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { ExportCard } from '../components/ExportCard';
import { EmptyState } from '../components/EmptyState';
import { useExport } from '../hooks/useExport';

const ExportCenter = () => {
  const { history, exporting, exportToPDF, exportToDOCX, exportToCSV, exportToExcel } = useExport();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeDate: true,
    includeTimestamp: true,
    format: 'A4'
  });

  const handleExport = async () => {
    const exportData = {
      title: 'Export Data',
      content: 'Sample export content',
      timestamp: new Date(),
      options: exportOptions
    };

    switch (selectedFormat) {
      case 'pdf':
        await exportToPDF(exportData);
        break;
      case 'docx':
        await exportToDOCX(exportData);
        break;
      case 'csv':
        await exportToCSV(exportData);
        break;
      case 'excel':
        await exportToExcel(exportData);
        break;
      default:
        break;
    }
  };

  const formats = [
    { id: 'pdf', label: 'PDF', icon: FiFile, description: 'Portable Document Format', color: 'from-red-600 to-orange-500' },
    { id: 'docx', label: 'Word', icon: FiFileText, description: 'Microsoft Word Document', color: 'from-blue-600 to-indigo-500' },
    { id: 'csv', label: 'CSV', icon: FiTable, description: 'Comma Separated Values', color: 'from-green-600 to-emerald-500' },
    { id: 'excel', label: 'Excel', icon: FiGrid, description: 'Excel Spreadsheet', color: 'from-emerald-600 to-teal-500' },
  ];

  const selectedFormatData = formats.find(f => f.id === selectedFormat);

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

      <div className="relative z-10 space-y-8">
        <PageHeader
          title="Export Center"
          description="Export your data in multiple formats with advanced options"
          icon={FiDownload}
          badge="v2.0"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Options Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                    <FiDownload size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                      Export Configuration
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Select format and customize your export
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Format
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formats.map((format) => {
                      const Icon = format.icon;
                      const isSelected = selectedFormat === format.id;
                      return (
                        <motion.button
                          key={format.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedFormat(format.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? `border-${format.id === 'pdf' ? 'red' : format.id === 'docx' ? 'blue' : format.id === 'csv' ? 'green' : 'emerald'}-500 bg-gradient-to-br from-${format.id === 'pdf' ? 'red' : format.id === 'docx' ? 'blue' : format.id === 'csv' ? 'green' : 'emerald'}-500/10 to-transparent`
                              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <Icon size={28} className={`mx-auto mb-2 ${isSelected ? `text-${format.id === 'pdf' ? 'red' : format.id === 'docx' ? 'blue' : format.id === 'csv' ? 'green' : 'emerald'}-600` : 'text-gray-500'}`} />
                          <p className="text-sm font-semibold">{format.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{format.description}</p>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                            >
                              <FiCheck size={12} className="text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Export Options */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <FiSettings size={14} />
                      Export Options
                    </div>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 cursor-pointer">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Include Date in Filename</span>
                      <input
                        type="checkbox"
                        checked={exportOptions.includeDate}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeDate: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 cursor-pointer">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Include Timestamp</span>
                      <input
                        type="checkbox"
                        checked={exportOptions.includeTimestamp}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeTimestamp: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    {selectedFormat === 'pdf' && (
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Paper Size</label>
                        <select
                          value={exportOptions.format}
                          onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="A4">A4</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Export Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                  disabled={exporting}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${selectedFormatData?.color} text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FiDownload size={16} />
                      Export as {selectedFormatData?.label}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Export History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                      <FiClock size={18} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                        Export History
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Your recent exports
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>{history.length} exports</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {history.length === 0 ? (
                  <EmptyState
                    icon={FiDownload}
                    title="No exports yet"
                    description="Start by exporting your data in your preferred format"
                    size="sm"
                    variant="primary"
                  />
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {history.map((exp, index) => (
                      <ExportCard 
                        key={exp.id} 
                        export={exp} 
                        onRetry={() => {}} 
                        onDelete={() => {}}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Format Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                    <FiBookOpen size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">About {selectedFormatData?.label} Export</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    {selectedFormat === 'pdf' && 'PDF exports are perfect for sharing and printing. They maintain formatting across all devices.'}
                    {selectedFormat === 'docx' && 'Word documents are editable and great for further customization or collaboration.'}
                    {selectedFormat === 'csv' && 'CSV files are lightweight and compatible with Excel, Google Sheets, and databases.'}
                    {selectedFormat === 'excel' && 'Excel spreadsheets support formulas, multiple sheets, and advanced data analysis.'}
                  </p>
                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs">
                      <FiTrendingUp size={12} className="text-green-500" />
                      <span className="text-gray-500">Pro tip: Schedule regular exports for backups</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <FiTrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Quick Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Exports</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{history.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Successful</span>
                    <span className="text-lg font-bold text-green-600">{history.filter(h => h.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Failed</span>
                    <span className="text-lg font-bold text-red-600">{history.filter(h => h.status === 'failed').length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportCenter;
