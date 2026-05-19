import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatters';

const CostCalculator = ({ onTotalChange, onModulesChange }) => {
  const [modules, setModules] = useState([]);
  const [selected, setSelected] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customCost, setCustomCost] = useState('');

  const toggleModule = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const addCustom = () => {
    if (!customName.trim() || !customCost) {
      toast.error('Enter module name and cost');
      return;
    }
    const newModule = {
      id: Date.now(),
      name: customName.trim(),
      cost: Number(customCost),
    };
    setModules((prev) => [...prev, newModule]);
    setSelected((prev) => [...prev, newModule.id]);
    setCustomName('');
    setCustomCost('');
    toast.success('Module added');
  };

  const removeModule = (id) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
    setSelected((prev) => prev.filter((m) => m !== id));
  };

  const totalCost = modules
    .filter((m) => selected.includes(m.id))
    .reduce((sum, m) => sum + m.cost, 0);

  useEffect(() => {
    if (onTotalChange) onTotalChange(totalCost);
  }, [totalCost, onTotalChange]);

  useEffect(() => {
    if (onModulesChange) {
      const selectedModules = modules
        .filter((m) => selected.includes(m.id))
        .map((m) => ({ name: m.name, amount: m.cost }));
      onModulesChange(selectedModules);
    }
  }, [modules, selected, onModulesChange]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <motion.div
            key={module.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected.includes(module.id)
                ? 'border-primary bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => toggleModule(module.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selected.includes(module.id)
                    ? 'bg-primary border-primary'
                    : 'border-gray-300'
                }`}>
                  {selected.includes(module.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-text">{module.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">{formatCurrency(module.cost)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeModule(module.id); }}
                  className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
          <FiPlus /> Add Module
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Module name"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            value={customCost}
            onChange={(e) => setCustomCost(e.target.value)}
            placeholder="Cost"
            className="w-40 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={addCustom}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </div>
      </div>

      <motion.div
        layout
        className="bg-gradient-to-r from-primary to-blue-700 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Estimated Cost</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(totalCost)}</p>
          </div>
          <FaRupeeSign size={48} className="opacity-30" />
        </div>
      </motion.div>
    </div>
  );
};

export default CostCalculator;
