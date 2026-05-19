const ApiResponse = require('../utils/apiResponse');
const { scopeByCategory, getCategoriesList } = require('../data/categories');

const getCategories = async (req, res, next) => {
  try {
    ApiResponse.success(res, {
      scopeByCategory,
      categories: getCategoriesList(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };
