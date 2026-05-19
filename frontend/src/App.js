import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Calculator from './pages/Calculator';
import Proposal from './pages/Proposal';
import ExportData from './pages/ExportData';
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
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/proposal" element={<Proposal />} />
                <Route path="/export" element={<ExportData />} />
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
