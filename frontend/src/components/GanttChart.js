import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#ec4899', '#06b6d4', '#84cc16'];

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

function formatDate(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const GanttChart = ({ scopeOfWork, createdAt, timeline }) => {
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
    return { name: task, start: taskStart, end: taskEnd, index: i };
  });

  const allDates = tasks.flatMap((t) => [t.start, t.end]);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  const rangeMs = maxDate - minDate || 1;
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  const weeks = [];
  let cursor = new Date(minDate);
  cursor.setDate(cursor.getDate() - cursor.getDay());
  while (cursor <= maxDate) {
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weeks.push({ start: new Date(cursor), end: weekEnd > maxDate ? new Date(maxDate) : weekEnd });
    cursor.setDate(cursor.getDate() + 7);
  }

  const completed = tasks.filter((t) => t.end < today).length;
  const progress = Math.round((completed / tasks.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50">
            <FiCalendar className="text-gray-500" size={15} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Project Timeline</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {tasks.length} milestones &middot; {totalDays} days &middot; {progress}% complete
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatDate(minDate)}</span>
          <span className="text-xs text-gray-300">—</span>
          <span className="text-xs text-gray-400">{formatDate(maxDate)}</span>
        </div>
      </div>

      <div className="p-5">
        {/* Header row */}
        <div className="flex mb-2" style={{ paddingLeft: '200px' }}>
          {weeks.map((week, i) => {
            const left = ((week.start - minDate) / rangeMs) * 100;
            const width = ((week.end - week.start) / rangeMs) * 100;
            return (
              <div
                key={i}
                className="text-[10px] text-gray-400 font-medium text-center shrink-0"
                style={{ marginLeft: `${left}%`, width: `${width}%` }}
              >
                {week.start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            );
          })}
        </div>

        {/* Task rows */}
        <div className="space-y-2">
          {tasks.map((task) => {
            const left = Math.max(0, ((task.start - minDate) / rangeMs) * 100);
            const width = Math.max(1, ((task.end - task.start) / rangeMs) * 100);
            const isComplete = task.end < today;
            const isActive = task.start <= today && task.end >= today;
            const color = COLORS[task.index % COLORS.length];

            return (
              <div key={task.index} className="flex items-center min-h-[36px]">
                <div className="w-[190px] shrink-0 pr-3">
                  <p className="text-xs text-gray-700 truncate font-medium" title={task.name}>
                    {task.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {formatDate(task.start)} - {formatDate(task.end)}
                  </p>
                </div>
                <div className="flex-1 relative h-7 rounded-md bg-gray-50 overflow-hidden">
                  <div
                    className={`absolute top-1 h-5 rounded-full transition-all duration-500 ${
                      isComplete ? 'opacity-80' : isActive ? 'opacity-100' : 'opacity-60'
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: color,
                      boxShadow: isActive ? `0 0 0 2px ${color}33` : 'none',
                    }}
                  >
                    <div className="flex items-center h-full px-2">
                      <span className="text-[9px] text-white font-semibold truncate">
                        {task.end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Overall Progress</span>
            <span className="text-xs font-semibold text-gray-700">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
