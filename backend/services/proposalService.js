const generateProposalHTML = (project) => {
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // ==================== HELPER FUNCTIONS ====================

  const generateExecutiveSummary = () => {
    const techList = Array.isArray(project.technologies)
      ? project.technologies.join(', ')
      : project.technologies
        ? [...(project.technologies.frontend || []), ...(project.technologies.backend || []), ...(project.technologies.database || [])].join(', ')
        : 'modern technologies';

    return `
      <p>This proposal presents a comprehensive strategy for the <strong>${project.projectName || 'Project'}</strong>, tailored to meet ${project.clientName || 'the client'}'s specific business objectives. Our approach combines industry best practices with innovative solutions to deliver measurable outcomes.</p>
      <p>Leveraging our expertise in ${techList}, we will architect a scalable, secure, and high-performance solution that addresses current challenges while accommodating future growth. The proposed solution is designed to optimize operational efficiency, enhance user engagement, and drive sustainable business value.</p>
      <div class="summary-highlights">
        <div class="highlight-card">
          <div class="highlight-icon">🎯</div>
          <h4>Business Goals</h4>
          <p>Streamline operations, reduce costs, and accelerate digital transformation through tailored technology solutions.</p>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">✅</div>
          <h4>Expected Outcomes</h4>
          <p>Improved efficiency, enhanced user experience, scalable architecture, and comprehensive documentation.</p>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">💡</div>
          <h4>Client Benefits</h4>
          <p>Reduced time-to-market, cost-effective development, ongoing support, and future-ready technology stack.</p>
        </div>
      </div>
    `;
  };

  const generateProjectUnderstanding = () => {
    return `
      <div class="understanding-grid">
        <div class="understanding-card">
          <h4>Client Requirements</h4>
          <p>${project.scopeOfWork?.[0] || 'Comprehensive digital solution addressing core business needs with emphasis on usability, performance, and scalability.'}</p>
        </div>
        <div class="understanding-card">
          <h4>Business Problems</h4>
          <p>Inefficient processes, lack of digital presence, manual workflows leading to reduced productivity and missed opportunities.</p>
        </div>
        <div class="understanding-card">
          <h4>Proposed Solutions</h4>
          <p>Custom ${project.projectName || 'software'} development using cutting-edge technologies to automate workflows and enhance digital capabilities.</p>
        </div>
        <div class="understanding-card">
          <h4>Key Objectives</h4>
          <p>Deliver robust, scalable solution within timeline, ensure seamless deployment, and provide comprehensive training and documentation.</p>
        </div>
      </div>
    `;
  };

  const generateScopeCards = () => {
    const scopeItems = Array.isArray(project.scopeOfWork) && project.scopeOfWork.length > 0
      ? project.scopeOfWork
      : [
        'Requirements Analysis & Planning',
        'UI/UX Design & Prototyping',
        'Frontend & Backend Development',
        'API Integration & Database Design',
        'Quality Assurance & Testing',
        'Deployment & Documentation',
        'Training & Handover'
      ];

    return scopeItems.map((item, index) => `
      <div class="scope-card">
        <div class="scope-card-header">
          <span class="scope-num">0${index + 1}</span>
          <h4>${item}</h4>
        </div>
        <div class="scope-card-body">
          <div class="scope-detail">
            <strong>Deliverables:</strong>
            <p>Complete ${item.toLowerCase()} module with documentation, source code, and testing reports.</p>
          </div>
          <div class="scope-detail">
            <strong>Expected Outcome:</strong>
            <p>Fully functional ${item.toLowerCase()} component meeting all specified requirements and quality standards.</p>
          </div>
        </div>
      </div>
    `).join('');
  };

  const generateDeliverables = () => {
    const deliverables = [
      { icon: '📦', title: 'Source Code', desc: 'Complete, well-documented source code with version control history' },
      { icon: '🖥️', title: 'Admin Panel', desc: 'Full-featured administrative dashboard for content and user management' },
      { icon: '📚', title: 'Documentation', desc: 'Technical documentation, API docs, and user manuals' },
      { icon: '🚀', title: 'Deployment', desc: 'Production deployment on configured servers with CI/CD pipeline' },
      { icon: '🔗', title: 'API Integration', desc: 'RESTful/GraphQL APIs with third-party service integrations' },
      { icon: '🧪', title: 'Testing Reports', desc: 'Unit, integration, and UAT testing reports with bug tracking' },
      { icon: '🎓', title: 'Training Materials', desc: 'Video tutorials, user guides, and hands-on training sessions' },
      { icon: '🛡️', title: 'Security Audit', desc: 'Security assessment report with vulnerability fixes and compliance checks' }
    ];

    return deliverables.map(d => `
      <div class="deliverable-card">
        <div class="deliverable-icon">${d.icon}</div>
        <div class="deliverable-content">
          <h4>${d.title}</h4>
          <p>${d.desc}</p>
        </div>
      </div>
    `).join('');
  };

  const generateTimeline = () => {
    const phases = [
      { phase: 'Requirement Gathering', days: 2, start: 'Day 1', end: 'Day 2' },
      { phase: 'Research & Analysis', days: 2, start: 'Day 3', end: 'Day 4' },
      { phase: 'UI/UX Design', days: 4, start: 'Day 5', end: 'Day 8' },
      { phase: 'Development', days: 10, start: 'Day 9', end: 'Day 18' },
      { phase: 'API Integration', days: 3, start: 'Day 19', end: 'Day 21' },
      { phase: 'Testing & QA', days: 3, start: 'Day 22', end: 'Day 24' },
      { phase: 'Revisions', days: 2, start: 'Day 25', end: 'Day 26' },
      { phase: 'Deployment', days: 1, start: 'Day 27', end: 'Day 27' },
      { phase: 'Support Handover', days: 3, start: 'Day 28', end: 'Day 30' }
    ];

    return phases.map((p, index) => `
      <div class="timeline-card">
        <div class="timeline-marker">${index + 1}</div>
        <div class="timeline-content">
          <h4>${p.phase}</h4>
          <div class="timeline-meta">
            <span class="timeline-days">${p.days} Days</span>
            <span class="timeline-range">${p.start} - ${p.end}</span>
          </div>
        </div>
      </div>
    `).join('');
  };

  const generateTechGrid = () => {
    if (Array.isArray(project.technologies)) {
      return `
      <div class="tech-card">
        <div class="tech-card-header">
          <span class="tech-icon">⚙️</span>
          <h4>Technology Stack</h4>
        </div>
        <div class="tech-badges">
          ${project.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
      </div>`;
    }

    const categories = {
      frontend: { icon: '🎨', label: 'Frontend', items: project.technologies?.frontend || [] },
      backend: { icon: '⚡', label: 'Backend', items: project.technologies?.backend || [] },
      database: { icon: '🗄️', label: 'Database', items: project.technologies?.database || [] },
      devops: { icon: '🔧', label: 'DevOps', items: project.technologies?.devops || [] },
      tools: { icon: '🛠️', label: 'Tools', items: project.technologies?.tools || project.technologies?.other || [] }
    };

    return Object.entries(categories)
      .filter(([_, cat]) => cat.items.length > 0)
      .map(([key, cat]) => `
        <div class="tech-card">
          <div class="tech-card-header">
            <span class="tech-icon">${cat.icon}</span>
            <h4>${cat.label}</h4>
          </div>
          <div class="tech-badges">
            ${cat.items.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
        </div>
      `).join('');
  };

  const generateCostTable = () => {
    const costItems = Array.isArray(project.costBreakdown) && project.costBreakdown.length > 0
      ? project.costBreakdown
      : [{ name: 'Project Development', amount: project.cost || 0 }];

    const subtotal = costItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const rows = costItems.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>Custom Development</td>
        <td class="center">1</td>
        <td class="amount">₹${Number(item.amount).toLocaleString('en-IN')}</td>
        <td class="amount">₹${Number(item.amount).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    return `
      <table class="cost-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Description</th>
            <th class="center">Qty</th>
            <th class="amount">Unit Cost</th>
            <th class="amount">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr class="subtotal">
            <td colspan="4">Subtotal</td>
            <td class="amount">₹${subtotal.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="tax">
            <td colspan="4">GST (18%)</td>
            <td class="amount">₹${gst.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="grand-total">
            <td colspan="4">Total Project Cost</td>
            <td class="amount">₹${total.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const generatePaymentSection = () => {
    const milestones = [
      { pct: '40%', label: 'Project Start', desc: 'Upon agreement signing and project kickoff', days: 'Day 1' },
      { pct: '30%', label: 'Mid Development', desc: 'After UI/UX approval and 50% development completion', days: 'Day 15' },
      { pct: '20%', label: 'Testing Phase', desc: 'Upon completion of testing and client UAT sign-off', days: 'Day 24' },
      { pct: '10%', label: 'Final Delivery', desc: 'After deployment, training, and project handover', days: 'Day 30' }
    ];

    return `
      <div class="payment-milestones">
        ${milestones.map((m, i) => `
          <div class="milestone-card">
            <div class="milestone-header">
              <span class="milestone-pct">${m.pct}</span>
              <span class="milestone-dot">●</span>
              <span class="milestone-label">${m.label}</span>
            </div>
            <p class="milestone-desc">${m.desc}</p>
            <span class="milestone-date">Due: ${m.days}</span>
          </div>
        `).join('')}
      </div>
      <div class="payment-notes">
        <p><strong>Payment Notes:</strong></p>
        <ul>
          <li>All payments to be made via bank transfer or cheque in favor of "Opti Matrix Solutions"</li>
          <li>Invoices will be raised at each milestone with 7-day payment terms</li>
          <li>Late payments may result in project timeline adjustments</li>
          <li>All amounts are exclusive of applicable taxes unless stated otherwise</li>
        </ul>
      </div>
    `;
  };

  const generateAssumptions = () => {
    return `
      <div class="assumptions-grid">
        <div class="assumption-card">
          <h4>👤 Client Responsibilities</h4>
          <ul>
            <li>Timely provision of required content, assets, and information</li>
            <li>Designated point of contact for approvals and feedback</li>
            <li>Access to necessary systems and third-party accounts</li>
            <li>Review and approval within agreed timelines</li>
          </ul>
        </div>
        <div class="assumption-card">
          <h4>🔗 Third-Party Dependencies</h4>
          <ul>
            <li>Third-party API availability and documentation</li>
            <li>Hosting/server environment readiness</li>
            <li>Domain and SSL certificate procurement</li>
            <li>External service provider cooperation</li>
          </ul>
        </div>
        <div class="assumption-card">
          <h4>📋 Resource Requirements</h4>
          <ul>
            <li>Staging environment for testing and UAT</li>
            <li>Access to existing systems for integration</li>
            <li>Subject matter experts for domain-specific inputs</li>
            <li>Required software licenses and tools</li>
          </ul>
        </div>
      </div>
    `;
  };

  const generateTermsAndConditions = () => {
    const terms = [
      { title: 'Scope Changes', content: 'Any modifications or additions to the agreed scope of work will be evaluated and may result in timeline extensions and additional costs. All scope changes must be documented and approved in writing by both parties.' },
      { title: 'Revision Policy', content: 'The proposal includes up to 3 rounds of revisions during design and development phases. Additional revisions beyond this limit will be billed at standard hourly rates.' },
      { title: 'Confidentiality', content: 'Both parties agree to maintain strict confidentiality regarding all proprietary information, trade secrets, business processes, and project-related data shared during and after the engagement. A separate NDA may be executed if required.' },
      { title: 'Ownership Rights', content: 'Upon full payment, the client receives complete ownership of all deliverables including source code, designs, documentation, and intellectual property created specifically for this project.' },
      { title: 'Warranty', content: 'Opti Matrix Solutions provides a 30-day warranty period post-deployment for bug fixes and minor adjustments at no additional cost. This warranty covers defects in functionality as per the agreed specifications.' },
      { title: 'Maintenance & Support', content: 'Post-warranty maintenance and support services are available through separate Annual Maintenance Contract (AMC). Standard AMC includes bug fixes, security updates, and technical support during business hours.' },
      { title: 'Cancellation Policy', content: 'Either party may terminate the agreement with 15 days written notice. In case of cancellation by the client, payment for completed milestones is due. Advance payments are non-refundable after project commencement.' },
      { title: 'Refund Policy', content: 'Refunds are processed only for milestones not yet initiated. Once a milestone is completed and delivered, the corresponding payment is non-refundable. Refund requests must be submitted in writing.' },
      { title: 'Force Majeure', content: 'Neither party shall be liable for delays or failures in performance resulting from events beyond reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, government actions, or internet infrastructure failures.' },
      { title: 'Legal Jurisdiction', content: 'This agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising from this agreement shall be subject to the exclusive jurisdiction of courts in [City, State].' }
    ];

    return terms.map(t => `
      <div class="term-card">
        <h4>${t.title}</h4>
        <p>${t.content}</p>
      </div>
    `).join('');
  };

  const generateRiskAssessment = () => {
    const risks = [
      { risk: 'Requirement Creep', impact: 'High', mitigation: 'Clear scope documentation, change request process, and regular stakeholder reviews' },
      { risk: 'Technology Compatibility', impact: 'Medium', mitigation: 'Thorough tech stack evaluation, proof of concept, and fallback options' },
      { risk: 'Timeline Delays', impact: 'High', mitigation: 'Agile methodology, buffer time allocation, and parallel task execution' },
      { risk: 'Resource Availability', impact: 'Medium', mitigation: 'Dedicated team allocation, backup resources, and knowledge sharing protocols' },
      { risk: 'Third-Party API Changes', impact: 'Medium', mitigation: 'API version locking, abstraction layers, and regular compatibility testing' },
      { risk: 'Security Vulnerabilities', impact: 'High', mitigation: 'Regular security audits, penetration testing, and adherence to OWASP standards' }
    ];

    return `
      <table class="risk-table">
        <thead>
          <tr>
            <th>Risk</th>
            <th class="center">Impact</th>
            <th>Mitigation Strategy</th>
          </tr>
        </thead>
        <tbody>
          ${risks.map(r => `
            <tr>
              <td><strong>${r.risk}</strong></td>
              <td class="center"><span class="risk-badge risk-${r.impact.toLowerCase()}">${r.impact}</span></td>
              <td>${r.mitigation}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const generateSupportSection = () => {
    return `
      <div class="support-grid">
        <div class="support-card">
          <div class="support-icon">🛡️</div>
          <h4>Warranty Support</h4>
          <p>30-day complimentary support post-deployment covering bug fixes and critical issues. Response time within 24 hours.</p>
        </div>
        <div class="support-card">
          <div class="support-icon">🐛</div>
          <h4>Bug Fixing Policy</h4>
          <p>Critical bugs resolved within 24 hours, major bugs within 48 hours, minor bugs within 5 business days during warranty period.</p>
        </div>
        <div class="support-card">
          <div class="support-icon">⬆️</div>
          <h4>Upgrade Policy</h4>
          <p>Technology stack upgrades and version migrations available under AMC. Major upgrades scoped and quoted separately.</p>
        </div>
        <div class="support-card">
          <div class="support-icon">📅</div>
          <h4>AMC Options</h4>
          <p>Flexible annual maintenance plans: Basic (email support), Standard (priority support), Premium (24/7 dedicated support).</p>
        </div>
      </div>
    `;
  };

  // ==================== MAIN HTML GENERATION ====================

  const totalCost = project.cost || 0;
  const costBreakdown = Array.isArray(project.costBreakdown) && project.costBreakdown.length > 0
    ? project.costBreakdown.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    : totalCost;
  const finalAmount = costBreakdown * 1.18; // Including 18% GST

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project Proposal - ${project.projectName || 'Project'}</title>
<style>
  /* ==================== CSS RESET & BASE ==================== */
  @page { 
    margin: 0; 
    size: A4;
  }
  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }
  
  :root {
    --primary: #1E3A5F;
    --primary-dark: #0F172A;
    --accent: #2563EB;
    --accent-light: #3B82F6;
    --accent-glow: #60A5FA;
    --gold: #F59E0B;
    --surface: #FFFFFF;
    --surface-alt: #F8FAFC;
    --border: #E2E8F0;
    --border-light: #F1F5F9;
    --text-primary: #1E293B;
    --text-secondary: #475569;
    --text-muted: #94A3B8;
    --success: #10B981;
    --warning: #F59E0B;
    --danger: #EF4444;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
  }
  
  body {
    font-family: 'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-primary);
    line-height: 1.7;
    font-size: 10.5pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm 25mm;
    position: relative;
    page-break-after: always;
    background: var(--surface);
    overflow: hidden;
  }
  .page:last-child { 
    page-break-after: auto; 
  }
  
  /* ==================== WATERMARK ==================== */
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 120pt;
    font-weight: 900;
    color: rgba(0,0,0,0.015);
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
    letter-spacing: 20px;
  }
  
  /* ==================== COVER PAGE ==================== */
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 40%, #1E40AF 70%, #0F172A 100%);
    color: #FFFFFF;
    position: relative;
    overflow: hidden;
    padding: 25mm 30mm;
  }
  
  .cover::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .cover::after {
    content: '';
    position: absolute;
    bottom: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .cover-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%);
    background-size: 60px 60px;
    opacity: 0.5;
    pointer-events: none;
  }
  
  .cover-content {
    position: relative;
    z-index: 1;
    width: 100%;
  }
  
  .cover-brand {
    font-size: 12pt;
    font-weight: 400;
    letter-spacing: 8px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 30mm;
    position: relative;
  }
  
  .cover-brand::after {
    content: '';
    display: block;
    width: 80px;
    height: 2px;
    background: var(--accent-light);
    margin: 6mm auto 0;
    opacity: 0.8;
  }
  
  .cover-badge {
    display: inline-block;
    padding: 2mm 6mm;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 20px;
    font-size: 9pt;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.8);
    margin-bottom: 12mm;
  }
  
  .cover-title {
    font-size: 34pt;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8mm;
    background: linear-gradient(180deg, #FFFFFF 0%, #93C5FD 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .cover-divider {
    width: 120px;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
    margin: 10mm auto;
  }
  
  .cover-field-group {
    margin-bottom: 8mm;
  }
  
  .cover-field-label {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 2mm;
  }
  
  .cover-field-value {
    font-size: 18pt;
    font-weight: 700;
    color: #FFFFFF;
  }
  
  .cover-meta {
    margin-top: 20mm;
    font-size: 9pt;
    color: rgba(255,255,255,0.5);
    line-height: 2;
  }
  
  .cover-meta span {
    display: block;
  }
  
  .cover-status {
    display: inline-block;
    padding: 1.5mm 5mm;
    background: rgba(16,185,129,0.2);
    border: 1px solid rgba(16,185,129,0.4);
    border-radius: 20px;
    color: #6EE7B7;
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  /* ==================== TABLE OF CONTENTS ==================== */
  .toc-page {
    background: var(--surface);
  }
  
  .toc-header {
    margin-bottom: 12mm;
  }
  
  .toc-header h2 {
    font-size: 24pt;
    font-weight: 800;
    color: var(--primary);
    position: relative;
    display: inline-block;
  }
  
  .toc-header h2::after {
    content: '';
    display: block;
    width: 60%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), transparent);
    margin-top: 3mm;
  }
  
  .toc-list {
    list-style: none;
    padding: 0;
  }
  
  .toc-item {
    display: flex;
    align-items: baseline;
    padding: 4mm 0;
    border-bottom: 1px dotted var(--border);
    font-size: 12pt;
    transition: all 0.3s;
  }
  
  .toc-num {
    font-weight: 800;
    color: var(--accent);
    min-width: 12mm;
    font-size: 14pt;
  }
  
  .toc-label {
    flex: 1;
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .toc-dots {
    flex: 1;
    border-bottom: 1px dotted var(--border);
    margin: 0 3mm;
  }
  
  .toc-page-num {
    color: var(--text-muted);
    font-weight: 600;
  }
  
  /* ==================== SECTION STYLES ==================== */
  .section {
    margin-bottom: 10mm;
    position: relative;
  }
  
  .section-header {
    margin-bottom: 6mm;
    position: relative;
  }
  
  .section-header h2 {
    font-size: 16pt;
    font-weight: 700;
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 3mm;
  }
  
  .section-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 10mm;
    height: 10mm;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: #FFFFFF;
    border-radius: 50%;
    font-size: 10pt;
    font-weight: 700;
    flex-shrink: 0;
  }
  
  .section-header::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--border));
    margin-top: 3mm;
  }
  
  .section p {
    color: var(--text-secondary);
    margin-bottom: 3mm;
    text-align: justify;
    font-size: 10.5pt;
  }
  
  /* ==================== EXECUTIVE SUMMARY HIGHLIGHTS ==================== */
  .summary-highlights {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4mm;
    margin-top: 5mm;
  }
  
  .highlight-card {
    background: var(--surface-alt);
    border-radius: var(--radius-md);
    padding: 5mm;
    text-align: center;
    border: 1px solid var(--border-light);
    transition: all 0.3s;
  }
  
  .highlight-icon {
    font-size: 24pt;
    margin-bottom: 2mm;
  }
  
  .highlight-card h4 {
    font-size: 10pt;
    color: var(--primary);
    margin-bottom: 2mm;
    font-weight: 700;
  }
  
  .highlight-card p {
    font-size: 9pt;
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: 0;
  }
  
  /* ==================== UNDERSTANDING GRID ==================== */
  .understanding-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  
  .understanding-card {
    background: linear-gradient(135deg, var(--surface-alt), #FFFFFF);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 5mm;
    border-left: 3px solid var(--accent);
  }
  
  .understanding-card h4 {
    color: var(--primary);
    font-size: 11pt;
    margin-bottom: 2mm;
    font-weight: 700;
  }
  
  .understanding-card p {
    font-size: 9.5pt;
    color: var(--text-secondary);
    margin-bottom: 0;
  }
  
  /* ==================== SCOPE CARDS ==================== */
  .scope-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  
  .scope-card {
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }
  
  .scope-card-header {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: #FFFFFF;
    padding: 4mm 5mm;
    display: flex;
    align-items: center;
    gap: 3mm;
  }
  
  .scope-num {
    font-size: 18pt;
    font-weight: 800;
    opacity: 0.7;
  }
  
  .scope-card-header h4 {
    font-size: 10pt;
    font-weight: 600;
    margin: 0;
  }
  
  .scope-card-body {
    padding: 4mm 5mm;
  }
  
  .scope-detail {
    margin-bottom: 2mm;
  }
  
  .scope-detail strong {
    color: var(--primary);
    font-size: 9pt;
  }
  
  .scope-detail p {
    font-size: 9pt;
    color: var(--text-secondary);
    margin: 1mm 0 0 0;
  }
  
  /* ==================== DELIVERABLES ==================== */
  .deliverables-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3mm;
  }
  
  .deliverable-card {
    display: flex;
    gap: 3mm;
    padding: 4mm;
    background: var(--surface-alt);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    align-items: flex-start;
  }
  
  .deliverable-icon {
    font-size: 20pt;
    flex-shrink: 0;
  }
  
  .deliverable-content h4 {
    font-size: 10pt;
    color: var(--primary);
    margin-bottom: 1mm;
    font-weight: 700;
  }
  
  .deliverable-content p {
    font-size: 8.5pt;
    color: var(--text-secondary);
    margin: 0;
  }
  
  /* ==================== TIMELINE ==================== */
  .timeline-roadmap {
    position: relative;
    padding-left: 8mm;
  }
  
  .timeline-roadmap::before {
    content: '';
    position: absolute;
    left: 3.5mm;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--accent), var(--accent-glow), var(--accent));
    border-radius: 1px;
  }
  
  .timeline-card {
    display: flex;
    gap: 4mm;
    margin-bottom: 4mm;
    position: relative;
  }
  
  .timeline-marker {
    width: 9mm;
    height: 9mm;
    background: linear-gradient(135deg, var(--accent), var(--primary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-weight: 800;
    font-size: 9pt;
    flex-shrink: 0;
    margin-left: -5.7mm;
    z-index: 1;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
  }
  
  .timeline-content {
    background: var(--surface-alt);
    border-radius: var(--radius-md);
    padding: 4mm 5mm;
    flex: 1;
    border: 1px solid var(--border-light);
  }
  
  .timeline-content h4 {
    font-size: 10pt;
    color: var(--primary);
    margin-bottom: 2mm;
    font-weight: 700;
  }
  
  .timeline-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .timeline-days {
    background: var(--accent);
    color: #FFFFFF;
    padding: 1mm 3mm;
    border-radius: var(--radius-sm);
    font-size: 8pt;
    font-weight: 700;
  }
  
  .timeline-range {
    color: var(--text-muted);
    font-size: 8.5pt;
    font-weight: 500;
  }
  
  /* ==================== TECH STACK ==================== */
  .tech-stack-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  
  .tech-card {
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 4mm;
    box-shadow: var(--shadow-sm);
  }
  
  .tech-card-header {
    display: flex;
    align-items: center;
    gap: 2mm;
    margin-bottom: 3mm;
    padding-bottom: 2mm;
    border-bottom: 2px solid var(--accent);
  }
  
  .tech-icon {
    font-size: 16pt;
  }
  
  .tech-card-header h4 {
    font-size: 10pt;
    color: var(--primary);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 2mm;
  }
  
  .tech-badge {
    display: inline-block;
    padding: 1.5mm 3mm;
    background: linear-gradient(135deg, var(--surface-alt), #FFFFFF);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 8.5pt;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.5px;
  }
  
  /* ==================== COST TABLE ==================== */
  .cost-table-wrapper {
    overflow: hidden;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  
  .cost-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .cost-table thead th {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: #FFFFFF;
    padding: 3.5mm 4mm;
    text-align: left;
    font-size: 9.5pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .cost-table thead th.center,
  .cost-table tbody td.center {
    text-align: center;
  }
  
  .cost-table thead th.amount,
  .cost-table tbody td.amount {
    text-align: right;
  }
  
  .cost-table tbody td {
    padding: 3mm 4mm;
    border-bottom: 1px solid var(--border-light);
    font-size: 9.5pt;
    color: var(--text-secondary);
  }
  
  .cost-table tbody tr:nth-child(even) td {
    background: var(--surface-alt);
  }
  
  .cost-table tbody td.amount {
    font-weight: 600;
    font-family: 'Consolas', 'Courier New', monospace;
    color: var(--text-primary);
  }
  
  .cost-table .subtotal td {
    border-top: 1px solid var(--border);
    font-weight: 600;
    color: var(--text-primary);
    background: #FAFBFC;
  }
  
  .cost-table .tax td {
    color: var(--text-secondary);
    background: #FAFBFC;
  }
  
  .cost-table .grand-total td {
    border-top: 2px solid var(--primary);
    font-weight: 800;
    font-size: 11pt;
    color: var(--primary);
    padding-top: 4mm;
    background: #F0F4FF;
  }
  
  .cost-table .grand-total td.amount {
    font-size: 13pt;
  }
  
  /* ==================== PAYMENT MILESTONES ==================== */
  .payment-milestones {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  
  .milestone-card {
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 5mm;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
  }
  
  .milestone-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--accent), var(--accent-glow));
  }
  
  .milestone-header {
    display: flex;
    align-items: center;
    gap: 3mm;
    margin-bottom: 2mm;
  }
  
  .milestone-pct {
    font-size: 20pt;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
  }
  
  .milestone-dot {
    color: var(--accent-light);
    font-size: 6pt;
  }
  
  .milestone-label {
    font-size: 10pt;
    font-weight: 700;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .milestone-desc {
    font-size: 9pt;
    color: var(--text-secondary);
    margin: 2mm 0;
  }
  
  .milestone-date {
    display: inline-block;
    padding: 1mm 3mm;
    background: var(--surface-alt);
    border-radius: var(--radius-sm);
    font-size: 8pt;
    font-weight: 600;
    color: var(--text-muted);
  }
  
  .payment-notes {
    margin-top: 5mm;
    padding: 4mm;
    background: #FFF7ED;
    border: 1px solid #FED7AA;
    border-radius: var(--radius-md);
    font-size: 9pt;
  }
  
  .payment-notes p {
    margin-bottom: 2mm;
  }
  
  .payment-notes ul {
    list-style: disc;
    padding-left: 6mm;
  }
  
  .payment-notes li {
    color: var(--text-secondary);
    font-size: 8.5pt;
    margin-bottom: 1mm;
  }
  
  /* ==================== ASSUMPTIONS ==================== */
  .assumptions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4mm;
  }
  
  .assumption-card {
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 5mm;
    box-shadow: var(--shadow-sm);
  }
  
  .assumption-card h4 {
    font-size: 10pt;
    color: var(--primary);
    margin-bottom: 3mm;
    font-weight: 700;
    padding-bottom: 2mm;
    border-bottom: 1px solid var(--border-light);
  }
  
  .assumption-card ul {
    list-style: none;
    padding: 0;
  }
  
  .assumption-card li {
    font-size: 8.5pt;
    color: var(--text-secondary);
    padding: 1.5mm 0;
    padding-left: 4mm;
    position: relative;
  }
  
  .assumption-card li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-size: 8pt;
  }
  
  /* ==================== TERMS & CONDITIONS ==================== */
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  
  .term-card {
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 4mm 5mm;
    box-shadow: var(--shadow-sm);
  }
  
  .term-card h4 {
    font-size: 9.5pt;
    color: var(--accent);
    margin-bottom: 2mm;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .term-card p {
    font-size: 8.5pt;
    color: var(--text-secondary);
    margin: 0;
  }
  
  /* ==================== RISK TABLE ==================== */
  .risk-table-wrapper {
    overflow: hidden;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  
  .risk-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .risk-table thead th {
    background: linear-gradient(135deg, #7C2D12, #9A3412);
    color: #FFFFFF;
    padding: 3mm 4mm;
    text-align: left;
    font-size: 9pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .risk-table thead th.center,
  .risk-table tbody td.center {
    text-align: center;
  }
  
  .risk-table tbody td {
    padding: 2.5mm 4mm;
    border-bottom: 1px solid var(--border-light);
    font-size: 9pt;
    color: var(--text-secondary);
  }
  
  .risk-table tbody tr:nth-child(even) td {
    background: #FFF7ED;
  }
  
  .risk-badge {
    display: inline-block;
    padding: 1mm 3mm;
    border-radius: var(--radius-sm);
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .risk-high {
    background: #FEE2E2;
    color: #991B1B;
    border: 1px solid #FECACA;
  }
  
  .risk-medium {
    background: #FEF3C7;
    color: #92400E;
    border: 1px solid #FDE68A;
  }
  
  .risk-low {
    background: #D1FAE5;
    color: #065F46;
    border: 1px solid #A7F3D0;
  }
  
  /* ==================== SUPPORT SECTION ==================== */
  .support-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  
  .support-card {
    background: linear-gradient(135deg, #F0FDF4, #FFFFFF);
    border: 1px solid #BBF7D0;
    border-radius: var(--radius-md);
    padding: 5mm;
    text-align: center;
  }
  
  .support-icon {
    font-size: 24pt;
    margin-bottom: 2mm;
  }
  
  .support-card h4 {
    font-size: 10pt;
    color: var(--primary);
    margin-bottom: 2mm;
    font-weight: 700;
  }
  
  .support-card p {
    font-size: 9pt;
    color: var(--text-secondary);
    margin: 0;
    text-align: center;
  }
  
  /* ==================== SIGNATURE SECTION ==================== */
  .signature-area {
    margin-top: 10mm;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
  }
  
  .sig-block {
    text-align: center;
    padding: 5mm;
  }
  
  .sig-label {
    font-size: 8pt;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15mm;
  }
  
  .sig-line {
    border-top: 1.5px solid var(--text-primary);
    padding-top: 4mm;
    font-weight: 700;
    color: var(--text-primary);
    font-size: 11pt;
  }
  
  .sig-name {
    font-size: 9pt;
    color: var(--text-secondary);
    margin-top: 2mm;
  }
  
  .sig-role {
    font-size: 8pt;
    color: var(--text-muted);
    margin-top: 1mm;
  }
  
  /* ==================== FOOTER ==================== */
  .page-footer {
    position: absolute;
    bottom: 12mm;
    left: 25mm;
    right: 25mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8pt;
    color: var(--text-muted);
    border-top: 1px solid var(--border-light);
    padding-top: 4mm;
  }
  
  .footer-company {
    font-weight: 600;
    color: var(--primary);
  }
  
  .footer-contact {
    display: flex;
    gap: 5mm;
  }
  
  .page-num {
    font-weight: 600;
    color: var(--accent);
  }
  
  .confidential-strip {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--primary);
    color: rgba(255,255,255,0.6);
    text-align: center;
    padding: 2mm;
    font-size: 7pt;
    letter-spacing: 2px;
    text-transform: uppercase;
    z-index: 100;
  }
  
  /* ==================== ABOUT SECTION ==================== */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
  }
  
  .about-card {
    background: linear-gradient(135deg, var(--surface-alt), #FFFFFF);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 5mm;
  }
  
  .about-card h4 {
    color: var(--primary);
    font-size: 10pt;
    margin-bottom: 2mm;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 2mm;
  }
  
  .about-card p {
    font-size: 9pt;
    color: var(--text-secondary);
    margin: 0;
  }
  
  /* ==================== PRINT OPTIMIZATIONS ==================== */
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .page {
      box-shadow: none;
      margin: 0;
    }
    
    .confidential-strip {
      position: fixed;
    }
  }
  
  /* ==================== PAGE BREAK HELPERS ==================== */
  .page-break-before {
    page-break-before: always;
  }
  
  .page-break-after {
    page-break-after: always;
  }
  
  .no-break-inside {
    page-break-inside: avoid;
    break-inside: avoid;
  }
</style>
</head>
<body>

<!-- ==================== COVER PAGE ==================== -->
<div class="page cover">
  <div class="cover-pattern"></div>
  <div class="cover-content">
    <div class="cover-brand">Opti Matrix Solutions</div>
    <div class="cover-badge">● ${project.projectId ? 'PROPOSAL #' + project.projectId : 'PROFESSIONAL PROPOSAL'} ●</div>
    <div class="cover-title">Project<br>Proposal</div>
    <div class="cover-divider"></div>
    
    <div class="cover-field-group">
      <div class="cover-field-label">Project Name</div>
      <div class="cover-field-value">${project.projectName || 'Untitled Project'}</div>
    </div>
    
    <div class="cover-field-group">
      <div class="cover-field-label">Prepared For</div>
      <div class="cover-field-value">${project.clientName || 'Valued Client'}</div>
    </div>
    
    <div class="cover-field-group">
      <div class="cover-field-label">Date</div>
      <div class="cover-field-value">${today}</div>
    </div>
    
    <div class="cover-meta">
      <span>Prepared by: Opti Matrix Solutions</span>
      <span>Proposal ID: ${project.projectId || 'N/A'}</span>
      <span style="margin-top:3mm;"><span class="cover-status">● Active Proposal</span></span>
    </div>
  </div>
</div>

<!-- ==================== TABLE OF CONTENTS ==================== -->
<div class="page toc-page">
  <div class="toc-header">
    <h2>Table of Contents</h2>
  </div>
  <ul class="toc-list">
    <li class="toc-item"><span class="toc-num">01</span><span class="toc-label">Executive Summary</span><span class="toc-dots"></span><span class="toc-page-num">3</span></li>
    <li class="toc-item"><span class="toc-num">02</span><span class="toc-label">About Our Company</span><span class="toc-dots"></span><span class="toc-page-num">4</span></li>
    <li class="toc-item"><span class="toc-num">03</span><span class="toc-label">Project Understanding</span><span class="toc-dots"></span><span class="toc-page-num">5</span></li>
    <li class="toc-item"><span class="toc-num">04</span><span class="toc-label">Scope of Work</span><span class="toc-dots"></span><span class="toc-page-num">6</span></li>
    <li class="toc-item"><span class="toc-num">05</span><span class="toc-label">Project Deliverables</span><span class="toc-dots"></span><span class="toc-page-num">7</span></li>
    <li class="toc-item"><span class="toc-num">06</span><span class="toc-label">Project Timeline</span><span class="toc-dots"></span><span class="toc-page-num">8</span></li>
    <li class="toc-item"><span class="toc-num">07</span><span class="toc-label">Technology Stack</span><span class="toc-dots"></span><span class="toc-page-num">9</span></li>
    <li class="toc-item"><span class="toc-num">08</span><span class="toc-label">Cost Estimation</span><span class="toc-dots"></span><span class="toc-page-num">10</span></li>
    <li class="toc-item"><span class="toc-num">09</span><span class="toc-label">Payment Terms</span><span class="toc-dots"></span><span class="toc-page-num">11</span></li>
    <li class="toc-item"><span class="toc-num">10</span><span class="toc-label">Project Assumptions</span><span class="toc-dots"></span><span class="toc-page-num">12</span></li>
    <li class="toc-item"><span class="toc-num">11</span><span class="toc-label">Risk Assessment</span><span class="toc-dots"></span><span class="toc-page-num">13</span></li>
    <li class="toc-item"><span class="toc-num">12</span><span class="toc-label">Terms &amp; Conditions</span><span class="toc-dots"></span><span class="toc-page-num">14</span></li>
    <li class="toc-item"><span class="toc-num">13</span><span class="toc-label">Support &amp; Maintenance</span><span class="toc-dots"></span><span class="toc-page-num">15</span></li>
    <li class="toc-item"><span class="toc-num">14</span><span class="toc-label">Signatures</span><span class="toc-dots"></span><span class="toc-page-num">16</span></li>
  </ul>
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 2</span>
  </div>
</div>

<!-- ==================== EXECUTIVE SUMMARY ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">01</span> Executive Summary</h2>
    </div>
    ${generateExecutiveSummary()}
  </div>
  
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">02</span> About Our Company</h2>
    </div>
    <p><strong>Opti Matrix Solutions</strong> is a premier technology consulting and software development company with over 8 years of industry experience. We specialize in delivering cutting-edge digital solutions that transform businesses and drive growth.</p>
    <div class="about-grid" style="margin-top:4mm;">
      <div class="about-card">
        <h4>🎯 Our Expertise</h4>
        <p>Full-stack development, cloud solutions, mobile applications, AI/ML integration, and enterprise software architecture.</p>
      </div>
      <div class="about-card">
        <h4>👥 Team Capability</h4>
        <p>50+ skilled professionals including developers, designers, QA engineers, and project managers with diverse domain expertise.</p>
      </div>
      <div class="about-card">
        <h4>🏆 Track Record</h4>
        <p>200+ successful projects delivered across 15+ industries with 98% client satisfaction rate and long-term partnerships.</p>
      </div>
      <div class="about-card">
        <h4>🌟 Mission & Vision</h4>
        <p>To empower businesses with innovative technology solutions that create lasting value and competitive advantage.</p>
      </div>
    </div>
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 3</span>
  </div>
</div>

<!-- ==================== PROJECT UNDERSTANDING ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">03</span> Project Understanding</h2>
    </div>
    ${generateProjectUnderstanding()}
  </div>
  
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">04</span> Scope of Work</h2>
    </div>
    <p>Our comprehensive scope of work encompasses all phases of the project lifecycle, ensuring complete coverage of requirements and delivering a production-ready solution.</p>
    <div class="scope-grid">
      ${generateScopeCards()}
    </div>
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 4</span>
  </div>
</div>

<!-- ==================== DELIVERABLES & TIMELINE ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">05</span> Project Deliverables</h2>
    </div>
    <p>Upon successful completion of the project, the following deliverables will be provided to ensure complete handover and operational readiness.</p>
    <div class="deliverables-grid">
      ${generateDeliverables()}
    </div>
  </div>
  
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">06</span> Project Timeline</h2>
    </div>
    <p>The project will be executed over a period of <strong>30 working days</strong>, following a structured phase-wise approach to ensure quality and timely delivery.</p>
    <div class="timeline-roadmap">
      ${generateTimeline()}
    </div>
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 5</span>
  </div>
</div>

<!-- ==================== TECH STACK ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">07</span> Technology Stack</h2>
    </div>
    <p>We leverage industry-leading technologies and frameworks to build robust, scalable, and future-proof solutions tailored to your project requirements.</p>
    <div class="tech-stack-grid">
      ${generateTechGrid()}
    </div>
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 6</span>
  </div>
</div>

<!-- ==================== COST ESTIMATION ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">08</span> Cost Estimation</h2>
    </div>
    <p>The following cost breakdown provides a transparent view of the project investment. All amounts are in Indian Rupees (₹) and inclusive of applicable taxes where indicated.</p>
    <div class="cost-table-wrapper">
      ${generateCostTable()}
    </div>
    <p style="font-size:8.5pt;color:var(--text-muted);margin-top:3mm;font-style:italic;">
      * Prices are valid for 30 days from the proposal date. Any additional features or scope changes will be quoted separately.
    </p>
  </div>
  
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">09</span> Payment Terms</h2>
    </div>
    <p>Our milestone-based payment structure ensures transparency and aligns payment schedules with project progress.</p>
    ${generatePaymentSection()}
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 7</span>
  </div>
</div>

<!-- ==================== ASSUMPTIONS & RISK ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">10</span> Project Assumptions</h2>
    </div>
    <p>The successful execution of this project is based on the following assumptions regarding client responsibilities, third-party dependencies, and resource availability.</p>
    ${generateAssumptions()}
  </div>
  
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">11</span> Risk Assessment</h2>
    </div>
    <p>We have identified potential risks and developed comprehensive mitigation strategies to ensure project success.</p>
    <div class="risk-table-wrapper">
      ${generateRiskAssessment()}
    </div>
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 8</span>
  </div>
</div>

<!-- ==================== TERMS & CONDITIONS ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">12</span> Terms &amp; Conditions</h2>
    </div>
    <p>The following terms and conditions govern the engagement between Opti Matrix Solutions and ${project.clientName || 'the Client'} for the execution of this project.</p>
    <div class="terms-grid">
      ${generateTermsAndConditions()}
    </div>
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 9</span>
  </div>
</div>

<!-- ==================== SUPPORT & SIGNATURES ==================== -->
<div class="page">
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">13</span> Support &amp; Maintenance</h2>
    </div>
    <p>We provide comprehensive post-delivery support to ensure smooth operation and long-term success of your project.</p>
    ${generateSupportSection()}
  </div>
  
  <div class="section no-break-inside">
    <div class="section-header">
      <h2><span class="section-num">14</span> Signatures</h2>
    </div>
    <p>By signing below, both parties acknowledge and agree to the terms, conditions, scope, and deliverables outlined in this proposal document.</p>
    <div class="signature-area">
      <div class="sig-block">
        <div class="sig-label">Client Signature</div>
        <div class="sig-line">${project.clientName || '_________________'}</div>
        <div class="sig-name">${project.clientName || 'Client Name'}</div>
        <div class="sig-role">Authorized Signatory</div>
        <div style="font-size:8pt;color:var(--text-muted);margin-top:2mm;">Date: _________________</div>
      </div>
      <div class="sig-block">
        <div class="sig-label">Company Signature</div>
        <div class="sig-line">Opti Matrix Solutions</div>
        <div class="sig-name">Authorized Representative</div>
        <div class="sig-role">Project Director</div>
        <div style="font-size:8pt;color:var(--text-muted);margin-top:2mm;">Date: ${today}</div>
      </div>
    </div>
  </div>
  
  <div class="page-footer">
    <div class="footer-company">Opti Matrix Solutions</div>
    <div class="footer-contact">
      <span>✉ contact@optimatix.com</span>
      <span>🌐 www.optimatix.com</span>
    </div>
    <span class="page-num">Page 10</span>
  </div>
</div>

<!-- ==================== CONFIDENTIALITY STRIP ==================== -->
<div class="confidential-strip">
  CONFIDENTIAL • This document contains proprietary information intended solely for ${project.clientName || 'the addressee'} • Proposal ID: ${project.projectId || 'N/A'} • Generated: ${today}
</div>

</body>
</html>`;
};

module.exports = { generateProposalHTML };