const express = require('express');
const Product = require('../models/Product');
const Recommendation = require('../models/Recommendation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/recommendations/personalized
// @desc    Get personalized recommendations for user
// @access  Private
router.get('/personalized', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get user recommendations
    const recommendations = await Recommendation.getUserRecommendations(req.user._id, limit);
    
    // If no recommendations, get trending products
    if (recommendations.length === 0) {
      const trendingProducts = await Product.find({
        isActive: true,
        'inventory.isInStock': true
      })
      .populate('distributor', 'businessName businessType')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit);

      return res.json({
        success: true,
        data: {
          products: trendingProducts,
          type: 'trending'
        }
      });
    }

    res.json({
      success: true,
      data: {
        products: recommendations.map(rec => rec.productId),
        type: 'personalized'
      }
    });
  } catch (error) {
    console.error('Get personalized recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/recommendations/reminders
// @desc    Reorder reminders based on simple cadence rules (demo)
// @access  Private
router.get('/reminders', auth, async (req, res) => {
  try {
    // Demo logic: return biscuits every ~15 days and tea/sugar combos
    // In a real app, derive from order history.
    const candidates = await Product.find({
      name: { $regex: /(biscuit|tea|sugar)/i },
      isActive: true,
      'inventory.isInStock': true
    }).limit(10);

    const reminders = candidates.map(p => ({
      product: p,
      reason: /biscuit/i.test(p.name) ? 'Reorder every ~15 days' : 'Complements your usual purchases',
      dueInDays: /biscuit/i.test(p.name) ? 1 + Math.floor(Math.random() * 5) : 7 + Math.floor(Math.random() * 7)
    }));

    res.json({ success: true, data: { reminders } });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/recommendations/behavior
// @desc    Behavior-based suggestions (rule-based demo: rice + sugar -> tea)
// @access  Private
router.get('/behavior', auth, async (req, res) => {
  try {
    const suggestTea = await Product.find({ name: { $regex: /tea/i }, isActive: true, 'inventory.isInStock': true })
      .limit(5)
      .populate('distributor', 'businessName');
    const suggestBundles = await Product.find({
      $or: [
        { name: { $regex: /oil/i } },
        { name: { $regex: /dal/i } },
        { name: { $regex: /rice/i } },
        { name: { $regex: /sugar/i } },
        { name: { $regex: /biscuit/i } }
      ],
      isActive: true,
      'inventory.isInStock': true
    }).limit(10);

    res.json({
      success: true,
      data: {
        rules: [
          'Retailer often buys rice + sugar → recommend tea',
          'Every ~15 days biscuits reorder reminder',
          'Summer → push cold drinks; Diwali → sweets',
          'Bundles: Oil + Dal + Rice; Tea + Sugar + Biscuits'
        ],
        suggestions: {
          tea: suggestTea,
          bundleCandidates: suggestBundles
        }
      }
    });
  } catch (error) {
    console.error('Get behavior suggestions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/recommendations/seasonal
// @desc    Get seasonal recommendations
// @access  Public
router.get('/seasonal', async (req, res) => {
  try {
    const products = await Product.getSeasonalProducts()
      .populate('distributor', 'businessName businessType')
      .limit(20);

    // Emit seasonal push to all connected clients (demo realtime)
    if (req.io) {
      req.io.emit('seasonal_push', { timestamp: Date.now(), count: products.length });
    }

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get seasonal recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/recommendations/trending
// @desc    Get trending products
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const products = await Product.find({
      isActive: true,
      'inventory.isInStock': true
    })
    .populate('distributor', 'businessName businessType')
    .sort({ 'rating.average': -1, 'rating.count': -1, createdAt: -1 })
    .limit(limit);

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get trending recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/recommendations/bundles
// @desc    Get product bundles
// @access  Public
router.get('/bundles', async (req, res) => {
  try {
    const bundles = [
      {
        id: 'tea-bundle',
        name: 'Tea Time Bundle',
        description: 'Perfect combination for your morning tea',
        products: await Product.find({
          $or: [
            { name: { $regex: /tea/i } },
            { name: { $regex: /sugar/i } },
            { name: { $regex: /biscuit/i } }
          ],
          isActive: true,
          'inventory.isInStock': true
        })
        .populate('distributor', 'businessName businessType')
        .limit(3)
      },
      {
        id: 'summer-bundle',
        name: 'Summer Essentials',
        description: 'Stay cool this summer',
        products: await Product.find({
          $or: [
            { name: { $regex: /cold/i } },
            { name: { $regex: /ice/i } },
            { name: { $regex: /fan/i } }
          ],
          isActive: true,
          'inventory.isInStock': true
        })
        .populate('distributor', 'businessName businessType')
        .limit(3)
      },
      {
        id: 'diwali-bundle',
        name: 'Diwali Special',
        description: 'Celebrate the festival of lights',
        products: await Product.find({
          $or: [
            { name: { $regex: /sweet/i } },
            { name: { $regex: /candle/i } },
            { name: { $regex: /gift/i } }
          ],
          isActive: true,
          'inventory.isInStock': true
        })
        .populate('distributor', 'businessName businessType')
        .limit(3)
      }
    ];

    res.json({
      success: true,
      data: {
        bundles
      }
    });
  } catch (error) {
    console.error('Get bundles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/recommendations/similar/:productId
// @desc    Get similar products
// @access  Public
router.get('/similar/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
      'inventory.isInStock': true
    })
    .populate('distributor', 'businessName businessType')
    .sort({ 'rating.average': -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        products: similarProducts
      }
    });
  } catch (error) {
    console.error('Get similar products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/recommendations/generate
// @desc    Generate recommendations for user (AI/ML)
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    // This would integrate with TensorFlow for AI recommendations
    // For now, we'll create basic recommendations based on user preferences
    
    const userPreferences = req.user.businessType || 'general';
    
    // Get products matching user's business type
    const recommendedProducts = await Product.find({
      category: userPreferences,
      isActive: true,
      'inventory.isInStock': true
    })
    .populate('distributor', 'businessName businessType')
    .sort({ 'rating.average': -1 })
    .limit(10);

    // Create recommendation records
    const recommendations = recommendedProducts.map(product => ({
      userId: req.user._id,
      productId: product._id,
      type: 'personalized',
      score: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1
      reason: `Recommended based on your ${userPreferences} business type`,
      metadata: {
        algorithm: 'content_based',
        confidence: 0.7
      }
    }));

    // Clear old recommendations
    await Recommendation.deleteMany({ userId: req.user._id });
    
    // Save new recommendations
    await Recommendation.insertMany(recommendations);

    // Emit realtime update for this user
    if (req.io) {
      req.io.to(`user_${req.user._id.toString()}`).emit('recommendations_update', {
        timestamp: Date.now(),
        count: recommendations.length
      });
    }

    res.json({
      success: true,
      message: 'Recommendations generated successfully',
      data: {
        count: recommendations.length
      }
    });
  } catch (error) {
    console.error('Generate recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
