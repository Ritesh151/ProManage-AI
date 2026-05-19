const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const [
      totalProjects,
      activeProjects,
      generatedProposals,
      revenueResult,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Active' }),
      Project.countDocuments({ proposalGenerated: true }),
      Project.aggregate([
        { $group: { _id: null, total: { $sum: '$cost' } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const stats = [
      { label: 'Total Projects', value: totalProjects },
      { label: 'Active Projects', value: activeProjects },
      { label: 'Generated Proposals', value: generatedProposals },
      { label: 'Total Revenue', value: totalRevenue },
    ];

    ApiResponse.success(res, stats);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
