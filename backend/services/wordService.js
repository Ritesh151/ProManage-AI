const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, HeadingLevel,
} = require('docx');

const generateWord = async (project) => {
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const scopeList = Array.isArray(project.scopeOfWork) && project.scopeOfWork.length > 0
    ? project.scopeOfWork
    : ['Full project development lifecycle'];

  const costItems = Array.isArray(project.costBreakdown) && project.costBreakdown.length > 0
    ? project.costBreakdown
    : [{ name: 'Project Development', amount: project.cost || 0 }];

  const heading1 = (text) => new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
  });

  const heading2 = (text) => new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });

  const bodyText = (text) => new Paragraph({
    text,
    spacing: { after: 120 },
    alignment: AlignmentType.JUSTIFIED,
  });

  const spacer = (pts = 200) => new Paragraph({ spacing: { after: pts } });

  const tableRow = (cells, isHeader = false) => new TableRow({
    children: cells.map((cell) => new TableCell({
      children: [new Paragraph({
        text: cell,
        bold: isHeader,
        color: isHeader ? 'FFFFFF' : '1E293B',
        alignment: isHeader ? AlignmentType.LEFT : AlignmentType.RIGHT,
      })],
      shading: isHeader ? { type: 'clear', fill: '1E3A5F' } : undefined,
    })),
  });

  return Packer.toBuffer(new Document({
    sections: [
      // Cover Page
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
          },
        },
        children: [
          spacer(4000),
          new Paragraph({
            text: 'Opti Matrix Solutions',
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'FFFFFF', space: 1 },
            },
          }),
          spacer(600),
          new Paragraph({
            text: 'PROJECT PROPOSAL',
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),
          spacer(400),
          new Paragraph({
            text: 'Project Name',
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: project.projectName || '',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          spacer(200),
          new Paragraph({
            text: `Date: ${today}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'Prepared by: Opti Matrix Solutions',
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Proposal ID: ${project.projectId || ''}`,
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
      // Content pages
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          // 1. Executive Summary
          heading2('1. Executive Summary'),
          bodyText('This proposal outlines the complete project development strategy, implementation process, deliverables, timeline and cost estimation. Our approach ensures a structured, transparent, and results-driven execution that aligns with industry best practices and client requirements.'),
          bodyText('We are committed to delivering a high-quality solution that meets the specified objectives within the agreed timeframe and budget. This document serves as the formal agreement between the client and Opti Matrix Solutions for the execution of the described project.'),

          // 2. Project Description
          heading2('2. Project Description'),
          bodyText('Opti Matrix Solutions is a leading technology company specializing in custom software development, web applications, mobile solutions, and digital transformation services. With a team of experienced developers, designers, and project managers, we deliver scalable, secure, and high-performance solutions tailored to client needs.'),
          bodyText('Our development process follows agile methodologies, ensuring continuous collaboration, transparency, and iterative improvements throughout the project lifecycle. We prioritize quality, performance, and user experience in every deliverable.'),

          // 3. Scope of Work
          heading2('3. Scope of Work'),
          ...scopeList.map((s) => new Paragraph({
            text: `\u2022  ${s}`,
            spacing: { after: 80 },
          })),

          // 4. Timeline
          heading2('4. Timeline'),
          ...(() => {
            const phases = [
              ['Requirement Analysis', '2 Days'],
              ['UI/UX Design', '4 Days'],
              ['Development', '10 Days'],
              ['Testing', '3 Days'],
              ['Deployment', '1 Day'],
            ];
            return phases.map(([phase, dur]) => new Paragraph({
              children: [
                new TextRun({ text: phase, bold: true }),
                new TextRun({ text: `  ${dur}`, color: '2563EB' }),
              ],
              spacing: { after: 100 },
            }));
          })(),

          // 5. Cost Estimation
          heading2('5. Cost Estimation'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              tableRow(['Module / Service', 'Amount'], true),
              ...costItems.map((item) => tableRow([
                item.name,
                `\u20B9${Number(item.amount).toLocaleString('en-IN')}`,
              ])),
              tableRow(['Total Project Cost', `\u20B9${(project.cost || 0).toLocaleString('en-IN')}`]),
            ],
          }),

          spacer(200),

          // 6. Technologies
          heading2('6. Technologies'),
          ...(() => {
            const getTechs = () => {
              if (Array.isArray(project.technologies)) {
                return [['Technologies', project.technologies.join(', ')]];
              }
              const t = [];
              if (project.technologies) {
                if (project.technologies.frontend?.length > 0) t.push(['Frontend', project.technologies.frontend.join(', ')]);
                if (project.technologies.backend?.length > 0) t.push(['Backend', project.technologies.backend.join(', ')]);
                if (project.technologies.database?.length > 0) t.push(['Database', project.technologies.database.join(', ')]);
                if (project.technologies.other?.length > 0) t.push(['Tools / Other', project.technologies.other.join(', ')]);
              }
              return t.length > 0 ? t : [['Technologies', 'Not specified']];
            };
            const techs = getTechs();
            return techs.flatMap(([cat, val]) => [
              new Paragraph({ text: cat, bold: true, spacing: { before: 120 } }),
              new Paragraph({ text: val, spacing: { after: 80 } }),
            ]);
          })(),

          // 7. Payment Terms
          heading2('7. Payment Terms'),
          ...(() => {
            const terms = [
              ['50%', 'Advance'],
              ['30%', 'Mid Project'],
              ['20%', 'Final Delivery'],
            ];
            return terms.map(([pct, label]) => new Paragraph({
              children: [
                new TextRun({ text: `${pct}  `, bold: true, color: '2563EB' }),
                new TextRun({ text: label }),
              ],
              spacing: { after: 100 },
            }));
          })(),

          // 8. Terms & Conditions
          heading2('8. Terms & Conditions'),
          ...[
            'Scope changes may affect timeline and cost. Any modifications outside the agreed scope will be evaluated and quoted separately.',
            'Payment once completed cannot be refunded. All payments are final and non-refundable after the respective milestone is delivered.',
            'Additional requirements will be charged separately. Features or changes requested after the scope finalization will incur additional costs.',
            'Maintenance outside agreement not included. Post-delivery maintenance and support require a separate maintenance agreement.',
            'Confidentiality of all project materials, code, and data will be maintained throughout and after the engagement.',
          ].map((t) => new Paragraph({
            text: `\u2713  ${t}`,
            spacing: { after: 100 },
          })),

          // 9. Signatures
          heading2('9. Signatures'),
          bodyText('By signing below, both parties acknowledge and agree to the terms and conditions outlined in this proposal.'),
          spacer(400),
          new Paragraph({
            children: [
              new TextRun({ text: 'Client Signature', color: '64748B', size: 20 }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: project.clientName || '_________________',
            bold: true,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Developer Signature', color: '64748B', size: 20 }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'Opti Matrix Solutions',
            bold: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
          }),
          spacer(400),
          new Paragraph({
            text: `Generated on ${today}  |  Opti Matrix Solutions  |  ${project.projectId || ''}`,
            alignment: AlignmentType.CENTER,
            color: '94A3B8',
            size: 20,
          }),
        ],
      },
    ],
  }));
};

module.exports = { generateWord };
