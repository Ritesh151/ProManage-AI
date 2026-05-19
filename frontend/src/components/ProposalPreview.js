import React from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';

const ProposalPreview = ({ html, onDownloadPDF, onDownloadWord, loading }) => {
  if (!html) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
        <FiFileText className="mx-auto text-gray-300" size={48} />
        <p className="text-secondary mt-4 text-lg">No proposal generated</p>
        <p className="text-secondary text-sm mt-1">Select a project and generate a proposal</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Proposal Preview</h2>
        <div className="flex gap-3">
          <button
            onClick={onDownloadPDF}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <FiDownload size={16} /> PDF
          </button>
          <button
            onClick={onDownloadWord}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <FiDownload size={16} /> DOCX
          </button>
        </div>
      </div>
      <div
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        style={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <div className="p-8" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default ProposalPreview;
