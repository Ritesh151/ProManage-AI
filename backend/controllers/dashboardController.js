const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
      cancelledProjects,
      statusDistribution,
      projectsByCategory,
      revenueByCategory,
      monthlyProjects,
      monthlyRevenue,
      topScopeItems,
      technologyUsage,
      costDistribution,
      avgCostByCategory,
      proposalStats,
      completedRevenueResult,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Active' }),
      Project.countDocuments({ status: 'Completed' }),
      Project.countDocuments({ status: 'On Hold' }),
      Project.countDocuments({ status: 'Cancelled' }),
      Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Project.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Project.aggregate([
        { $match: { status: 'Completed', cost: { $gt: 0 } } },
        { $group: { _id: '$category', total: { $sum: '$cost' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Project.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Project.aggregate([
        { $match: { status: 'Completed', cost: { $gt: 0 } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$updatedAt' } },
            revenue: { $sum: '$cost' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Project.aggregate([
        { $unwind: '$scopeOfWork' },
        { $group: { _id: '$scopeOfWork', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Project.aggregate([
        { $project: { allTech: { $concatArrays: ['$technologies.frontend', '$technologies.backend', '$technologies.database', '$technologies.other'] } } },
        { $unwind: '$allTech' },
        { $group: { _id: '$allTech', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Project.aggregate([
        {
          $bucket: {
            groupBy: '$cost',
            boundaries: [0, 10000, 50000, 100000, 500000, 1000000, Infinity],
            default: 'Unknown',
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      Project.aggregate([
        { $group: { _id: '$category', avgCost: { $avg: '$cost' }, count: { $sum: 1 } } },
        { $sort: { avgCost: -1 } },
      ]),
      Project.aggregate([
        {
          $group: {
            _id: null,
            withProposal: { $sum: { $cond: ['$proposalGenerated', 1, 0] } },
            withoutProposal: { $sum: { $cond: ['$proposalGenerated', 0, 1] } },
          },
        },
      ]),
      Project.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$cost' } } },
      ]),
    ]);

    const totalRevenue = completedRevenueResult.length > 0 ? completedRevenueResult[0].total : 0;

    const overview = [
      { label: 'Total Projects', value: totalProjects },
      { label: 'Active Projects', value: activeProjects },
      { label: 'Completed Projects', value: completedProjects },
      { label: 'Total Revenue', value: totalRevenue },
    ];

    ApiResponse.success(res, {
      overview,
      statusDistribution,
      projectsByCategory,
      revenueByCategory,
      monthlyProjects,
      monthlyRevenue,
      topScopeItems,
      technologyUsage,
      costDistribution,
      avgCostByCategory,
      proposalStats: proposalStats[0] || { withProposal: 0, withoutProposal: totalProjects },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
