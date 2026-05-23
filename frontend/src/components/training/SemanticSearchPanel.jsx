import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiDatabase, FiChevronDown, FiChevronUp, FiFile } from 'react-icons/fi';
import { GlassCard } from './GlassCard';
import { trainingService } from '../../services/trainingService';

const ResultCard = ({ result, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-white/10 bg-slate-800/60 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/5"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 text-sm font-bold">
            #{index + 1}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{result.filename}</p>
            <p className="flex items-center gap-1 text-xs text-cyan-400/80">
              <FiDatabase size={10} /> Retrieved from Vector DB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-lg font-bold text-emerald-400">{result.scorePercent}%</p>
            <p className="text-[10px] text-slate-500">relevance</p>
          </div>
          {expanded ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
        </div>
      </button>

      <div className="px-4 pb-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.scorePercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 px-4 py-3"
          >
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-xs">
              {(result.highlight || result.content || '').replace(/\*\*/g, '')}
            </p>
            {result.sourceFile && (
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <FiFile size={12} />
                <span className="truncate">{result.sourceFile}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SemanticSearchPanel = () => {
  const [query, setQuery] = useState('How does proposal generation work?');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await trainingService.semanticSearch(query.trim());
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-5" glow>
      <div className="mb-4 flex items-center gap-2">
        <FiSearch className="text-purple-400" size={20} />
        <h3 className="font-bold text-white">Semantic Search Testing</h3>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="How does proposal generation work?"
          className="flex-1 rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </motion.button>
      </form>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {results?.results?.length > 0 ? (
          results.results.map((r, i) => <ResultCard key={r.id || i} result={r} index={i} />)
        ) : results && !loading ? (
          <p className="text-center text-slate-500 py-8">No chunks retrieved. Run training first.</p>
        ) : (
          <p className="text-center text-slate-600 text-sm py-6">
            Test vector retrieval against your knowledge base
          </p>
        )}
      </div>
    </GlassCard>
  );
};
