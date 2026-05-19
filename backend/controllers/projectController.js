const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');

const createProject = async (req, res, next) => {
  try {
    const lastProject = await Project.findOne({}).sort({ srNo: -1 });
    const nextSrNo = lastProject ? lastProject.srNo + 1 : 1;
    const projectId = `PROJ-${String(nextSrNo).padStart(4, '0')}`;
    const projectData = {
      ...req.body,
      srNo: nextSrNo,
      projectId,
      technologies: typeof req.body.technologies === 'object' ? req.body.technologies : {},
    };
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
        { technologies: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
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
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
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
