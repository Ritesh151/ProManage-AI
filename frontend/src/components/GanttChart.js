// src/components/GanttChart.js
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiChevronDown, FiChevronUp, FiZoomIn, FiZoomOut, FiRefreshCw } from 'react-icons/fi';

const COLORS = ['#2563eb', '#ec4899', '#fbbf24', '#dc2626', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#10b981', '#84cc16'];

function parseTimeline(timeline) {
  if (!timeline) return 30;
  const num = parseFloat(timeline);
  if (isNaN(num)) return 30;
  if (/month/i.test(timeline)) return Math.round(num * 30);
  if (/week/i.test(timeline)) return num * 7;
  if (/day/i.test(timeline)) return num;
  if (/year/i.test(timeline)) return num * 365;
  return num;
}

function formatDate(date, format = 'short') {
  if (format === 'short') {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const GanttChart = ({ scopeOfWork, createdAt, timeline, onRefresh }) => {
  const [expanded, setExpanded] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [hoveredTask, setHoveredTask] = useState(null);
  const chartRef = useRef(null);

  if (!scopeOfWork || scopeOfWork.length === 0) return null;

  const totalDays = parseTimeline(timeline);
  const startDate = createdAt ? new Date(createdAt) : new Date();
  const daysPerTask = totalDays / scopeOfWork.length;
  const today = new Date();

  const tasks = scopeOfWork.map((task, i) => {
    const taskStart = new Date(startDate);
    taskStart.setDate(taskStart.getDate() + Math.round(i * daysPerTask));
    const taskEnd = new Date(taskStart);
    taskEnd.setDate(taskEnd.getDate() + Math.round(daysPerTask));
    const isComplete = taskEnd < today;
    const isActive = taskStart <= today && taskEnd >= today;
    const isOverdue = taskEnd < today && !isComplete;
    return { 
      name: task, 
      start: taskStart, 
      end: taskEnd, 
      index: i,
      isComplete,
      isActive,
      isOverdue,
      duration: Math.round(daysPerTask)
    };
  });

  const allDates = tasks.flatMap((t) => [t.start, t.end]);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  const rangeMs = maxDate - minDate || 1;

  // Generate weeks with zoom support
  const weeks = [];
  let cursor = new Date(minDate);
  cursor.setDate(cursor.getDate() - cursor.getDay());
  const zoomedWeekCount = Math.ceil(12 / zoom);
  let weekCounter = 0;
  
  while (cursor <= maxDate && weekCounter < zoomedWeekCount) {
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weeks.push({ start: new Date(cursor), end: weekEnd > maxDate ? new Date(maxDate) : weekEnd });
    cursor.setDate(cursor.getDate() + Math.max(1, Math.floor(7 / zoom)));
    weekCounter++;
  }

  const completed = tasks.filter((t) => t.isComplete).length;
  const active = tasks.filter((t) => t.isActive).length;
  const overdue = tasks.filter((t) => t.isOverdue).length;
  const progress = Math.round((completed / tasks.length) * 100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
            <FiCalendar className="text-blue-600 dark:text-blue-400" size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Project Timeline</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {tasks.length} milestones · {totalDays} days · {progress}% complete
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-all"
              title="Zoom Out"
            >
              <FiZoomOut size={14} />
            </button>
            <span className="text-xs text-gray-500 min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-all"
              title="Zoom In"
            >
              <FiZoomIn size={14} />
            </button>
          </div>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-all"
              title="Refresh"
            >
              <FiRefreshCw size={14} />
            </button>
          )}
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-all"
          >
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5">
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-slate-700/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdue}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</p>
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="overflow-x-auto" ref={chartRef}>
            {/* Header row - Weeks */}
            <div className="flex mb-3 min-w-[800px]" style={{ paddingLeft: '220px' }}>
              {weeks.map((week, i) => {
                const left = ((week.start - minDate) / rangeMs) * 100 * zoom;
                const width = ((week.end - week.start) / rangeMs) * 100 * zoom;
                return (
                  <div
                    key={i}
                    className="text-[10px] text-gray-500 dark:text-gray-400 font-medium text-center shrink-0"
                    style={{ marginLeft: `${left}%`, width: `${width}%` }}
                  >
                    {formatDate(week.start, 'short')}
                  </div>
                );
              })}
            </div>

            {/* Task rows */}
            <div className="space-y-2 min-w-[800px]">
              {tasks.map((task) => {
                const left = Math.max(0, ((task.start - minDate) / rangeMs) * 100 * zoom);
                const width = Math.max(1, ((task.end - task.start) / rangeMs) * 100 * zoom);
                const color = COLORS[task.index % COLORS.length];
                
                let statusColor = color;
                let statusText = '';
                if (task.isComplete) {
                  statusColor = '#10b981';
                  statusText = '✓ Completed';
                } else if (task.isActive) {
                  statusColor = color;
                  statusText = '🔄 In Progress';
                } else if (task.isOverdue) {
                  statusColor = '#ef4444';
                  statusText = '⚠️ Overdue';
                }

                return (
                  <motion.div
                    key={task.index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: task.index * 0.03 }}
                    className="flex items-center min-h-[44px] group"
                    onMouseEnter={() => setHoveredTask(task.index)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {/* Task Name Column */}
                    <div className="w-[210px] shrink-0 pr-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={task.name}>
                        {task.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatDate(task.start)} - {formatDate(task.end)} ({task.duration} days)
                      </p>
                    </div>
                    
                    {/* Timeline Bar */}
                    <div className="flex-1 relative h-8 rounded-lg bg-gray-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.5, delay: task.index * 0.02 }}
                        className={`absolute top-1 h-6 rounded-full transition-all duration-300 ${
                          task.isComplete ? 'opacity-80' : task.isActive ? 'opacity-100 shadow-lg' : 'opacity-70'
                        }`}
                        style={{
                          left: `${left}%`,
                          backgroundColor: statusColor,
                          boxShadow: task.isActive ? `0 0 0 2px ${statusColor}40` : 'none',
                        }}
                      >
                        <div className="flex items-center h-full px-2">
                          <span className="text-[9px] text-white font-semibold truncate">
                            {formatDate(task.end, 'short')}
                          </span>
                        </div>
                      </motion.div>
                      
                      {/* Today Marker */}
                      {today >= task.start && today <= task.end && (
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                          style={{ left: `${((today - task.start) / (task.end - task.start)) * 100}%` }}
                        />
                      )}
                    </div>
                    
                    {/* Status Badge on Hover */}
                    <AnimatePresence>
                      {hoveredTask === task.index && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="absolute right-2 bg-white dark:bg-slate-800 shadow-lg rounded-lg px-2 py-1 text-xs font-medium"
                          style={{ marginLeft: '10px' }}
                        >
                          {statusText}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-pink-500"
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500 dark:text-gray-400">
              <span>Start: {formatDate(minDate)}</span>
              <span>Today: {formatDate(today)}</span>
              <span>End: {formatDate(maxDate)}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GanttChart;