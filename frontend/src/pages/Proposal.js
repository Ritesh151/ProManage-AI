// src/pages/Proposal.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiFile, FiPrinter, FiCopy, FiCheck, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ProposalPreview from '../components/ProposalPreview';
import { proposalAPI } from '../services/api';
import Loader from '../components/Loader';

const Proposal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(searchParams.get('id') || '');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [copied, setCopied] = useState(false);
  const projectIdRef = useRef(projectId);
  projectIdRef.current = projectId;
  const previewRef = useRef(null);

  const handleGenerate = async (id) => {
    const pid = id || projectIdRef.current;
    if (!pid) {
      toast.error('Please enter a Project ID');
      return;
    }
    setLoading(true);
    try {
      const res = await proposalAPI.generate(pid);
      setHtml(res.data.data.html);
      setProjectName(res.data.data.project.projectName);
      toast.success('Proposal generated successfully');
    } catch (error) {
      console.error('Generation error:', error);
      setHtml('');
      toast.error(error.response?.data?.message || 'Failed to generate proposal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProjectId(id);
      handleGenerate(id);
    }
  }, [searchParams]);

  const handleDownloadPDF = async () => {
    if (!previewRef.current || !html) {
      toast.error('No proposal to download');
      return;
    }
    setLoading(true);
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${projectName || 'proposal'}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!projectId) {
      toast.error('No project selected');
      return;
    }
    setLoading(true);
    try {
      const res = await proposalAPI.downloadWord(projectId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${projectName || 'proposal'}_${new Date().toISOString().split('T')[0]}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('DOCX downloaded successfully');
    } catch (error) {
      console.error('Word export error:', error);
      toast.error('Failed to download DOCX');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!html) {
      toast.error('No proposal to print');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${projectName || 'Proposal'} - Print</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              margin: 0;
              line-height: 1.6;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${html}
          <script>
            window.onload = () => { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      toast.success('HTML copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy HTML');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-4 sm:px-6 md:px-8 py-6 md:py-8">
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl md:rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-all"
                >
                  <FiArrowLeft size={20} />
                </button>
                <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                  <FiFileText size={20} className="text-blue-600 dark:text-blue-400 md:w-6 md:h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Proposal Generator
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                    Generate and download professional project proposals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Generate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl md:rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg p-5 md:p-6 mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiFileText
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Enter Project ID..."
                className="
                  w-full
                  h-11 md:h-12
                  pl-10 md:pl-11
                  pr-4
                  rounded-xl
                  bg-white/50
                  dark:bg-slate-800/50
                  border
                  border-gray-200
                  dark:border-slate-700
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500/20
                  focus:border-blue-500
                  text-gray-700
                  dark:text-gray-300
                  text-sm
                  placeholder:text-gray-400
                  dark:placeholder:text-gray-500
                  transition-all
                "
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGenerate()}
                disabled={loading || !projectId}
                className="
                  flex-1 sm:flex-none
                  h-11 md:h-12
                  px-5 md:px-6
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-pink-500
                  text-white
                  text-sm
                  font-semibold
                  hover:shadow-lg
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:hover:shadow-none
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiFileText size={16} />
                    Generate Proposal
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>AI-powered generation</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Professional templates</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Multiple formats</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Section */}
        <AnimatePresence mode="wait">
          {loading && !html ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl md:rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg p-8 md:p-12"
            >
              <Loader />
            </motion.div>
          ) : html ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl md:rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden"
            >
              {/* Preview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-500/5 to-pink-500/5">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    Proposal Preview
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {projectName && `Project: ${projectName}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyHTML}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                    Copy
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <FiPrinter size={14} />
                    Print
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadWord}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <FiFile size={14} />
                    DOCX
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadPDF}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiDownload size={14} />
                    )}
                    PDF
                  </motion.button>
                </div>
              </div>

              {/* Proposal Content */}
              <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div ref={previewRef}>
                  <ProposalPreview
                    html={html}
                    onDownloadPDF={handleDownloadPDF}
                    onDownloadWord={handleDownloadWord}
                    loading={loading}
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && !html && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl md:rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg p-8 md:p-12 text-center"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 flex items-center justify-center">
              <FiFileText size={28} className="text-gray-400 dark:text-gray-500 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Proposal Generated
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Enter a Project ID above and click "Generate Proposal" to create a professional proposal.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Proposal;
