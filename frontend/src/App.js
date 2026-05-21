import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Proposal from './pages/Proposal';
import ExportData from './pages/ExportData';
import AIChat from './pages/AIChat';
import Analytics from './pages/Analytics';
import ExportCenter from './pages/ExportCenter';
import TrainingCenter from './pages/TrainingCenter';
import KnowledgeBase from './pages/KnowledgeBase';
import SemanticSearch from './pages/SemanticSearch';
import TrainingHistory from './pages/TrainingHistory';
import Settings from './pages/Settings';
import ScopeOfWork from './pages/ScopeOfWork';
import NotFound from './pages/NotFound';
import { useApp } from './context/AppContext';

function App() {
  const { sidebarOpen } = useApp();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        className="min-h-screen transition-all duration-300"
      >
        <div className="p-6 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/proposal" element={<Proposal />} />
                <Route path="/scope-work" element={<ScopeOfWork />} />
                <Route path="/export" element={<ExportData />} />
                <Route path="/ai" element={<AIChat />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/export-center" element={<ExportCenter />} />
                <Route path="/training" element={<TrainingCenter />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/search" element={<SemanticSearch />} />
                <Route path="/training-history" element={<TrainingHistory />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}

export default App;
