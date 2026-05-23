import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useTrainingSocket = () => {
  const [pipeline, setPipeline] = useState({
    stage: 'discovering',
    progress: 0,
    stageProgress: 0,
    currentFile: null,
    currentProjectModule: null,
    isTraining: false,
  });
  const [metrics, setMetrics] = useState(null);
  const [flow, setFlow] = useState(null);
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(`${SOCKET_URL}/training`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    socket.on('training:progress', (data) => {
      setPipeline((prev) => ({ ...prev, ...data }));
    });

    socket.on('training:status', (data) => {
      setPipeline((prev) => ({
        ...prev,
        isTraining: data.isTraining || false,
        progress: data.progress || prev.progress,
      }));
    });

    socket.on('training:error', (data) => {
      setPipeline((prev) => ({ ...prev, isTraining: false }));
    });

    socket.on('training:completed', (data) => {
      setPipeline((prev) => ({
        ...prev,
        stage: 'completed',
        progress: 100,
        isTraining: false,
      }));
    });

    socket.on('training:pipeline', (data) => {
      setPipeline((prev) => ({ ...prev, ...data }));
    });

    socket.on('training:metrics', (data) => setMetrics(data));

    socket.on('training:flow', (data) => setFlow(data));

    socket.on('training:log', (log) => {
      setLogs((prev) => [...prev.slice(-199), log]);
    });

    socket.on('training:complete', () => {
      setPipeline((prev) => ({
        ...prev,
        stage: 'metadata',
        progress: 100,
        isTraining: false,
      }));
    });

    socket.on('training:reconnect', async () => {
      socket.emit('training:reconnect');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { pipeline, metrics, flow, logs, connected, clearLogs };
};
