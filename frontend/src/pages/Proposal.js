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
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 space-y-8">

      {/* Header */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >

        <h1
          className="
text-4xl
font-bold
bg-gradient-to-r
from-blue-600
via-purple-600
to-pink-500
bg-clip-text
text-transparent
"
        >

          Proposal Generator

        </h1>

        <p className="text-gray-500 mt-2">

          Generate and download project proposals

        </p>

      </motion.div>



      {/* Generate Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
bg-white/80
backdrop-blur-xl
rounded-[35px]
shadow-2xl
border
border-white
p-8
"
      >

        <div
          className="
flex
flex-col
lg:flex-row
gap-4
"
        >

          <div
            className="
relative
flex-1
"
          >

            <FiFileText
              size={20}
              className="
absolute
left-5
top-1/2
-translate-y-1/2
text-gray-400
"
            />

            <input
              type="text"
              value={projectId}
              onChange={(e) =>
                setProjectId(
                  e.target.value
                )
              }
              placeholder="Enter Project ID..."
              className="
w-full
h-16
pl-14
pr-5
rounded-2xl
bg-gray-50
border-0
outline-none
focus:ring-2
focus:ring-blue-500
text-gray-700
placeholder:text-gray-400
"
            />

          </div>

          <button
            onClick={() =>
              handleGenerate()
            }
            disabled={
              loading ||
              !projectId
            }
            className="
h-16
px-8
rounded-2xl
text-white
font-medium
bg-gradient-to-r
from-blue-600
to-purple-600
shadow-xl
hover:scale-105
hover:shadow-2xl
transition-all
duration-300
disabled:opacity-50
disabled:hover:scale-100
flex
items-center
justify-center
gap-3
"
          >

            <FiFileText
              size={18}
            />

            Generate

          </button>

        </div>

      </motion.div>




      {/* Preview Section */}

      {

        loading && !html ? (

          <div
            className="
bg-white/80
backdrop-blur-xl
rounded-[35px]
shadow-xl
border
border-white
p-10
"
          >

            <Loader />

          </div>

        ) : (

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}
            className="
bg-white/80
backdrop-blur-xl
rounded-[35px]
shadow-2xl
border
border-white
overflow-hidden
"
          >

            <div
              className="
flex
justify-between
items-center
px-8
py-6
border-b
border-gray-100
"
            >

              <div>

                <h2
                  className="
text-xl
font-bold
text-gray-800
"
                >

                  Proposal Preview

                </h2>

                <p
                  className="
text-sm
text-gray-500
mt-1
"
                >

                  Preview and export generated proposal

                </p>

              </div>

            </div>

            <div className="p-8">

              <ProposalPreview
                html={html}
                onDownloadPDF={
                  handleDownloadPDF
                }
                onDownloadWord={
                  handleDownloadWord
                }
                loading={loading}
              />

            </div>

          </motion.div>

        )

      }

    </div>
  );
};

export default Proposal;
