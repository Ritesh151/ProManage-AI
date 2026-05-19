import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiFolder,
  FiFileText,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const links = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/calculator', icon: FaCalculator, label: 'Calculator' },
  { to: '/proposal', icon: FiFileText, label: 'Proposal' }
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarOpen ? 280 : 85
      }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut'
      }}
      className="
      h-screen
      fixed
      top-0
      left-0
      z-50
      flex
      flex-col
      backdrop-blur-xl
      bg-gradient-to-b
      from-white
      via-gray-50
      to-gray-100
      border-r
      border-white/50
      shadow-2xl
      overflow-hidden
      "
    >
      {/* Logo Section */}

      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PMS
              </h1>

              <p className="text-xs text-gray-500">
                Ritesh Gajjar
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
          w-10
          h-10
          rounded-xl
          bg-white
          shadow-md
          flex
          items-center
          justify-center
          hover:scale-110
          hover:shadow-xl
          transition-all
          duration-300
          "
        >
          {sidebarOpen ? (
            <FiChevronLeft size={18} />
          ) : (
            <FiChevronRight size={18} />
          )}
        </button>
      </div>

      {/* Menu */}

      <nav className="flex-1 px-3 py-6 space-y-3">

        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `
              group
              relative
              flex
              items-center
              gap-4
              px-4
              py-4
              rounded-2xl
              overflow-hidden
              transition-all
              duration-300
              
              ${isActive
                ? `
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  text-white
                  shadow-lg
                  scale-[1.02]
                  `
                : `
                  text-gray-600
                  hover:bg-white
                  hover:shadow-lg
                  hover:scale-[1.02]
                  `
              }
              `
            }
          >
            {({ isActive }) => (
              <>
                {!isActive && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-gray-100 to-white transition-all"></div>
                )}

                <div className="relative z-10">
                  <Icon size={22} />
                </div>

                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        width: 0
                      }}
                      animate={{
                        opacity: 1,
                        width: 'auto'
                      }}
                      exit={{
                        opacity: 0,
                        width: 0
                      }}
                      className="
                      relative
                      z-10
                      whitespace-nowrap
                      font-medium
                      text-sm
                      overflow-hidden
                      "
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}

      </nav>

      {/* Footer */}

      <div className="px-5 py-5 border-t border-gray-200">

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              className="
              bg-white
              rounded-2xl
              p-4
              shadow-md
              text-center
              "
            >
              <p className="text-sm text-gray-600 font-semibold">
                Made by Ritesh Gajjar
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.aside>
  );
};

export default Sidebar;