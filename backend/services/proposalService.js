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

*{
margin:0;
padding:0;
box-sizing:border-box;
}

:root{

--bg:#efefef;
--card:#ffffff;

--text:#111111;
--text-light:#777777;

--border:#e2e2e2;
--border-dark:#cfcfcf;

--radius:24px;

}

body{

font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;

background:var(--bg);

padding:40px;

font-size:14px;

line-height:1.8;

color:var(--text);

}

.page{

width:100%;
max-width:1300px;

margin:auto;

background:none;

padding:0;

min-height:auto;

}

.cover,
.toc-page,
.page-footer,
.confidential-strip,
.watermark{
display:none;
}


/* MAIN SECTION */

.section{

background:var(--card);

border-radius:var(--radius);

padding:40px;

margin-bottom:28px;

border:1px solid var(--border);

position:relative;

overflow:hidden;

}

.section::before{

content:'';

position:absolute;

top:0;
left:0;

width:100%;
height:4px;

background:#111;

opacity:.08;
}

.section-header{

margin-bottom:30px;

}

.section-header::after{
display:none;
}

.section-header h2{

font-size:32px;

font-weight:800;

letter-spacing:-1.2px;

display:flex;

align-items:center;

gap:16px;
}

.section-num{

width:46px;
height:46px;

display:flex;
justify-content:center;
align-items:center;

border-radius:50%;

border:1px solid var(--border);

font-size:14px;

font-weight:700;

background:white;

}

.section p{

color:var(--text-light);

margin-bottom:15px;
}


/* GRIDS */

.summary-highlights,
.understanding-grid,
.scope-grid,
.deliverables-grid,
.payment-milestones,
.support-grid,
.about-grid,
.tech-stack-grid,
.assumptions-grid,
.terms-grid{

display:grid;

gap:20px;

margin-top:20px;
}

.summary-highlights{

grid-template-columns:repeat(3,1fr);

}

.understanding-grid,
.scope-grid,
.deliverables-grid,
.about-grid,
.tech-stack-grid,
.payment-milestones,
.support-grid,
.terms-grid{

grid-template-columns:repeat(2,1fr);

}

.assumptions-grid{

grid-template-columns:repeat(3,1fr);

}


/* CARDS */

.highlight-card,
.scope-card,
.tech-card,
.deliverable-card,
.milestone-card,
.assumption-card,
.term-card,
.about-card,
.support-card,
.understanding-card{

background:white;

border-radius:18px;

padding:24px;

border:1px solid var(--border);

transition:.3s;

}

.highlight-card:hover,
.scope-card:hover,
.tech-card:hover,
.deliverable-card:hover,
.milestone-card:hover{

transform:translateY(-5px);

border-color:var(--border-dark);

box-shadow:

0 15px 30px rgba(0,0,0,.04);

}

h4{

font-size:15px;

font-weight:700;

margin-bottom:10px;
}

.highlight-icon,
.support-icon,
.tech-icon,
.deliverable-icon{

font-size:22px;

margin-bottom:15px;

}


/* CARD HEADERS */

.scope-card-header,
.tech-card-header{

display:flex;

align-items:center;

gap:10px;

padding-bottom:12px;

margin-bottom:15px;

border-bottom:1px solid var(--border);

background:none;
}

.scope-num{

font-size:13px;

font-weight:700;

color:#999;
}


/* TECH */

.tech-badges{

display:flex;

flex-wrap:wrap;

gap:10px;
}

.tech-badge{

padding:8px 14px;

background:#f6f6f6;

border-radius:50px;

font-size:12px;

border:1px solid #eee;
}


/* TIMELINE */

.timeline-roadmap{

position:relative;

padding-left:35px;

}

.timeline-roadmap::before{

content:'';

position:absolute;

left:15px;

top:0;
bottom:0;

width:2px;

background:#ddd;
}

.timeline-card{

display:flex;

gap:18px;

margin-bottom:20px;

}

.timeline-marker{

height:35px;
width:35px;

border-radius:50%;

border:1px solid #ddd;

background:white;

display:flex;
justify-content:center;
align-items:center;

font-size:12px;
font-weight:700;

margin-left:-35px;

}

.timeline-content{

background:white;

padding:20px;

border-radius:16px;

border:1px solid var(--border);

flex:1;

}

.timeline-meta{

display:flex;

justify-content:space-between;

margin-top:12px;
}

.timeline-days{

padding:5px 12px;

border-radius:50px;

background:#f4f4f4;

font-size:12px;
}


/* TABLES */

.cost-table,
.risk-table{

width:100%;

border-collapse:collapse;

overflow:hidden;

border-radius:18px;

margin-top:20px;

}

.cost-table th,
.risk-table th{

background:#f8f8f8;

padding:16px;

text-align:left;

font-size:13px;

}

.cost-table td,
.risk-table td{

padding:16px;

border-top:1px solid var(--border);

}

.grand-total td{

font-weight:700;

background:#fafafa;
}


/* SIGNATURE */

.signature-area{

display:grid;

grid-template-columns:1fr 1fr;

gap:70px;

margin-top:60px;
}

.sig-line{

margin-top:60px;

padding-top:15px;

border-top:1px solid black;

font-weight:700;
}


/* MOBILE */

@media(max-width:768px){

.summary-highlights,
.understanding-grid,
.scope-grid,
.deliverables-grid,
.payment-milestones,
.support-grid,
.about-grid,
.tech-stack-grid,
.assumptions-grid,
.terms-grid,
.signature-area{

grid-template-columns:1fr;

}

body{
padding:15px;
}

.section{
padding:25px;
}

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
    <li class="toc-item"><span class="toc-num">13</span><span class="toc-label">Support &amp; Maintenance</span><span class="toc-dots"></span><span class="toc-page-num">14</span></li>
  </ul>
</div>

<!-- ==================== EXECUTIVE SUMMARY ==================== -->
<div class="page">
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">01</span> Executive Summary</h2>
    </div>
    ${generateExecutiveSummary()}
  </div>
  
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">02</span> About Our Company</h2>
    </div>
    <p><strong>Opti Matrix Solutions</strong> is a premier technology consulting and software development company with over 16 years of industry experience. We specialize in delivering cutting-edge digital solutions that transform businesses and drive growth.</p>
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


<!-- ==================== PROJECT UNDERSTANDING ==================== -->
<div class="page">
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">03</span> Project Understanding</h2>
    </div>
    ${generateProjectUnderstanding()}
  </div>
  
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">04</span> Scope of Work</h2>
    </div>
    <p>Our comprehensive scope of work encompasses all phases of the project lifecycle, ensuring complete coverage of requirements and delivering a production-ready solution.</p>
    <div class="scope-grid">
      ${generateScopeCards()}
    </div>
  </div>
</div>

<!-- ==================== DELIVERABLES & TIMELINE ==================== -->
<div class="page">
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">05</span> Project Deliverables</h2>
    </div>
    <p>Upon successful completion of the project, the following deliverables will be provided to ensure complete handover and operational readiness.</p>
    <div class="deliverables-grid">
      ${generateDeliverables()}
    </div>
  </div>
  
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">06</span> Project Timeline</h2>
    </div>
    <p>The project will be executed over a period of <strong>30 working days</strong>, following a structured phase-wise approach to ensure quality and timely delivery.</p>
    <div class="timeline-roadmap">
      ${generateTimeline()}
    </div>
  </div>
  </div>

<!-- ==================== TECH STACK ==================== -->
<div class="page">
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">07</span> Technology Stack</h2>
    </div>
    <p>We leverage industry-leading technologies and frameworks to build robust, scalable, and future-proof solutions tailored to your project requirements.</p>
    <div class="tech-stack-grid">
      ${generateTechGrid()}
    </div>
  </div>
  
  </div>
</div>

<!-- ==================== COST ESTIMATION ==================== -->
<div class="page">
  <div class="section pdf-section">
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
  
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">09</span> Payment Terms</h2>
    </div>
    <p>Our milestone-based payment structure ensures transparency and aligns payment schedules with project progress.</p>
    ${generatePaymentSection()}
  </div>
  
</div>

<!-- ==================== ASSUMPTIONS & RISK ==================== -->
<div class="page">
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">10</span> Project Assumptions</h2>
    </div>
    <p>The successful execution of this project is based on the following assumptions regarding client responsibilities, third-party dependencies, and resource availability.</p>
    ${generateAssumptions()}
  </div>
  
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">11</span> Risk Assessment</h2>
    </div>
    <p>We have identified potential risks and developed comprehensive mitigation strategies to ensure project success.</p>
    <div class="risk-table-wrapper">
      ${generateRiskAssessment()}
    </div>
  </div>

<!-- ==================== TERMS & CONDITIONS ==================== -->
<div class="page">
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">12</span> Terms &amp; Conditions</h2>
    </div>
    <p>The following terms and conditions govern the engagement between Opti Matrix Solutions and ${project.clientName || 'the Client'} for the execution of this project.</p>
    <div class="terms-grid">
      ${generateTermsAndConditions()}
    </div>
  </div>
</div>

<!-- ==================== SUPPORT & SIGNATURES ==================== -->
<div class="page">
  <div class="section pdf-section">
    <div class="section-header">
      <h2><span class="section-num">13</span> Support &amp; Maintenance</h2>
    </div>
    <p>We provide comprehensive post-delivery support to ensure smooth operation and long-term success of your project.</p>
    ${generateSupportSection()}
  </div>
  
  <div class="section pdf-section">
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
</body>
</html>`;
};

module.exports = { generateProposalHTML };