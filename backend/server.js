const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const exportRoutes = require('./routes/exportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const aiRoutes = require('./ai/routes/aiRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const notFound = require('./middleware/notFoundMiddleware');
const { initializeAI, shutdownAI } = require('./ai/init');

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
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
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
