const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          suggestions: []
        }
      });
    }

    // Get product name suggestions
    const productSuggestions = await Product.aggregate([
      {
        $match: {
          $text: { $search: q },
          isActive: true,
          'inventory.isInStock': true
        }
      },
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
          category: { $first: '$category' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: '$_id',
          category: 1,
          _id: 0
        }
      }
    ]);

    // Get category suggestions
    const categorySuggestions = await Product.aggregate([
      {
        $match: {
          $text: { $search: q },
          isActive: true,
          'inventory.isInStock': true
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: '$_id',
          type: 'category',
          _id: 0
        }
      }
    ]);

    // Get brand suggestions
    const brandSuggestions = await Product.aggregate([
      {
        $match: {
          $text: { $search: q },
          isActive: true,
          'inventory.isInStock': true
        }
      },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: '$_id',
          type: 'brand',
          _id: 0
        }
      }
    ]);

    const suggestions = [
      ...productSuggestions.map(item => ({ ...item, type: 'product' })),
      ...categorySuggestions,
      ...brandSuggestions
    ];

    res.json({
      success: true,
      data: {
        suggestions: suggestions.slice(0, 15)
      }
    });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/search/filters
// @desc    Get search filters
// @access  Public
router.get('/filters', async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isActive: true, 'inventory.isInStock': true };
    if (category) filter.category = category;

    // Get categories
    const categories = await Product.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get subcategories
    const subcategories = await Product.aggregate([
      { $match: filter },
      { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    // Get brands
    const brands = await Product.aggregate([
      { $match: filter },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    // Get price ranges
    const priceRanges = await Product.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$pricing.sellingPrice' },
          maxPrice: { $max: '$pricing.sellingPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        subcategories,
        brands,
        priceRange: priceRanges[0] || { minPrice: 0, maxPrice: 1000 }
      }
    });
  } catch (error) {
    console.error('Get search filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/search/advanced
// @desc    Advanced search with multiple filters
// @access  Public
router.post('/advanced', async (req, res) => {
  try {
    const {
      query,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.body;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { isActive: true, 'inventory.isInStock': true };

    if (query) {
      filter.$text = { $search: query };
    }
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      filter['pricing.sellingPrice'] = {};
      if (minPrice) filter['pricing.sellingPrice'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['pricing.sellingPrice'].$lte = parseFloat(maxPrice);
    }
    if (rating) {
      filter['rating.average'] = { $gte: parseFloat(rating) };
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'relevance':
        if (query) {
          sort = { score: { $meta: 'textScore' }, 'rating.average': -1 };
        } else {
          sort = { 'rating.average': -1, createdAt: -1 };
        }
        break;
      case 'price_asc':
        sort = { 'pricing.sellingPrice': 1 };
        break;
      case 'price_desc':
        sort = { 'pricing.sellingPrice': -1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(filter, query ? { score: { $meta: 'textScore' } } : {})
      .populate('distributor', 'businessName businessType')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        },
        filters: {
          query,
          category,
          subcategory,
          brand,
          minPrice,
          maxPrice,
          rating,
          sortBy
        }
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/search/trending
// @desc    Get trending search terms
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    // This would typically come from a search analytics system
    // For now, we'll return some mock trending terms
    const trendingTerms = [
      'tea',
      'sugar',
      'rice',
      'oil',
      'milk',
      'bread',
      'biscuits',
      'chocolate',
      'coffee',
      'spices'
    ];

    res.json({
      success: true,
      data: {
        trendingTerms
      }
    });
  } catch (error) {
    console.error('Get trending terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/search/analytics
// @desc    Track search analytics
// @access  Private
router.post('/analytics', auth, [
  body('query').trim().notEmpty().withMessage('Search query is required'),
  body('resultsCount').isInt({ min: 0 }).withMessage('Results count must be non-negative'),
  body('filters').optional().isObject().withMessage('Filters must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // In a real application, you would save this to a search analytics collection
    // For now, we'll just log it
    console.log('Search analytics:', {
      userId: req.user._id,
      query: req.body.query,
      resultsCount: req.body.resultsCount,
      filters: req.body.filters,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Search analytics tracked'
    });
  } catch (error) {
    console.error('Track search analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
