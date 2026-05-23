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

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const { formatCurrency } = require('../utils/currencyFormatter');

const formatBool = (val) => (val === true || val === 'true' ? 'Yes' : 'No');

const formatScopeDetails = (details) => {
  if (!Array.isArray(details) || details.length === 0) return '';
  return details.map(item => `${item.title} (${formatCurrency(item.price)})`).join('\n');
};

const formatArray = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  return arr.join(', ');
};

const generateExcel = async (projects) => {
  if (!projects || projects.length === 0) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([['No projects found']]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects_Data');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  const headers = [
    'Sr. No', 'Project ID', 'Project Name', 'Branch', 'Project Category',
    'Client Name', 'Client Mobile Number', 'Client Email', 'Inquiry Date',
    'Company Name', 'Company Location', 'Business Type', 'Your Services',
    'Business Age (Years)', 'Has Sales Team', 'Has Social Media',
    'Instagram URL', 'Facebook URL', 'LinkedIn URL', 'Other Social URL',
    'Annual Turnover', 'Current Google Ranking', 'Google Business Profile',
    'Client Domain', 'Client Logo', 'Client Content Available', 'Features',
    'Scope Of Work', 'Project Details', 'Number Of Pages',
    'Timeline Value', 'Timeline Type', 'Project End Date',
    'Frontend Technologies', 'Backend Technologies', 'Database Technologies',
    'Scope Cost', 'Pages Cost', 'Timeline Cost', 'Extra Cost', 'Grand Total', 'Currency',
    'Project Status', 'Created Date', 'Updated Date',
  ];

  const rows = projects.map((p) => {
    const tech = p.technologies || {};
    const social = p.socialMediaProfiles || {};
    const scopeDetails = p.scopeOfWorkDetails || [];

    return [
      p.srNo || '',
      p.projectId || '',
      p.projectName || '',
      p.branch || '',
      p.projectCategory?.name || p.category || '',
      p.clientName || '',
      p.clientMobileNumber || '',
      p.clientEmail || '',
      formatDate(p.inquiryDate),
      p.companyName || '',
      p.companyLocation || '',
      p.businessType || '',
      p.yourServices || '',
      p.yearsInBusiness || '',
      formatBool(p.hasSalesTeam),
      formatBool(p.hasSocialMedia),
      social.instagram || '',
      social.facebook || '',
      social.linkedin || '',
      social.other || '',
      p.annualTurnover || '',
      p.currentGoogleRanking || '',
      formatBool(p.hasGoogleBusinessProfile),
      formatBool(p.hasClientDomain),
      formatBool(p.hasClientLogo),
      formatBool(p.hasClientContent),
      formatArray(p.features),
      formatScopeDetails(scopeDetails),
      p.projectDetails || '',
      p.numberOfPages || '',
      p.timelineValue || '',
      p.timelineUnit || '',
      formatDate(p.projectEndDate),
      formatArray(tech.frontend),
      formatArray(tech.backend),
      formatArray(tech.database),
      p.scopeCost || 0,
      p.pagesCost || 0,
      p.timelineExtraCost || 0,
      p.extrasCost || 0,
      p.cost || 0,
      'INR',
      p.status || '',
      formatDate(p.createdAt),
      formatDate(p.updatedAt),
    ];
  });

  const totalRevenue = projects.reduce((sum, p) => sum + (p.cost || 0), 0);
  const avgCost = projects.length > 0 ? Math.round(totalRevenue / projects.length) : 0;

  const summaryRow = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    `Total Projects: ${projects.length}`, '', `Total Revenue: ${formatCurrency(totalRevenue)}`, `Avg Cost: ${formatCurrency(avgCost)}`,
  ];

  const data = [headers, ...rows, summaryRow];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const colWidths = headers.map((_, i) => {
    const maxLen = Math.max(
      headers[i].length,
      ...rows.map(row => String(row[i] ?? '').length)
    );
    return Math.min(Math.max(maxLen + 2, 12), 40);
  });
  worksheet['!cols'] = colWidths.map(w => ({ wch: w }));

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '1F2937' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'D1D5DB' } },
      bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
      left: { style: 'thin', color: { rgb: 'D1D5DB' } },
      right: { style: 'thin', color: { rgb: 'D1D5DB' } },
    },
  };

  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: C });
    if (worksheet[addr]) {
      worksheet[addr].s = headerStyle;
    }
  }

  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects_Data');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

module.exports = { generateCSV, generateExcel };
