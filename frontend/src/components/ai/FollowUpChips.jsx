import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

export const FollowUpChips = ({ suggestions = [], onSelect }) => {
  if (!suggestions?.length) return null;

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Suggested follow-ups</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect?.(q)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-violet-500/15 border border-violet-500/30 text-violet-200 hover:bg-violet-500/25 transition-colors text-left max-w-full"
          >
            <span className="truncate">{q}</span>
            <FiChevronRight size={12} className="shrink-0 opacity-60" />
          </button>
        ))}
      </div>
    </div>
  );
};
