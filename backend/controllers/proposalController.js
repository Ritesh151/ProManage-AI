const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const { generateProposalHTML } = require('../services/proposalService');
const { generatePDF } = require('../services/pdfService');
const { generateWord } = require('../services/wordService');

const generateProposal = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return ApiResponse.error(res, null, 404);
    }
    project.proposalGenerated = true;
    await project.save();
    const html = generateProposalHTML(project);
    ApiResponse.success(res, { html, project });
  } catch (error) {
    next(error);
  }
};

const downloadPDF = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return ApiResponse.error(res, null, 404);
    }
    const html = generateProposalHTML(project);
    const pdfBuffer = await generatePDF(html);
    const filename = `${project.projectName.replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

const downloadWord = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return ApiResponse.error(res, null, 404);
    }
    const docBuffer = await generateWord(project);
    const filename = `${project.projectName.replace(/\s+/g, '_')}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(docBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateProposal,
  downloadPDF,
  downloadWord,
};
