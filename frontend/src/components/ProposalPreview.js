// src/components/ProposalPreview.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiFileText, FiPrinter, FiCopy, FiCheck, FiLoader, FiEye, FiZoomIn } from 'react-icons/fi';

const ProposalPreview = ({ html, onDownloadPDF, onDownloadWord, loading }) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proposal Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; margin: 0; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!html) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-12 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center">
          <FiFileText size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">No proposal generated</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Select a project and generate a proposal to preview it here</p>
      </motion.div>
    );
  }

  const PreviewContent = () => (
    <div className="relative">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
          >
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Generating proposal...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="proposal-content bg-white dark:bg-white rounded-xl overflow-auto"
        style={{ maxHeight: isFullscreen ? 'calc(100vh - 200px)' : '60vh' }}
      >
        <div className="p-8" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-blue-500/5 to-pink-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
            <FiEye size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Proposal Preview</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Review and download your proposal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <FiZoomIn size={16} />
          </motion.button>

          {/* Copy HTML */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyHTML}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
            title="Copy HTML"
          >
            {copied ? <FiCheck size={16} className="text-green-500" /> : <FiCopy size={16} />}
          </motion.button>

          {/* Print */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
            title="Print"
          >
            <FiPrinter size={16} />
          </motion.button>

          {/* Download PDF */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDownloadPDF}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiDownload size={14} />
            )}
            PDF
          </motion.button>

          {/* Download DOCX */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDownloadWord}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiDownload size={14} />
            )}
            DOCX
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className={isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-4' : ''}>
        {isFullscreen && (
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
            >
              <FiZoomIn size={18} />
            </motion.button>
          </div>
        )}
        <PreviewContent />
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 border-t border-white/20 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Ready to download</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText size={12} />
            <span>HTML / PDF / DOCX formats available</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalPreview;