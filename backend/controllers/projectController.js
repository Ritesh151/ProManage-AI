const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');

const generateProjectId = async () => {
  const year = new Date().getFullYear();
  const lastProject = await Project.findOne({ projectId: { $regex: `^PF-${year}` } }).sort({ projectId: -1 });
  
  let nextNumber = 1001;
  if (lastProject) {
    const match = lastProject.projectId.match(/PF-\d+-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }
  
  return `PF-${year}-${nextNumber}`;
};

const createProject = async (req, res, next) => {
  try {
    const lastProject = await Project.findOne({}).sort({ srNo: -1 });
    const nextSrNo = lastProject ? lastProject.srNo + 1 : 1;
    const projectId = await generateProjectId();

    const projectData = {
      ...req.body,
      srNo: nextSrNo,
      projectId,
      inquiryDate: req.body.inquiryDate || new Date(),
      technologies: req.body.technologies || { frontend: [], backend: [], database: [], other: [] },
      features: req.body.features || [],
      customFeatures: req.body.customFeatures || [],
      socialMediaProfiles: req.body.socialMediaProfiles || { instagram: '', facebook: '', linkedin: '', other: '' },
    };

    // Validate required fields
    if (!projectData.clientName) throw new Error('Client name is required');
    if (!projectData.clientMobileNumber) throw new Error('Client mobile number is required');
    if (!projectData.companyName) throw new Error('Company name is required');
    if (!projectData.projectName) throw new Error('Project name is required');
    if (!projectData.category) throw new Error('Category is required');
    if (!projectData.scopeOfWork || projectData.scopeOfWork.length === 0) throw new Error('Scope of work is required');

    const project = await Project.create(projectData);
    ApiResponse.success(res, project, null, 201);
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search || '';
    const status = req.query.status || '';
    const category = req.query.category || '';
    const sort = req.query.sort || '-createdAt';

    const query = {};
    if (search) {
      query.$or = [
        { projectId: { $regex: search, $options: 'i' } },
        { projectName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const [total, projects] = await Promise.all([
      Project.countDocuments(query),
      Project.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    ApiResponse.paginated(res, projects, page, limit, total);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return ApiResponse.error(res, null, 404);
    }
    ApiResponse.success(res, project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const updateData = {
      ...req.body,
      technologies: req.body.technologies || { frontend: [], backend: [], database: [], other: [] },
      features: req.body.features || [],
      customFeatures: req.body.customFeatures || [],
      socialMediaProfiles: req.body.socialMediaProfiles || { instagram: '', facebook: '', linkedin: '', other: '' },
    };

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return ApiResponse.error(res, null, 404);
    }
    ApiResponse.success(res, project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return ApiResponse.error(res, null, 404);
    }
    ApiResponse.success(res, null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
