import React from 'react';
import { motion } from 'framer-motion';

/**
 * CSS-based neural particle background (avoids tsparticles version conflicts)
 */
export const ParticleBackground = () => {
  const nodes = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 95}%`,
    top: `${(i * 23 + 11) % 90}%`,
    delay: (i % 5) * 0.4,
    size: 2 + (i % 3),
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full bg-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
          style={{
            left: node.left,
            top: node.top,
            width: node.size,
            height: node.size,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + node.delay,
            repeat: Infinity,
            delay: node.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={`${10 + i * 18}%`}
            y1="20%"
            x2={`${30 + i * 15}%`}
            y2="80%"
            stroke="url(#lineGrad)"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}
      </svg>

      {/* Ambient glow orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl"
      />
    </div>
  );
};
