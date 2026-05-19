const generateProposalHTML = (project) => {
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const scopeBullets = Array.isArray(project.scopeOfWork) && project.scopeOfWork.length > 0
    ? project.scopeOfWork.map((s) => `<li>${s}</li>`).join('')
    : '<li>Full project development lifecycle</li>';

  const costItems = Array.isArray(project.costBreakdown) && project.costBreakdown.length > 0
    ? project.costBreakdown.map((item) => `
      <tr>
        <td>${item.name}</td>
        <td class="amount">₹${Number(item.amount).toLocaleString('en-IN')}</td>
      </tr>`).join('')
    : '';

  const costRows = costItems || `
    <tr>
      <td>Project Development</td>
      <td class="amount">₹${(project.cost || 0).toLocaleString('en-IN')}</td>
    </tr>`;

  const getTechGrid = () => {
    if (Array.isArray(project.technologies)) {
      return `
      <div class="tech-category">
        <h4>Technologies</h4>
        <p>${project.technologies.join(', ')}</p>
      </div>`;
    }
    const grid = [];
    if (project.technologies) {
      if (project.technologies.frontend?.length > 0) {
        grid.push(`<div class="tech-category"><h4>Frontend</h4><p>${project.technologies.frontend.join(', ')}</p></div>`);
      }
      if (project.technologies.backend?.length > 0) {
        grid.push(`<div class="tech-category"><h4>Backend</h4><p>${project.technologies.backend.join(', ')}</p></div>`);
      }
      if (project.technologies.database?.length > 0) {
        grid.push(`<div class="tech-category"><h4>Database</h4><p>${project.technologies.database.join(', ')}</p></div>`);
      }
      if (project.technologies.other?.length > 0) {
        grid.push(`<div class="tech-category"><h4>Tools / Other</h4><p>${project.technologies.other.join(', ')}</p></div>`);
      }
    }
    return grid.length > 0 ? grid.join('') : `<div class="tech-category"><h4>Technologies</h4><p>Not specified</p></div>`;
  };
  const techGridHtml = getTechGrid();

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    color: #1E293B;
    line-height: 1.6;
    font-size: 11pt;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 25mm 30mm 20mm 30mm;
    position: relative;
    page-break-after: always;
  }
  .page:last-child { page-break-after: auto; }
  .page-number {
    position: absolute;
    bottom: 15mm;
    left: 0;
    right: 0;
    text-align: center;
    color: #94A3B8;
    font-size: 9pt;
  }

  /* Cover Page */
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%);
    color: #FFFFFF;
    padding: 30mm;
  }
  .cover .company-name {
    font-size: 28pt;
    font-weight: 300;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-bottom: 40mm;
    border-bottom: 2px solid rgba(255,255,255,0.3);
    padding-bottom: 8mm;
  }
  .cover .doc-title {
    font-size: 36pt;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 20mm;
  }
  .cover .field {
    font-size: 14pt;
    color: rgba(255,255,255,0.7);
    margin-bottom: 4mm;
  }
  .cover .field-value {
    font-size: 20pt;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 12mm;
  }
  .cover .meta {
    font-size: 10pt;
    color: rgba(255,255,255,0.5);
    margin-top: 10mm;
  }
  .cover .meta span {
    display: block;
    margin-bottom: 2mm;
  }

  /* TOC */
  .toc { padding: 30mm 35mm; }
  .toc h2 {
    font-size: 22pt;
    font-weight: 700;
    color: #1E3A5F;
    border-bottom: 3px solid #1E3A5F;
    padding-bottom: 4mm;
    margin-bottom: 12mm;
  }
  .toc-item {
    display: flex;
    align-items: baseline;
    padding: 3mm 0;
    border-bottom: 1px dotted #CBD5E1;
    font-size: 12pt;
  }
  .toc-num {
    font-weight: 700;
    color: #1E3A5F;
    min-width: 10mm;
  }
  .toc-label {
    flex: 1;
    color: #334155;
  }

  /* Content Sections */
  .section {
    margin-bottom: 12mm;
  }
  .section h2 {
    font-size: 18pt;
    font-weight: 700;
    color: #1E3A5F;
    border-bottom: 2px solid #E2E8F0;
    padding-bottom: 3mm;
    margin-bottom: 5mm;
  }
  .section h2 span.num {
    color: #2563EB;
    margin-right: 3mm;
  }
  .section p {
    color: #475569;
    margin-bottom: 3mm;
    text-align: justify;
  }

  ul.scope {
    list-style: none;
    padding: 0;
    margin: 4mm 0;
  }
  ul.scope li {
    padding: 2.5mm 3mm 2.5mm 10mm;
    position: relative;
    border-bottom: 1px solid #F1F5F9;
    color: #334155;
    font-size: 11pt;
  }
  ul.scope li::before {
    content: "\\2022";
    position: absolute;
    left: 2mm;
    color: #2563EB;
    font-weight: bold;
    font-size: 14pt;
  }

  /* Timeline */
  .timeline-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3mm;
  }
  .tl-item {
    display: flex;
    justify-content: space-between;
    padding: 3mm 4mm;
    background: #F8FAFC;
    border-radius: 4px;
    border-left: 3px solid #2563EB;
  }
  .tl-item .phase { font-weight: 600; color: #1E293B; }
  .tl-item .duration { color: #2563EB; font-weight: 600; }

  /* Cost Table */
  .cost-table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0;
  }
  .cost-table th {
    background: #1E3A5F;
    color: #FFFFFF;
    padding: 3mm 4mm;
    text-align: left;
    font-size: 10pt;
    font-weight: 600;
  }
  .cost-table td {
    padding: 3mm 4mm;
    border-bottom: 1px solid #E2E8F0;
    font-size: 11pt;
  }
  .cost-table td.amount {
    text-align: right;
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }
  .cost-table tr.total td {
    border-top: 2px solid #1E3A5F;
    font-weight: 700;
    font-size: 12pt;
    color: #1E3A5F;
    padding-top: 4mm;
  }
  .cost-table tr.total td.amount {
    font-size: 14pt;
  }

  /* Tech Grid */
  .tech-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  .tech-category {
    background: #F8FAFC;
    border-radius: 6px;
    padding: 4mm;
  }
  .tech-category h4 {
    font-size: 10pt;
    font-weight: 700;
    color: #1E3A5F;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2mm;
    padding-bottom: 1mm;
    border-bottom: 2px solid #2563EB;
  }
  .tech-category p {
    font-size: 11pt;
    color: #334155;
  }

  /* Terms List */
  .terms-list {
    list-style: none;
    padding: 0;
  }
  .terms-list li {
    padding: 2.5mm 3mm 2.5mm 10mm;
    position: relative;
    border-bottom: 1px solid #F1F5F9;
    color: #475569;
    font-size: 10.5pt;
  }
  .terms-list li::before {
    content: "\\2713";
    position: absolute;
    left: 0;
    color: #2563EB;
    font-weight: bold;
  }

  /* Signature */
  .signature-area {
    margin-top: 15mm;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
  }
  .sig-block {
    text-align: center;
  }
  .sig-line {
    border-top: 1px solid #1E293B;
    padding-top: 3mm;
    margin-top: 20mm;
    font-weight: 600;
    color: #1E293B;
    font-size: 11pt;
  }
  .sig-label {
    font-size: 9pt;
    color: #64748B;
    margin-bottom: 2mm;
  }

  .payment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4mm;
  }
  .payment-card {
    background: #F8FAFC;
    border-radius: 6px;
    padding: 5mm;
    text-align: center;
    border-top: 3px solid #2563EB;
  }
  .payment-card .pct {
    font-size: 22pt;
    font-weight: 800;
    color: #2563EB;
  }
  .payment-card .label {
    font-size: 9pt;
    color: #64748B;
    margin-top: 1mm;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover">
  <div class="company-name">Opti Matrix Solutions</div>
  <div class="doc-title">Project Proposal</div>
  <div class="field">Project Name</div>
  <div class="field-value">${project.projectName || ''}</div>
  <div class="field">Date</div>
  <div class="field-value">${today}</div>
  <div class="meta">
    <span>Prepared by: Opti Matrix Solutions</span>
    <span>Proposal ID: ${project.projectId || ''}</span>
  </div>
</div>

<!-- PAGE 2: TOC -->
<div class="page toc">
  <h2>Table of Contents</h2>
  <div class="toc-item"><span class="toc-num">1</span><span class="toc-label">Executive Summary</span></div>
  <div class="toc-item"><span class="toc-num">2</span><span class="toc-label">Project Description</span></div>
  <div class="toc-item"><span class="toc-num">3</span><span class="toc-label">Scope of Work</span></div>
  <div class="toc-item"><span class="toc-num">4</span><span class="toc-label">Timeline</span></div>
  <div class="toc-item"><span class="toc-num">5</span><span class="toc-label">Cost Estimation</span></div>
  <div class="toc-item"><span class="toc-num">6</span><span class="toc-label">Technologies</span></div>
  <div class="toc-item"><span class="toc-num">7</span><span class="toc-label">Payment Terms</span></div>
  <div class="toc-item"><span class="toc-num">8</span><span class="toc-label">Terms &amp; Conditions</span></div>
  <div class="toc-item"><span class="toc-num">9</span><span class="toc-label">Signatures</span></div>
  <div class="page-number">Page 2</div>
</div>

<!-- PAGE 3+ -->
<div class="page">
  <div class="section">
    <h2><span class="num">1</span> Executive Summary</h2>
    <p>This proposal outlines the complete project development strategy, implementation process, deliverables, timeline and cost estimation. Our approach ensures a structured, transparent, and results-driven execution that aligns with industry best practices and client requirements.</p>
    <p>We are committed to delivering a high-quality solution that meets the specified objectives within the agreed timeframe and budget. This document serves as the formal agreement between the client and Opti Matrix Solutions for the execution of the described project.</p>
  </div>

  <div class="section">
    <h2><span class="num">2</span> Project Description</h2>
    <p>Opti Matrix Solutions is a leading technology company specializing in custom software development, web applications, mobile solutions, and digital transformation services. With a team of experienced developers, designers, and project managers, we deliver scalable, secure, and high-performance solutions tailored to client needs.</p>
    <p>Our development process follows agile methodologies, ensuring continuous collaboration, transparency, and iterative improvements throughout the project lifecycle. We prioritize quality, performance, and user experience in every deliverable.</p>
  </div>

  <div class="page-number">Page 3</div>
</div>

<div class="page">
  <div class="section">
    <h2><span class="num">3</span> Scope of Work</h2>
    <ul class="scope">${scopeBullets}</ul>
  </div>

  <div class="section">
    <h2><span class="num">4</span> Timeline</h2>
    <div class="timeline-grid">
      <div class="tl-item"><span class="phase">Requirement Analysis</span><span class="duration">2 Days</span></div>
      <div class="tl-item"><span class="phase">UI/UX Design</span><span class="duration">4 Days</span></div>
      <div class="tl-item"><span class="phase">Development</span><span class="duration">10 Days</span></div>
      <div class="tl-item"><span class="phase">Testing</span><span class="duration">3 Days</span></div>
      <div class="tl-item"><span class="phase">Deployment</span><span class="duration">1 Day</span></div>
    </div>
  </div>

  <div class="page-number">Page 4</div>
</div>

<div class="page">
  <div class="section">
    <h2><span class="num">5</span> Cost Estimation</h2>
    <table class="cost-table">
      <thead>
        <tr><th>Module / Service</th><th>Amount</th></tr>
      </thead>
      <tbody>
        ${costRows}
        <tr class="total">
          <td>Total Project Cost</td>
          <td class="amount">₹${(project.cost || 0).toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2><span class="num">6</span> Technologies</h2>
    <div class="tech-grid">
      ${techGridHtml}
    </div>
  </div>

  <div class="page-number">Page 5</div>
</div>

<div class="page">
  <div class="section">
    <h2><span class="num">7</span> Payment Terms</h2>
    <div class="payment-grid">
      <div class="payment-card">
        <div class="pct">50%</div>
        <div class="label">Advance</div>
      </div>
      <div class="payment-card">
        <div class="pct">30%</div>
        <div class="label">Mid Project</div>
      </div>
      <div class="payment-card">
        <div class="pct">20%</div>
        <div class="label">Final Delivery</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2><span class="num">8</span> Terms &amp; Conditions</h2>
    <ul class="terms-list">
      <li>Scope changes may affect timeline and cost. Any modifications outside the agreed scope will be evaluated and quoted separately.</li>
      <li>Payment once completed cannot be refunded. All payments are final and non-refundable after the respective milestone is delivered.</li>
      <li>Additional requirements will be charged separately. Features or changes requested after the scope finalization will incur additional costs.</li>
      <li>Maintenance outside agreement not included. Post-delivery maintenance and support require a separate maintenance agreement.</li>
      <li>Confidentiality of all project materials, code, and data will be maintained throughout and after the engagement.</li>
    </ul>
  </div>

  <div class="page-number">Page 6</div>
</div>

<div class="page">
  <div class="section">
    <h2><span class="num">9</span> Signatures</h2>
    <p>By signing below, both parties acknowledge and agree to the terms and conditions outlined in this proposal.</p>
    <div class="signature-area">
      <div class="sig-block">
        <div class="sig-label">Client Signature</div>
        <div class="sig-line">${project.clientName || '_________________'}</div>
        <p style="font-size:9pt;color:#64748B;margin-top:1mm;">${project.clientName || 'Client Name'}</p>
      </div>
      <div class="sig-block">
        <div class="sig-label">Developer Signature</div>
        <div class="sig-line">Opti Matrix Solutions</div>
        <p style="font-size:9pt;color:#64748B;margin-top:1mm;">Authorized Representative</p>
      </div>
    </div>
  </div>
  <div style="text-align:center;margin-top:15mm;color:#94A3B8;font-size:9pt;">
    Generated on ${today} &bull; Opti Matrix Solutions &bull; ${project.projectId || ''}
  </div>
  <div class="page-number">Page 7</div>
</div>

</body>
</html>`;
};

module.exports = { generateProposalHTML };

