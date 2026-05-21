const scopeService = require('../services/scopeService');

exports.getCategories = async (req, res) => {
  try {
    const { search, priceMin, priceMax, sort } = req.query;
    const filters = {
      search,
      priceMin: priceMin ? parseInt(priceMin) : null,
      priceMax: priceMax ? parseInt(priceMax) : null,
      sort,
    };

    const categories = await scopeService.getCategories(filters);
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await scopeService.getCategory(req.params.id);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon, scopeItems } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const category = await scopeService.createCategory({
      name,
      description,
      icon,
      scopeItems: scopeItems || [],
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const category = await scopeService.updateCategory(req.params.id, {
      name,
      description,
      icon,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await scopeService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createScopeItem = async (req, res) => {
  try {
    const { title, description, price, currency } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: 'Title and price are required',
      });
    }

    const category = await scopeService.createScopeItem(req.params.id, {
      title,
      description,
      price,
      currency: currency || 'INR',
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateScopeItem = async (req, res) => {
  try {
    const { title, description, price, currency } = req.body;
    const category = await scopeService.updateScopeItem(
      req.params.categoryId,
      req.params.itemId,
      {
        title,
        description,
        price,
        currency: currency || 'INR',
      }
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteScopeItem = async (req, res) => {
  try {
    const category = await scopeService.deleteScopeItem(
      req.params.categoryId,
      req.params.itemId
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const stats = await scopeService.getStatistics();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
