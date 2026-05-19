const { Parser } = require('json2csv');
const XLSX = require('xlsx');

const generateCSV = async (projects) => {
  const fields = [
    'srNo', 'projectId', 'projectName', 'category', 'scopeOfWork',
    'description', 'cost', 'technologies', 'timeline', 'paymentTerms',
    'clientName', 'clientEmail', 'status', 'createdAt',
  ];
  const parser = new Parser({ fields });
  const data = projects.map((p) => ({
    ...p.toObject(),
    scopeOfWork: Array.isArray(p.scopeOfWork) ? p.scopeOfWork.join('; ') : '',
    technologies: Array.isArray(p.technologies) ? p.technologies.join('; ') : '',
    createdAt: new Date(p.createdAt).toISOString(),
  }));
  return parser.parse(data);
};

const generateExcel = async (projects) => {
  const data = projects.map((p) => ({
    'Sr. No': p.srNo,
    'Project ID': p.projectId,
    'Project Name': p.projectName,
    'Category': p.category,
    'Description': p.description,
    'Scope of Work': Array.isArray(p.scopeOfWork) ? p.scopeOfWork.join(', ') : '',
    'Cost': p.cost,
    'Technologies': Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
    'Timeline': p.timeline,
    'Payment Terms': p.paymentTerms,
    'Client Name': p.clientName,
    'Client Email': p.clientEmail,
    'Status': p.status,
    'Created': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

module.exports = { generateCSV, generateExcel };
