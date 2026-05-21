const ScopeCategory = require('../models/ScopeCategory');

const defaultCategories = [
  {
    name: 'Mobile Application Development',
    description: 'Mobile app development services',
    icon: 'FiSmartphone',
    isDefault: true,
    scopeItems: [
      { title: 'UI/UX Design', description: 'Mobile UI/UX design', price: 8000, currency: 'INR' },
      { title: 'Frontend Development', description: 'React Native/Flutter development', price: 12000, currency: 'INR' },
      { title: 'Backend Integration', description: 'API integration and backend setup', price: 15000, currency: 'INR' },
      { title: 'Core Features', description: 'Core feature development', price: 3000, currency: 'INR' },
      { title: 'Database & Storage', description: 'Database design and setup', price: 8000, currency: 'INR' },
      { title: 'Testing & Deployment', description: 'QA testing and app deployment', price: 6000, currency: 'INR' },
    ],
  },
  
  {
    name: 'Website Development',
    description: 'Website development services',
    icon: 'FiGlobe',
    isDefault: true,
    scopeItems: [
      { title: 'Frontend Architecture', description: 'Frontend design and architecture', price: 15000, currency: 'INR' },
      { title: 'Backend APIs', description: 'Backend API development', price: 18000, currency: 'INR' },
      { title: 'State & Database', description: 'State management and database', price: 10000, currency: 'INR' },
      { title: 'Admin Dashboard', description: 'Admin panel development', price: 12000, currency: 'INR' },
      { title: 'Theme Setup', description: 'Theme configuration', price: 5000, currency: 'INR' },
      { title: 'E-commerce Setup', description: 'E-commerce functionality', price: 15000, currency: 'INR' },
      { title: 'Content Management', description: 'CMS setup', price: 4000, currency: 'INR' },
      { title: 'Plugin Integration', description: 'Third-party plugin integration', price: 3000, currency: 'INR' },
    ],
  },
  {
    name: 'Software Development',
    description: 'Custom software development',
    icon: 'FiCode',
    isDefault: true,
    scopeItems: [
      { title: 'Module Development', description: 'Custom module development', price: 25000, currency: 'INR' },
      { title: 'RBAC', description: 'Role-based access control', price: 8000, currency: 'INR' },
      { title: 'Reporting', description: 'Reporting module', price: 10000, currency: 'INR' },
      { title: 'Data Security', description: 'Security implementation', price: 7000, currency: 'INR' },
    ],
  },
  {
    name: 'Core PHP/Laravel',
    description: 'PHP and Laravel development',
    icon: 'FiCode',
    isDefault: true,
    scopeItems: [
      { title: 'MVC Architecture', description: 'MVC pattern implementation', price: 20000, currency: 'INR' },
      { title: 'Database Management', description: 'Database design and management', price: 10000, currency: 'INR' },
      { title: 'Security', description: 'Security implementation', price: 6000, currency: 'INR' },
      { title: 'Third Party Integration', description: 'Third-party API integration', price: 8000, currency: 'INR' },
      { title: 'Jobs & Queues', description: 'Job scheduling and queues', price: 7000, currency: 'INR' },
    ],
  },
  {
    name: 'SEO',
    description: 'Search engine optimization',
    icon: 'FiSearch',
    isDefault: true,
    scopeItems: [
      { title: 'Technical SEO', description: 'Technical SEO optimization', price: 6000, currency: 'INR' },
      { title: 'On Page SEO', description: 'On-page optimization', price: 8000, currency: 'INR' },
      { title: 'Off Page SEO', description: 'Off-page optimization', price: 12000, currency: 'INR' },
      { title: 'Reporting', description: 'SEO reporting', price: 4000, currency: 'INR' },
    ],
  },
  {
    name: 'Digital Marketing',
    description: 'Digital marketing services',
    icon: 'FiTrendingUp',
    isDefault: true,
    scopeItems: [
      { title: 'SMM', description: 'Social media marketing', price: 10000, currency: 'INR' },
      { title: 'PPC', description: 'Pay-per-click advertising', price: 15000, currency: 'INR' },
      { title: 'Lead Generation', description: 'Lead generation campaigns', price: 8000, currency: 'INR' },
      { title: 'Performance Optimization', description: 'Campaign optimization', price: 5000, currency: 'INR' },
    ],
  },
];

class ScopeService {
  async initializeDefaultCategories() {
    try {
      const count = await ScopeCategory.countDocuments();
      if (count === 0) {
        await ScopeCategory.insertMany(defaultCategories);
        console.log('Default scope categories initialized');
      }
    } catch (error) {
      console.error('Error initializing default categories:', error);
    }
  }

  async getCategories(filters = {}) {
    try {
      const query = {};
      
      if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' };
      }

      let categories = await ScopeCategory.find(query).sort({ createdAt: -1 });

      if (filters.priceMin || filters.priceMax) {
        categories = categories.filter(cat => {
          const prices = cat.scopeItems.map(item => item.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          if (filters.priceMin && maxPrice < filters.priceMin) return false;
          if (filters.priceMax && minPrice > filters.priceMax) return false;
          return true;
        });
      }

      if (filters.sort === 'price-low') {
        categories.sort((a, b) => {
          const aMin = Math.min(...a.scopeItems.map(i => i.price));
          const bMin = Math.min(...b.scopeItems.map(i => i.price));
          return aMin - bMin;
        });
      } else if (filters.sort === 'price-high') {
        categories.sort((a, b) => {
          const aMax = Math.max(...a.scopeItems.map(i => i.price));
          const bMax = Math.max(...b.scopeItems.map(i => i.price));
          return bMax - aMax;
        });
      } else if (filters.sort === 'newest') {
        categories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filters.sort === 'oldest') {
        categories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      return categories;
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }

  async getCategory(id) {
    try {
      const category = await ScopeCategory.findById(id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error(`Error fetching category: ${error.message}`);
    }
  }

  async createCategory(data) {
    try {
      const category = new ScopeCategory(data);
      await category.save();
      return category;
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  async updateCategory(id, data) {
    try {
      const category = await ScopeCategory.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  async deleteCategory(id) {
    try {
      const category = await ScopeCategory.findByIdAndDelete(id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }

  async createScopeItem(categoryId, itemData) {
    try {
      const category = await ScopeCategory.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      category.scopeItems.push(itemData);
      await category.save();
      return category;
    } catch (error) {
      throw new Error(`Error creating scope item: ${error.message}`);
    }
  }

  async updateScopeItem(categoryId, itemId, itemData) {
    try {
      const category = await ScopeCategory.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      const item = category.scopeItems.id(itemId);
      if (!item) {
        throw new Error('Scope item not found');
      }
      Object.assign(item, itemData);
      await category.save();
      return category;
    } catch (error) {
      throw new Error(`Error updating scope item: ${error.message}`);
    }
  }

  async deleteScopeItem(categoryId, itemId) {
    try {
      const category = await ScopeCategory.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      category.scopeItems.id(itemId).deleteOne();
      await category.save();
      return category;
    } catch (error) {
      throw new Error(`Error deleting scope item: ${error.message}`);
    }
  }

  async getStatistics() {
    try {
      const categories = await ScopeCategory.find();
      const totalCategories = categories.length;
      let totalItems = 0;
      let totalPrice = 0;

      categories.forEach(cat => {
        totalItems += cat.scopeItems.length;
        cat.scopeItems.forEach(item => {
          totalPrice += item.price;
        });
      });

      const averagePrice = totalItems > 0 ? Math.round(totalPrice / totalItems) : 0;

      return {
        totalCategories,
        totalItems,
        averagePrice,
        totalEstimatedCost: totalPrice,
      };
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

module.exports = new ScopeService();

