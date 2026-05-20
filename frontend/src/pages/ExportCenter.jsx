import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { ExportCard } from '../components/ExportCard';
import { EmptyState } from '../components/EmptyState';
import { useExport } from '../hooks/useExport';

const ExportCenter = () => {
  const { history, exporting, exportToPDF, exportToDOCX, exportToCSV, exportToExcel } = useExport();
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const handleExport = async () => {
    const mockData = {
      title: 'Export Data',
      content: 'Sample export content',
      timestamp: new Date(),
    };

    switch (selectedFormat) {
      case 'pdf':
        await exportToPDF(mockData);
        break;
      case 'docx':
        await exportToDOCX(mockData);
        break;
      case 'csv':
        await exportToCSV(mockData);
        break;
      case 'excel':
        await exportToExcel(mockData);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Export Center"
        description="Export your data in multiple formats"
        icon={FiDownload}
      />

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Format</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'pdf', label: 'PDF', icon: FiFile },
                { id: 'docx', label: 'Word', icon: FiFileText },
                { id: 'csv', label: 'CSV', icon: FiFile },
                { id: 'excel', label: 'Excel', icon: FiFile },
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFormat === format.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <format.icon size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">{format.label}</p>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {exporting ? 'Exporting...' : 'Export Now'}
          </button>
        </div>
      </motion.div>

      {/* Export History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
        {history.length === 0 ? (
          <EmptyState
            icon={FiDownload}
            title="No exports yet"
            description="Start by exporting your data in your preferred format"
          />
        ) : (
          <div className="space-y-3">
            {history.map((exp) => (
              <ExportCard key={exp.id} export={exp} onRetry={() => {}} onDelete={() => {}} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ExportCenter;
