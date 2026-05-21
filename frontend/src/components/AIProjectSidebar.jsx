/**
 * AI Project Sidebar Component
 * Shows projects and training status
 */

import React from 'react';
import { FiChevronDown, FiRefreshCw, FiClock as FiHistory } from 'react-icons/fi';
import './AIProjectSidebar.css';

const AIProjectSidebar = ({
  projects,
  selectedProject,
  onSelectProject,
  status,
  onTrain,
  onShowHistory,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in_progress':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#999';
    }
  };

  return (
    <div className="ai-sidebar">
      {/* Status Card */}
      <div className="ai-status-card">
        <h3>📊 Status</h3>
        {status ? (
          <div className="ai-status-content">
            <div className="ai-status-item">
              <span className="ai-status-label">Documents:</span>
              <span className="ai-status-value">{status.documents}</span>
            </div>
            <div className="ai-status-item">
              <span className="ai-status-label">Processed:</span>
              <span className="ai-status-value">{status.processedDocuments}</span>
            </div>
            <div className="ai-status-item">
              <span className="ai-status-label">Chunks:</span>
              <span className="ai-status-value">{status.totalChunks}</span>
            </div>
            <div className="ai-status-item">
              <span className="ai-status-label">Projects:</span>
              <span className="ai-status-value">{status.projects}</span>
            </div>
            {status.currentSession && (
              <div className="ai-session-info">
                <div className="ai-session-status">
                  <span
                    className="ai-status-dot"
                    style={{ backgroundColor: getStatusColor(status.currentSession.status) }}
                  ></span>
                  <span>{status.currentSession.status}</span>
                </div>
                <div className="ai-session-progress">
                  <div className="ai-progress-bar">
                    <div
                      className="ai-progress-fill"
                      style={{
                        width: `${
                          (status.currentSession.filesProcessed /
                            (status.currentSession.totalFiles || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="ai-progress-text">
                    {status.currentSession.filesProcessed}/{status.currentSession.totalFiles}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="ai-loading">Loading...</p>
        )}
      </div>

      {/* Actions */}
      <div className="ai-actions">
        <button className="ai-action-btn" onClick={onTrain} title="Train AI">
          <FiRefreshCw /> Train AI
        </button>
        <button className="ai-action-btn" onClick={onShowHistory} title="Show history">
          <FiHistory /> History
        </button>
      </div>

      {/* Projects */}
      <div className="ai-projects-section">
        <h3>🏗️ Projects ({projects.length})</h3>
        <div className="ai-projects-list">
          {projects.length === 0 ? (
            <p className="ai-no-projects">No projects found</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.path}
                className={`ai-project-item ${
                  selectedProject?.path === project.path ? 'active' : ''
                }`}
                onClick={() => onSelectProject(project)}
              >
                <div className="ai-project-header">
                  <span className="ai-project-name">{project.name}</span>
                  <span className="ai-project-type">{project.type}</span>
                </div>
                <div className="ai-project-meta">
                  <span className="ai-project-files">{project.fileCount} files</span>
                  <span
                    className="ai-project-status"
                    style={{ color: getStatusColor(project.status) }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="ai-info">
        <p>💡 Tip: Train the AI to index all your projects and enable intelligent search.</p>
      </div>
    </div>
  );
};

export default AIProjectSidebar;
