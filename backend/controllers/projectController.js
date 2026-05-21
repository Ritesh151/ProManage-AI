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

    const {
      clientName,
      clientMobileNumber,
      clientEmail,
      inquiryDate,
      companyName,
      companyLocation,
      businessType,
      yourServices,
      yearsInBusiness,
      hasSalesTeam,
      hasSocialMedia,
      socialMediaProfiles,
      annualTurnover,
      currentGoogleRanking,
      hasGoogleBusinessProfile,
      hasClientDomain,
      hasClientLogo,
      hasClientContent,
      features,
      customFeatures,
      branch,
      projectName,
      category,
      projectCategory,
      scopeOfWork,
      scopeOfWorkDetails,
      projectDetails,
      numberOfPages,
      technologies,
      timeline,
      timelineValue,
      timelineUnit,
      cost,
      scopeCost,
      extrasCost,
      pagesCost,
      timelineExtraCost,
      projectEndDate,
      status,
    } = req.body;

    if (!clientName || !clientName.trim()) throw new Error('Client name is required');
    if (!clientMobileNumber || !clientMobileNumber.trim()) throw new Error('Client mobile number is required');
    if (!/^[6-9]\d{9}$/.test(clientMobileNumber.replace(/\D/g, ''))) throw new Error('Invalid Indian mobile number');
    if (clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) throw new Error('Invalid email address');
    if (!companyName || !companyName.trim()) throw new Error('Company name is required');
    if (!projectName || !projectName.trim()) throw new Error('Project name is required');
    if (!category) throw new Error('Project category is required');
    if (!scopeOfWork || !Array.isArray(scopeOfWork) || scopeOfWork.length === 0) throw new Error('Scope of work is required');
    if (!timeline) throw new Error('Timeline is required');

    const calculatedScopeCost = Array.isArray(scopeOfWorkDetails)
      ? scopeOfWorkDetails.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;

    const numPages = numberOfPages ? parseInt(numberOfPages) : 0;
    const calculatedPagesCost = numPages * 1500;

    const timelineMonths = timelineUnit === 'Months'
      ? parseInt(timelineValue) || 0
      : timelineUnit === 'Weeks'
      ? Math.ceil((parseInt(timelineValue) || 0) / 4.33)
      : Math.ceil((parseInt(timelineValue) || 0) / 30);

    let calculatedTimelineExtraCost = 0;
    if (timelineMonths === 1) {
      calculatedTimelineExtraCost = Math.round(calculatedScopeCost * 0.05);
    } else if (timelineMonths === 2) {
      calculatedTimelineExtraCost = Math.round(calculatedScopeCost * 0.10);
    }

    const extrasCount = [
      !hasClientDomain,
      !hasClientLogo,
      !hasClientContent,
    ].filter(Boolean).length;
    const calculatedExtrasCost = extrasCount * 1500;

    const calculatedGrandTotal = calculatedScopeCost + calculatedExtrasCost + calculatedPagesCost + calculatedTimelineExtraCost;

    const projectData = {
      srNo: nextSrNo,
      projectId,
      clientName: clientName.trim(),
      clientMobileNumber: clientMobileNumber.trim(),
      clientEmail: clientEmail ? clientEmail.trim() : undefined,
      inquiryDate: inquiryDate || new Date(),
      companyName: companyName.trim(),
      companyLocation: companyLocation ? companyLocation.trim() : undefined,
      businessType,
      yourServices: yourServices ? yourServices.trim() : undefined,
      yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : undefined,
      hasSalesTeam: hasSalesTeam === true || hasSalesTeam === 'true' ? true : hasSalesTeam === false || hasSalesTeam === 'false' ? false : undefined,
      hasSocialMedia: !!hasSocialMedia,
      socialMediaProfiles: socialMediaProfiles || { instagram: '', facebook: '', linkedin: '', other: '' },
      annualTurnover,
      currentGoogleRanking,
      hasGoogleBusinessProfile: !!hasGoogleBusinessProfile,
      hasClientDomain: !!hasClientDomain,
      hasClientLogo: !!hasClientLogo,
      hasClientContent: !!hasClientContent,
      features: Array.isArray(features) ? features : [],
      customFeatures: Array.isArray(customFeatures) ? customFeatures : [],
      branch,
      projectName: projectName.trim(),
      category,
      projectCategory: projectCategory || { id: '', name: category },
      scopeOfWork: Array.isArray(scopeOfWork) ? scopeOfWork : [],
      scopeOfWorkDetails: Array.isArray(scopeOfWorkDetails) ? scopeOfWorkDetails : [],
      projectDetails: projectDetails ? projectDetails.trim() : undefined,
      numberOfPages: numPages || undefined,
      technologies: technologies || { frontend: [], backend: [], database: [], other: [] },
      timeline,
      timelineValue: timelineValue ? parseInt(timelineValue) : undefined,
      timelineUnit,
      cost: calculatedGrandTotal,
      scopeCost: calculatedScopeCost,
      extrasCost: calculatedExtrasCost,
      pagesCost: calculatedPagesCost,
      timelineExtraCost: calculatedTimelineExtraCost,
      projectEndDate: projectEndDate || undefined,
      status: status || 'Active',
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
    const {
      clientName,
      clientMobileNumber,
      clientEmail,
      inquiryDate,
      companyName,
      companyLocation,
      businessType,
      yourServices,
      yearsInBusiness,
      hasSalesTeam,
      hasSocialMedia,
      socialMediaProfiles,
      annualTurnover,
      currentGoogleRanking,
      hasGoogleBusinessProfile,
      hasClientDomain,
      hasClientLogo,
      hasClientContent,
      features,
      customFeatures,
      branch,
      projectName,
      category,
      projectCategory,
      scopeOfWork,
      scopeOfWorkDetails,
      projectDetails,
      numberOfPages,
      technologies,
      timeline,
      timelineValue,
      timelineUnit,
      cost,
      scopeCost,
      extrasCost,
      pagesCost,
      timelineExtraCost,
      projectEndDate,
      status,
    } = req.body;

    if (clientMobileNumber && !/^[6-9]\d{9}$/.test(clientMobileNumber.replace(/\D/g, ''))) {
      throw new Error('Invalid Indian mobile number');
    }
    if (clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      throw new Error('Invalid email address');
    }

    const calcScopeCost = Array.isArray(scopeOfWorkDetails)
      ? scopeOfWorkDetails.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;

    const calcNumPages = numberOfPages ? parseInt(numberOfPages) : 0;
    const calcPagesCost = calcNumPages * 1500;

    const calcTimelineMonths = timelineUnit === 'Months'
      ? parseInt(timelineValue) || 0
      : timelineUnit === 'Weeks'
      ? Math.ceil((parseInt(timelineValue) || 0) / 4.33)
      : Math.ceil((parseInt(timelineValue) || 0) / 30);

    let calcTimelineExtraCost = 0;
    if (calcTimelineMonths === 1) {
      calcTimelineExtraCost = Math.round(calcScopeCost * 0.05);
    } else if (calcTimelineMonths === 2) {
      calcTimelineExtraCost = Math.round(calcScopeCost * 0.10);
    }

    const calcExtrasCount = [
      !hasClientDomain,
      !hasClientLogo,
      !hasClientContent,
    ].filter(Boolean).length;
    const calcExtrasCost = calcExtrasCount * 1500;

    const calcGrandTotal = calcScopeCost + calcExtrasCost + calcPagesCost + calcTimelineExtraCost;

    const updateData = {
      clientName: clientName ? clientName.trim() : undefined,
      clientMobileNumber: clientMobileNumber ? clientMobileNumber.trim() : undefined,
      clientEmail: clientEmail ? clientEmail.trim() : undefined,
      inquiryDate: inquiryDate || undefined,
      companyName: companyName ? companyName.trim() : undefined,
      companyLocation: companyLocation ? companyLocation.trim() : undefined,
      businessType,
      yourServices: yourServices ? yourServices.trim() : undefined,
      yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : undefined,
      hasSalesTeam: hasSalesTeam === true || hasSalesTeam === 'true' ? true : hasSalesTeam === false || hasSalesTeam === 'false' ? false : undefined,
      hasSocialMedia: !!hasSocialMedia,
      socialMediaProfiles: socialMediaProfiles || { instagram: '', facebook: '', linkedin: '', other: '' },
      annualTurnover,
      currentGoogleRanking,
      hasGoogleBusinessProfile: !!hasGoogleBusinessProfile,
      hasClientDomain: !!hasClientDomain,
      hasClientLogo: !!hasClientLogo,
      hasClientContent: !!hasClientContent,
      features: Array.isArray(features) ? features : undefined,
      customFeatures: Array.isArray(customFeatures) ? customFeatures : undefined,
      branch,
      projectName: projectName ? projectName.trim() : undefined,
      category,
      projectCategory: projectCategory || undefined,
      scopeOfWork: Array.isArray(scopeOfWork) ? scopeOfWork : undefined,
      scopeOfWorkDetails: Array.isArray(scopeOfWorkDetails) ? scopeOfWorkDetails : undefined,
      projectDetails: projectDetails ? projectDetails.trim() : undefined,
      numberOfPages: calcNumPages || undefined,
      technologies: technologies || { frontend: [], backend: [], database: [], other: [] },
      timeline,
      timelineValue: timelineValue ? parseInt(timelineValue) : undefined,
      timelineUnit,
      cost: calcGrandTotal,
      scopeCost: calcScopeCost,
      extrasCost: calcExtrasCost,
      pagesCost: calcPagesCost,
      timelineExtraCost: calcTimelineExtraCost,
      projectEndDate: projectEndDate || undefined,
      status: status || 'Active',
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

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
