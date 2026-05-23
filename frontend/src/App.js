// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Proposal from './pages/Proposal';
import ExportData from './pages/ExportData';
import AIChat from './pages/AIChat';
import { AIChatProvider } from './context/AIChatContext';
import Analytics from './pages/Analytics';
import ExportCenter from './pages/ExportCenter';
import TrainingCenter from './pages/TrainingCenter';
import TrainingHistory from './pages/TrainingHistory';
import Settings from './pages/Settings';
import ScopeOfWork from './pages/ScopeOfWork';
import NotFound from './pages/NotFound';
import { useApp } from './context/AppContext';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  const { sidebarOpen } = useApp();
  const location = useLocation();

  // Apply dark mode class to html element
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <ScrollToTop />
      <Sidebar />
      
      <motion.main
        animate={{ 
          marginLeft: sidebarOpen ? 280 : 80,
          transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
        }}
        className="min-h-screen transition-all duration-300"
      >
        <div className="p-6 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Routes location={location}>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/proposal" element={<Proposal />} />
                <Route path="/scope-work" element={<ScopeOfWork />} />
                <Route path="/analytics" element={<Analytics />} />
                
                {/* Export Routes */}
                <Route path="/export" element={<ExportData />} />
                <Route path="/export-center" element={<ExportCenter />} />
                
                {/* AI Routes */}
                <Route path="/ai" element={<AIChatProvider><AIChat /></AIChatProvider>} />
                <Route path="/training" element={<TrainingCenter />} />
                <Route path="/training-history" element={<TrainingHistory />} />
                
                {/* Settings */}
                <Route path="/settings" element={<Settings />} />
                
                {/* 404 */}
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