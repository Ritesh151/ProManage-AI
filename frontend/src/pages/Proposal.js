import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-tight">Proposal</h1>
        <p className="text-secondary mt-1.5">Generate and download project proposals</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-100"
      >
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter project ID..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !projectId}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <FiFileText size={18} /> Generate
          </button>
        </div>
      </motion.div>

      {loading && !html ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProposalPreview
            html={html}
            onDownloadPDF={handleDownloadPDF}
            onDownloadWord={handleDownloadWord}
            loading={loading}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Proposal;
