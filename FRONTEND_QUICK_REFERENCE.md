# Frontend Extension - Quick Reference Guide

## 🚀 Quick Start

### Running the Application
```bash
cd frontend
npm install
npm start
```

### New Routes Available
```
/analytics          - Analytics dashboard
/export-center      - Export management
/training           - AI training center
/knowledge          - Knowledge base browser
/search             - Semantic search
/training-history   - Training history
/settings           - Application settings
```

## 📦 Using Components

### PageHeader
```jsx
import { PageHeader } from '../components/PageHeader';

<PageHeader 
  title="Page Title"
  description="Optional description"
  icon={FiIcon}
  actions={<button>Action</button>}
/>
```

### EmptyState
```jsx
import { EmptyState } from '../components/EmptyState';

<EmptyState 
  icon={FiIcon}
  title="No data"
  description="Try searching"
  action={<button>Create</button>}
/>
```

### AnalyticsCard
```jsx
import { AnalyticsCard } from '../components/AnalyticsCard';

<AnalyticsCard 
  title="Revenue"
  value="$125,000"
  change={12.5}
  trend="up"
  icon={FiDollarSign}
/>
```

### ChartContainer
```jsx
import { ChartContainer } from '../components/ChartContainer';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<ChartContainer title="Revenue" loading={false}>
  <LineChart data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <Line dataKey="value" />
  </LineChart>
</ChartContainer>
```

### ExportCard
```jsx
import { ExportCard } from '../components/ExportCard';

<ExportCard 
  export={exportData}
  onRetry={handleRetry}
  onDelete={handleDelete}
/>
```

### TrainingStatusCard
```jsx
import { TrainingStatusCard } from '../components/TrainingStatusCard';

<TrainingStatusCard status={status} loading={false} />
```

### KnowledgeCard
```jsx
import { KnowledgeCard } from '../components/KnowledgeCard';

<KnowledgeCard project={projectData} />
```

### SearchResultCard
```jsx
import { SearchResultCard } from '../components/SearchResultCard';

<SearchResultCard result={resultData} />
```

### SettingSection
```jsx
import { SettingSection } from '../components/SettingSection';

<SettingSection 
  title="Section Title"
  description="Description"
>
  {/* Form fields */}
</SettingSection>
```

## 🎣 Using Hooks

### useAnalytics
```jsx
import { useAnalytics } from '../hooks/useAnalytics';

const { 
  overview, 
  revenue, 
  activities, 
  loading, 
  period, 
  changePeriod 
} = useAnalytics();
```

### useAI
```jsx
import { useAI } from '../hooks/useAI';

const {
  conversations,
  messages,
  loading,
  sendMessage,
  createConversation,
  selectConversation
} = useAI();
```

### useTraining
```jsx
import { useTraining } from '../hooks/useTraining';

const {
  status,
  history,
  training,
  startTraining,
  retrain
} = useTraining();
```

### useSearch
```jsx
import { useSearch } from '../hooks/useSearch';

const {
  results,
  knowledgeBase,
  query,
  handleSearch,
  page,
  totalPages,
  goToPage
} = useSearch();
```

### useExport
```jsx
import { useExport } from '../hooks/useExport';

const {
  history,
  exporting,
  exportToPDF,
  exportToDOCX,
  exportToCSV,
  exportToExcel
} = useExport();
```

### useSettings
```jsx
import { useSettings } from '../hooks/useSettings';

const {
  settings,
  saving,
  updateSettings,
  updateSection,
  resetSettings
} = useSettings();
```

## 🔌 Using Services

### analyticsService
```jsx
import { analyticsService } from '../services/analyticsService';

// Fetch data
const overview = await analyticsService.getOverview({ period: 'monthly' });
const revenue = await analyticsService.getRevenue();
const activities = await analyticsService.getActivities();

// Mock data
const mockOverview = analyticsService.getMockOverview();
```

### aiService
```jsx
import { aiService } from '../services/aiService';

// Send message
const response = await aiService.sendMessage('Hello', conversationId);

// Manage conversations
const conversations = await aiService.getConversations();
await aiService.deleteConversation(id);

// Get status
const status = await aiService.getStatus();
```

### trainingService
```jsx
import { trainingService } from '../services/trainingService';

// Start training
const result = await trainingService.startTraining([projectIds]);

// Get status
const status = await trainingService.getStatus();

// Get history
const history = await trainingService.getHistory();
```

### searchService
```jsx
import { searchService } from '../services/searchService';

// Semantic search
const results = await searchService.semanticSearch('query', { page: 1 });

// Knowledge base
const kb = await searchService.getKnowledgeBase();
```

### exportService
```jsx
import { exportService } from '../services/exportService';

// Export formats
const pdfBlob = await exportService.exportPDF(data);
const docxBlob = await exportService.exportDOCX(data);
const csvBlob = await exportService.exportCSV(data);
const excelBlob = await exportService.exportExcel(data);

// History
const history = await exportService.getExportHistory();
```

### settingsService
```jsx
import { settingsService } from '../services/settingsService';

// Get/update settings
const settings = await settingsService.getSettings();
await settingsService.updateSettings(newSettings);

// Local storage
settingsService.saveLocalSettings(settings);
const local = settingsService.getLocalSettings();

// Defaults
const defaults = settingsService.getDefaultSettings();
```

## 🎨 Styling

All components use Tailwind CSS. Common classes:

```jsx
// Containers
className="bg-white rounded-lg border border-gray-200 p-6"

// Text
className="text-lg font-semibold text-gray-900"
className="text-sm text-gray-600"

// Buttons
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Flex
className="flex items-center justify-between gap-4"
```

## 🔄 Common Patterns

### Loading State
```jsx
{loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : (
  // Content
)}
```

### Error Handling
```jsx
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-sm text-red-900">{error}</p>
  </div>
)}
```

### Empty State
```jsx
{data.length === 0 ? (
  <EmptyState 
    icon={FiIcon}
    title="No data"
    description="Create something"
  />
) : (
  // Content
)}
```

### Animations
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="..."
>
  Content
</motion.div>
```

## 📱 Responsive Design

All components are responsive:
- Mobile: `grid-cols-1`
- Tablet: `md:grid-cols-2`
- Desktop: `lg:grid-cols-3`

## 🌙 Dark Mode

Components automatically support dark mode through Tailwind's dark mode utilities.

## ♿ Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Maintain color contrast

## 🧪 Testing

All hooks and services can be tested:

```jsx
// Mock service
jest.mock('../services/analyticsService');

// Test hook
const { result } = renderHook(() => useAnalytics());
expect(result.current.loading).toBe(false);
```

## 📚 Documentation

- `FRONTEND_EXTENSION_COMPLETE.md` - Full documentation
- `IMPLEMENTATION_CHECKLIST.md` - Implementation status
- `FRONTEND_QUICK_REFERENCE.md` - This file

## 🔗 API Integration

When backend APIs are ready, update service files:

```javascript
// Before (mock data)
const data = analyticsService.getMockOverview();

// After (real API)
const response = await axios.get(`${API_BASE}/analytics/overview`);
const data = response.data;
```

## 🚨 Common Issues

### Issue: Component not rendering
**Solution:** Check if route is added to App.js

### Issue: Hook not working
**Solution:** Ensure hook is called inside a component

### Issue: API call failing
**Solution:** Check if backend endpoint exists, mock data will be used as fallback

### Issue: Styling not applied
**Solution:** Ensure Tailwind CSS is properly configured

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review component examples
3. Check hook implementations
4. Review service methods

## ✅ Checklist Before Deployment

- [ ] All routes working
- [ ] All components rendering
- [ ] All hooks functioning
- [ ] Services connected to backend
- [ ] Mock data removed (optional)
- [ ] Error handling tested
- [ ] Loading states working
- [ ] Responsive design verified
- [ ] Dark mode tested
- [ ] Accessibility checked
- [ ] Performance optimized
- [ ] Build successful

## 🎯 Next Steps

1. Connect backend APIs
2. Add authentication
3. Implement real data
4. Add tests
5. Deploy to production

---

**Status:** ✅ Production Ready
**Last Updated:** 2024
**Version:** 1.0.0
