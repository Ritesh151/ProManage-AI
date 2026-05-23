const SystemKnowledge = require('../../models/SystemKnowledge');

const KNOWLEDGE_ENTRIES = [
  {
    title: 'Project Creation Flow',
    category: 'workflow',
    keywords: ['create project', 'new project', 'add project', 'project creation', 'project workflow', 'how projects work'],
    content: `📁 Project Workflow

1. Create project
  ↓
2. Store MongoDB data
  ↓
3. Calculate cost
  ↓
4. Generate proposal
  ↓
5. Export PDF/Excel
  ↓
6. AI indexing
  ↓
7. AI chatbot access`,
  },
  {
    title: 'How Projects Work',
    category: 'workflow',
    keywords: ['how projects work', 'project flow', 'project creation', 'explain project', 'project process'],
    content: `📁 Project Workflow

1. Create project
  ↓
2. Store MongoDB data
  ↓
3. Calculate cost
  ↓
4. Generate proposal
  ↓
5. Export PDF/Excel
  ↓
6. AI indexing
  ↓
7. AI chatbot access`,
  },
  {
  {
    title: 'PDF Export Implementation',
    category: 'export',
    keywords: ['pdf', 'export', 'puppeteer', 'download', 'proposal pdf'],
    content: `PDF export is implemented in the Node.js backend using Puppeteer.

Flow:
1. User requests export from Export Center or Proposal page
2. Backend loads project from MongoDB via Project.findById()
3. proposalService.generateProposalHTML(project) builds styled HTML
4. pdfService.generatePDF(html) uses Puppeteer to render PDF buffer
5. File is sent with Content-Type application/pdf

Key files: backend/services/proposalService.js, backend/services/pdfService.js, backend/controllers/proposalController.js`,
  },
  {
    title: 'Project Architecture',
    category: 'architecture',
    keywords: ['architecture', 'structure', 'mern', 'stack', 'folders'],
    content: `ProposalForge AI is a MERN application:

Frontend: React 18 + Tailwind CSS + Axios + Framer Motion
Backend: Node.js + Express.js + MongoDB + Mongoose
AI Training: Node.js services (AITrainingService, ChromaDB embeddings)

Main folders:
- frontend/src — React UI (pages, components, hooks, services)
- backend/ — Express API (routes, controllers, services, models)
- backend/ai/ — AI training and chat modules`,
  },
  {
    title: 'Folder Structure',
    category: 'architecture',
    keywords: ['folder', 'directory', 'project structure', 'files'],
    content: `frontend/src/pages — Dashboard, Projects, Proposal, AI Chat, Training Center
frontend/src/components — Reusable UI components
backend/routes — API route definitions
backend/controllers — Request handlers
backend/services — Business logic (proposal, export, AIEngine)
backend/models — Mongoose schemas (Project, ChatSession, SystemKnowledge)`,
  },
  {
    title: 'Backend Technologies',
    category: 'backend',
    keywords: ['backend', 'node', 'express', 'mongodb', 'technologies', 'api'],
    content: `Backend stack:
- Node.js runtime
- Express.js REST API
- MongoDB database
- Mongoose ODM
- Puppeteer (PDF generation)
- docx library (Word export)
- Socket.io (training realtime)
- JWT authentication (if enabled)
- ChromaDB vector storage for AI knowledge`,
  },
  {
    title: 'Project Creation Workflow',
    category: 'workflow',
    keywords: ['create project', 'new project', 'add project', 'workflow'],
    content: `To create a project:
1. Navigate to Projects page
2. Click Add Project / New Project
3. Fill project details: name, category, client info, scope, technologies, timeline, cost
4. Save — stored in MongoDB Project collection
5. Generate proposal from Proposal page
6. Export as PDF or Word from Export Center`,
  },
  {
    title: 'Proposal Workflow',
    category: 'proposal',
    keywords: ['proposal', 'generate proposal', 'proposal workflow'],
    content: `Proposal workflow:
1. Create or select a project in Projects
2. Open Proposal page and select the project
3. API GET /api/proposal/generate/:id returns HTML proposal
4. Preview in browser; export PDF via /api/proposal/pdf/:id
5. proposalGenerated flag set true on Project document`,
  },
  {
    title: 'Export Workflow',
    category: 'export',
    keywords: ['export', 'excel', 'csv', 'word', 'download'],
    content: `Export Center supports:
- PDF proposals (Puppeteer)
- Word documents (docx)
- Excel/CSV project data export
Routes under /api/export and /api/proposal`,
  },
  {
    title: 'AI Training Workflow',
    category: 'training',
    keywords: ['training', 'ai training', 'embeddings', 'chromadb', 'knowledge'],
    content: `Training Center indexes ProposalForge codebase:
1. Discover modules: frontend, backend, python-ai, docs
2. Scan source files, chunk content, generate embeddings
3. Store vectors in ChromaDB; metadata in MongoDB
4. Realtime progress via Socket.io
Use Training Center → Start Training`,
  },
  {
    title: 'Frontend Technologies',
    category: 'frontend',
    keywords: ['frontend', 'react', 'tailwind', 'ui', 'framer'],
    content: `Frontend: React 18, Tailwind CSS, Axios, Framer Motion, React Router, React Markdown. Pages in frontend/src/pages. Components in frontend/src/components.`,
  },
  {
    title: 'How to Create a Project',
    category: 'workflow',
    keywords: ['create project', 'new project', 'add project'],
    content: `Navigate to Projects → Add Project. Fill projectName, clientName, companyName, category, scope, technologies, timeline, cost. Data saves to MongoDB Project collection.`,
  },
];

async function seedSystemKnowledge() {
  for (const entry of KNOWLEDGE_ENTRIES) {
    await SystemKnowledge.findOneAndUpdate(
      { title: entry.title },
      entry,
      { upsert: true, new: true }
    );
  }
}

module.exports = { seedSystemKnowledge, KNOWLEDGE_ENTRIES };
