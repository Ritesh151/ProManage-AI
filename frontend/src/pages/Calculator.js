import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CostCalculator from '../components/CostCalculator';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';

const Calculator = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState([]);
  const [projectName, setProjectName] = useState('');
  const { createProject } = useApp();
  const navigate = useNavigate();

  const handleTotalChange = useCallback((cost) => {
    setTotalCost(cost);
  }, []);

  const handleModulesChange = useCallback((modules) => {
    setCostBreakdown(modules);
  }, []);

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      toast.error('Enter a project name');
      return;
    }
    if (totalCost === 0) {
      toast.error('Select at least one module');
      return;
    }
    try {
      await createProject({
        projectName: projectName.trim(),
        cost: totalCost,
        costBreakdown,
        status: 'Active',
      });
      toast.success('Project created');
      navigate('/projects');
    } catch {
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-tight">Cost Calculator</h1>
        <p className="text-secondary mt-1.5">Estimate project costs by adding modules</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSaveProject}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2"
          >
            <FiSave size={18} /> Save Project
          </button>
        </div>

        <CostCalculator onTotalChange={handleTotalChange} onModulesChange={handleModulesChange} />
      </motion.div>
    </div>
  );
};

export default Calculator;
