import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiFile } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import ProposalPreview from '../components/ProposalPreview';
import { proposalAPI } from '../services/api';
import Loader from '../components/Loader';

const Proposal = () => {
  const [searchParams] = useSearchParams();
  const [projectId, setProjectId] = useState(searchParams.get('id') || '');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const projectIdRef = useRef(projectId);
  projectIdRef.current = projectId;

  const handleGenerate = async (id) => {
    const pid = id || projectIdRef.current;
    if (!pid) {
      toast.error('Enter a project ID');
      return;
    }
    setLoading(true);
    try {
      const res = await proposalAPI.generate(pid);
      setHtml(res.data.data.html);
      setProjectName(res.data.data.project.projectName);
      toast.success('Proposal generated');
    } catch {
      setHtml('');
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
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await proposalAPI.downloadPDF(projectId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${projectName || 'proposal'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await proposalAPI.downloadWord(projectId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${projectName || 'proposal'}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('DOCX downloaded');
    } catch {
      toast.error('Failed to download DOCX');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Proposal Generator
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Generate and download project proposals
        </p>
      </motion.div>

      {/* Generate Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <FiFileText
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter Project ID..."
              className="
                w-full
                h-12
                pl-11
                pr-4
                rounded-lg
                bg-gray-50
                border
                border-gray-200
                outline-none
                focus:ring-2
                focus:ring-gray-300
                focus:border-transparent
                text-gray-700
                text-sm
                placeholder:text-gray-400
              "
            />
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !projectId}
            className="
              h-12
              px-6
              rounded-lg
              bg-gray-900
              text-white
              text-sm
              font-medium
              hover:bg-gray-800
              transition-all
              duration-200
              disabled:opacity-50
              disabled:hover:bg-gray-900
              flex
              items-center
              justify-center
              gap-2
              shadow-sm
            "
          >
            <FiFileText size={16} />
            Generate
          </button>
        </div>
      </motion.div>

      {/* Preview Section */}
      {loading && !html ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10">
          <Loader />
        </div>
      ) : html && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Proposal Preview
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Preview and export generated proposal
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="
                  px-3
                  py-1.5
                  rounded-md
                  bg-gray-50
                  text-gray-600
                  text-sm
                  font-medium
                  hover:bg-gray-100
                  transition-all
                  duration-200
                  flex
                  items-center
                  gap-1.5
                "
              >
                <FiDownload size={14} />
                PDF
              </button>
              <button
                onClick={handleDownloadWord}
                disabled={loading}
                className="
                  px-3
                  py-1.5
                  rounded-md
                  bg-gray-50
                  text-gray-600
                  text-sm
                  font-medium
                  hover:bg-gray-100
                  transition-all
                  duration-200
                  flex
                  items-center
                  gap-1.5
                "
              >
                <FiFile size={14} />
                DOCX
              </button>
            </div>
          </div>

          <div className="p-6">
            <ProposalPreview
              html={html}
              onDownloadPDF={handleDownloadPDF}
              onDownloadWord={handleDownloadWord}
              loading={loading}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Proposal;