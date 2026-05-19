const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const { generateCSV, generateExcel } = require('../services/exportService');
const { generateExportPDF } = require('../services/pdfService');

const exportCSV = async (req, res, next) => {
  try {
    const projects = await Project.find({}).sort('-createdAt');
    const csv = await generateCSV(projects);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="projects.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
    const projects = await Project.find({}).sort('-createdAt');
    const buffer = await generateExcel(projects);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="projects.xlsx"');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

const exportPDF = async (req, res, next) => {
  try {
    const projects = await Project.find({}).sort('-createdAt');
    const pdfBuffer = await generateExportPDF(projects);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="projects.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportCSV,
  exportExcel,
  exportPDF,
};
