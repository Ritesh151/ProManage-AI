const Project = require('../models/Project');

const getOverviewStats = async () => {
  const [
    totalProjects,
    activeProjects,
    completedProjects,
    pendingProjects,
    cancelledProjects,
    onHoldProjects,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'Active' }),
    Project.countDocuments({ status: 'Completed' }),
    Project.countDocuments({ status: 'Pending' }),
    Project.countDocuments({ status: 'Cancelled' }),
    Project.countDocuments({ status: 'On Hold' }),
  ]);

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    pendingProjects,
    cancelledProjects,
    onHoldProjects,
  };
};

const getRevenueStats = async () => {
  const completedRevenueResult = await Project.aggregate([
    { $match: { status: 'Completed', cost: { $gt: 0 } } },
    { $group: { _id: null, total: { $sum: '$cost' } } },
  ]);

  const totalRevenue = completedRevenueResult.length > 0 ? completedRevenueResult[0].total : 0;

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = currentMonthStart;

  const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
    Project.aggregate([
      { $match: { status: 'Completed', cost: { $gt: 0 }, updatedAt: { $gte: currentMonthStart } } },
      { $group: { _id: null, total: { $sum: '$cost' } } },
    ]),
    Project.aggregate([
      { $match: { status: 'Completed', cost: { $gt: 0 }, updatedAt: { $gte: lastMonthStart, $lt: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$cost' } } },
    ]),
  ]);

  const currentMonth = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;
  const lastMonth = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;
  const monthlyGrowth = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : currentMonth > 0 ? 100 : 0;

  return { totalRevenue, currentMonth, lastMonth, monthlyGrowth };
};

const getMonthlyRevenue = async () => {
  const monthlyRevenue = await Project.aggregate([
    { $match: { status: 'Completed', cost: { $gt: 0 } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$updatedAt' } },
        revenue: { $sum: '$cost' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return monthlyRevenue.map((item) => {
    const [year, month] = item._id.split('-');
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year}`,
      revenue: item.revenue,
      count: item.count,
    };
  });
};

const getCategoryDistribution = async () => {
  return Project.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

const getStatusDistribution = async () => {
  return Project.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

const getRevenueByCategory = async () => {
  return Project.aggregate([
    { $match: { status: 'Completed', cost: { $gt: 0 } } },
    { $group: { _id: '$category', total: { $sum: '$cost' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
};

const getMonthlyProjects = async () => {
  return Project.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getTopScopeItems = async () => {
  return Project.aggregate([
    { $unwind: '$scopeOfWork' },
    { $group: { _id: '$scopeOfWork', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
};

const getTechnologyUsage = async () => {
  return Project.aggregate([
    { $project: { allTech: { $concatArrays: ['$technologies.frontend', '$technologies.backend', '$technologies.database', '$technologies.other'] } } },
    { $unwind: '$allTech' },
    { $group: { _id: '$allTech', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
};

const getCostDistribution = async () => {
  return Project.aggregate([
    {
      $bucket: {
        groupBy: '$cost',
        boundaries: [0, 10000, 50000, 100000, 500000, 1000000, Infinity],
        default: 'Unknown',
        output: { count: { $sum: 1 } },
      },
    },
  ]);
};

const getAvgCostByCategory = async () => {
  return Project.aggregate([
    { $group: { _id: '$category', avgCost: { $avg: '$cost' }, count: { $sum: 1 } } },
    { $sort: { avgCost: -1 } },
  ]);
};

const getProposalStats = async () => {
  const totalProjects = await Project.countDocuments();
  const result = await Project.aggregate([
    {
      $group: {
        _id: null,
        withProposal: { $sum: { $cond: ['$proposalGenerated', 1, 0] } },
        withoutProposal: { $sum: { $cond: ['$proposalGenerated', 0, 1] } },
      },
    },
  ]);

  return result[0] || { withProposal: 0, withoutProposal: totalProjects };
};

const getRecentActivities = async (limit = 10) => {
  return Project.find({})
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('projectName status category updatedAt cost');
};

const getTimelineStats = async () => {
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [last7DaysCount, last30DaysCount, last90DaysCount] = await Promise.all([
    Project.countDocuments({ createdAt: { $gte: last7Days } }),
    Project.countDocuments({ createdAt: { $gte: last30Days } }),
    Project.countDocuments({ createdAt: { $gte: last90Days } }),
  ]);

  return { last7Days: last7DaysCount, last30Days: last30DaysCount, last90Days: last90DaysCount };
};

const getAverageProjectCost = async () => {
  const result = await Project.aggregate([
    { $match: { cost: { $gt: 0 } } },
    { $group: { _id: null, avgCost: { $avg: '$cost' } } },
  ]);

  return result.length > 0 ? result[0].avgCost : 0;
};

const getAIUsageStats = async () => {
  const totalProjects = await Project.countDocuments();
  const withProposal = await Project.countDocuments({ proposalGenerated: true });

  return {
    totalProjects,
    proposalsGenerated: withProposal,
    proposalRate: totalProjects > 0 ? (withProposal / totalProjects) * 100 : 0,
  };
};

const getExportStats = async () => {
  const totalProjects = await Project.countDocuments();

  return {
    totalProjects,
    exportableProjects: totalProjects,
  };
};

const getFullAnalytics = async () => {
  const [
    overview,
    revenue,
    monthlyRevenue,
    categoryDistribution,
    statusDistribution,
    revenueByCategory,
    monthlyProjects,
    topScopeItems,
    technologyUsage,
    costDistribution,
    avgCostByCategory,
    proposalStats,
    recentActivities,
    timelineStats,
    averageProjectCost,
    aiUsage,
    exportStats,
  ] = await Promise.all([
    getOverviewStats(),
    getRevenueStats(),
    getMonthlyRevenue(),
    getCategoryDistribution(),
    getStatusDistribution(),
    getRevenueByCategory(),
    getMonthlyProjects(),
    getTopScopeItems(),
    getTechnologyUsage(),
    getCostDistribution(),
    getAvgCostByCategory(),
    getProposalStats(),
    getRecentActivities(),
    getTimelineStats(),
    getAverageProjectCost(),
    getAIUsageStats(),
    getExportStats(),
  ]);

  const totalRevenue = revenue.totalRevenue;
  const totalProjects = overview.totalProjects;
  const averageProjectValue = totalProjects > 0 ? totalRevenue / totalProjects : 0;

  return {
    overview: {
      totalProjects: overview.totalProjects,
      activeProjects: overview.activeProjects,
      completedProjects: overview.completedProjects,
      pendingProjects: overview.pendingProjects,
      cancelledProjects: overview.cancelledProjects,
      onHoldProjects: overview.onHoldProjects,
      totalRevenue,
      monthlyGrowth: parseFloat(revenue.monthlyGrowth.toFixed(2)),
      averageProjectValue: parseFloat(averageProjectValue.toFixed(2)),
    },
    revenue: {
      total: totalRevenue,
      currentMonth: revenue.currentMonth,
      lastMonth: revenue.lastMonth,
      monthlyGrowth: parseFloat(revenue.monthlyGrowth.toFixed(2)),
      monthlyData: monthlyRevenue,
    },
    categoryDistribution,
    statusDistribution,
    revenueByCategory,
    monthlyProjects,
    topScopeItems,
    technologyUsage,
    costDistribution,
    avgCostByCategory,
    proposalStats,
    recentActivities: recentActivities.map((activity) => ({
      id: activity._id,
      description: `Project "${activity.projectName}" ${activity.status ? `is ${activity.status}` : 'was updated'}`,
      timestamp: activity.updatedAt,
      category: activity.category,
      cost: activity.cost,
    })),
    timelineStats,
    averageProjectCost: parseFloat(averageProjectCost.toFixed(2)),
    aiUsage,
    exportStats,
  };
};

module.exports = {
  getOverviewStats,
  getRevenueStats,
  getMonthlyRevenue,
  getCategoryDistribution,
  getStatusDistribution,
  getRevenueByCategory,
  getMonthlyProjects,
  getTopScopeItems,
  getTechnologyUsage,
  getCostDistribution,
  getAvgCostByCategory,
  getProposalStats,
  getRecentActivities,
  getTimelineStats,
  getAverageProjectCost,
  getAIUsageStats,
  getExportStats,
  getFullAnalytics,
};
