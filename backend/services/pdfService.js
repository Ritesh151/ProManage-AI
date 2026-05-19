const puppeteer = require('puppeteer');

const launchBrowser = async () => {
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
};

const generatePDF = async (html) => {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      printBackground: true,
      displayHeaderFooter: false,
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

const generateExportPDF = async (projects) => {
  const rows = projects.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.projectId || ''}</td>
      <td>${p.projectName || ''}</td>
      <td>${p.category || ''}</td>
      <td>₹${(p.cost || 0).toLocaleString('en-IN')}</td>
      <td>${p.status || ''}</td>
      <td>${new Date(p.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0F172A; }
    h1 { text-align: center; color: #2563EB; margin-bottom: 8px; font-size: 24px; }
    .subtitle { text-align: center; color: #64748B; margin-bottom: 32px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #1E3A5F; color: white; padding: 12px 14px; text-align: left; font-size: 13px; font-weight: 600; }
    td { padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
    tr:nth-child(even) { background: #F8FAFC; }
    .footer { text-align: center; margin-top: 40px; color: #94A3B8; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Projects Report</h1>
  <p class="subtitle">Total: ${projects.length} projects</p>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Project ID</th>
        <th>Project Name</th>
        <th>Category</th>
        <th>Cost</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
</body>
</html>`;

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
      printBackground: true,
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

module.exports = { generatePDF, generateExportPDF };
