const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const exportRoutes = require('./routes/exportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const scopeRoutes = require('./routes/scopeRoutes');
const aiRoutes = require('./ai/routes/aiRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const notFound = require('./middleware/notFoundMiddleware');
const { initializeAI, shutdownAI } = require('./ai/init');
const scopeService = require('./services/scopeService');
const TrainingPipelineService = require('./services/TrainingPipelineService');
const TrainingStatusService = require('./services/TrainingStatusService');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/projects', projectRoutes);
app.use('/api/proposal', proposalRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/scopes', scopeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/training', trainingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });
  const { initTrainingSocket } = require('./ai/sockets/trainingSocket');
  initTrainingSocket(io);

  app.set('io', io);

  const trainingNsp = io.of('/training');

  trainingNsp.on('connection', (socket) => {
    socket.emit('training:status', { isTraining: false, status: 'idle' });

    const onProgress = (data) => socket.emit('training:progress', data);
    const onStatus = (data) => socket.emit('training:status', data);
    const onError = (data) => socket.emit('training:error', data);
    const onComplete = (data) => socket.emit('training:completed', data);

    TrainingPipelineService.on('training:progress', onProgress);
    TrainingPipelineService.on('training:status', onStatus);
    TrainingPipelineService.on('training:error', onError);
    TrainingPipelineService.on('training:completed', onComplete);

    socket.on('training:reconnect', async () => {
      await TrainingStatusService.init();
      const status = TrainingStatusService.getStatus();
      socket.emit('training:status', status);
    });

    socket.on('disconnect', () => {
      TrainingPipelineService.off('training:progress', onProgress);
      TrainingPipelineService.off('training:status', onStatus);
      TrainingPipelineService.off('training:error', onError);
      TrainingPipelineService.off('training:completed', onComplete);
    });
  });

  io.on('connection', (socket) => {
    socket.on('chat:response', (data) => {
      socket.emit('chat:response', data);
    });

    socket.on('chat:context-update', (data) => {
      socket.emit('chat:context-update', data);
    });
  });

  const server = httpServer.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Initialize default scope categories
    try {
      await scopeService.initializeDefaultCategories();
      console.log('Scope categories initialized');
    } catch (err) {
      console.error('Error initializing scope categories:', err.message);
    }

    // Initialize training status
    try {
      await TrainingStatusService.init();
      console.log('Training status initialized');
    } catch (err) {
      console.error('Error initializing training status:', err.message);
    }

    try {
      const { seedSystemKnowledge } = require('./ai/scripts/seedSystemKnowledge');
      await seedSystemKnowledge();
      console.log('System knowledge seeded');
    } catch (err) {
      console.error('Error seeding system knowledge:', err.message);
    }
    
    // Initialize AI system
    try {
      await initializeAI();
      console.log('AI system initialized successfully');
    } catch (err) {
      console.error('Error initializing AI system:', err.message);
    }
  });

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await shutdownAI();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await shutdownAI();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});
