import React, { useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

const NODE_CONFIG = [
  { id: 'source', label: 'Source Files', x: 0, y: 120 },
  { id: 'chunks', label: 'Source Chunks', x: 220, y: 120 },
  { id: 'engine', label: 'Embedding Engine', x: 440, y: 120 },
  { id: 'vector', label: 'Vector Database', x: 660, y: 120 },
  { id: 'retrieval', label: 'AI Retrieval Layer', x: 880, y: 120 },
  { id: 'chat', label: 'Chat Availability', x: 1100, y: 120 },
];

const nodeStyle = (active, status) => ({
  padding: '12px 16px',
  borderRadius: 12,
  border: active ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.12)',
  background: active
    ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.2))'
    : 'rgba(15,23,42,0.9)',
  color: '#e2e8f0',
  fontSize: 12,
  fontWeight: 600,
  boxShadow: active ? '0 0 24px rgba(59,130,246,0.4)' : 'none',
  minWidth: 140,
  textAlign: 'center',
});

const STATUS_MAP = {
  reading: 'source',
  chunked: 'chunks',
  embedding: 'engine',
  stored: 'vector',
  available: 'chat',
};

export const BrainFlowGraph = ({ flow, training }) => {
  const activeNode = flow?.status ? STATUS_MAP[flow.status] || 'source' : training ? 'source' : null;

  const initialNodes = useMemo(
    () =>
      NODE_CONFIG.map((n) => ({
        id: n.id,
        position: { x: n.x, y: n.y },
        data: {
          label: (
            <div>
              <div>{n.label}</div>
              {activeNode === n.id && flow?.sourceFile && (
                <div className="mt-1 truncate text-[10px] font-normal text-cyan-300/80 max-w-[130px]">
                  {flow.chunk || flow.sourceFile}
                </div>
              )}
            </div>
          ),
        },
        style: nodeStyle(activeNode === n.id, flow?.status),
      })),
    [activeNode, flow]
  );

  const initialEdges = useMemo(
    () =>
      NODE_CONFIG.slice(0, -1).map((n, i) => ({
        id: `e-${n.id}-${NODE_CONFIG[i + 1].id}`,
        source: n.id,
        target: NODE_CONFIG[i + 1].id,
        animated: training || !!flow,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      })),
    [training, flow]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[280px] w-full rounded-xl overflow-hidden border border-white/5"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
      >
        <Background color="#1e293b" gap={20} />
        <Controls className="!bg-slate-800 !border-slate-600 !fill-slate-300" />
        <MiniMap
          nodeColor="#3b82f6"
          maskColor="rgba(15,23,42,0.8)"
          className="!bg-slate-900"
        />
      </ReactFlow>
    </motion.div>
  );
};
