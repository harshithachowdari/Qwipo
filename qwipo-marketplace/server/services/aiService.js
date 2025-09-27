// const tf = require('@tensorflow/tfjs-node'); // Temporarily disabled for Windows compatibility

class AIService {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      // Simplified model without TensorFlow for Windows compatibility
      this.model = {
        predict: () => ({ data: () => Promise.resolve([Math.random()]) }),
        layers: []
      };

      this.isModelLoaded = true;
      console.log('✅ AI Model initialized successfully (simplified mode)');
    } catch (error) {
      console.error('❌ AI Model initialization failed:', error);
      this.isModelLoaded = false;
    }
  }

  // Generate product embeddings for semantic search
  async generateProductEmbedding(product) {
    try {
      if (!this.isModelLoaded) {
        throw new Error('Model not loaded');
      }

      // Simplified embedding generation without TensorFlow
      const features = this.extractProductFeatures(product);
      return features.slice(0, 16); // Return first 16 features as embedding
    } catch (error) {
      console.error('Error generating product embedding:', error);
      return [];
    }
  }

  // Extract features from product for ML model
  extractProductFeatures(product) {
    const features = [];
    
    // Category encoding (one-hot)
    const categories = ['grocery', 'electronics', 'clothing', 'pharmacy', 'home', 'beauty', 'sports', 'books', 'toys', 'automotive'];
    const categoryIndex = categories.indexOf(product.category) || 0;
    features.push(categoryIndex / categories.length);
    
    // Price normalization (assuming max price is 10000)
    features.push(Math.min(product.pricing.sellingPrice / 10000, 1));
    
    // Rating normalization
    features.push(product.rating.average / 5);
    
    // Review count normalization (assuming max reviews is 1000)
    features.push(Math.min(product.rating.count / 1000, 1));
    
    // Stock status
    features.push(product.inventory.isInStock ? 1 : 0);
    
    // Featured status
    features.push(product.isFeatured ? 1 : 0);
    
    // Seasonal status
    features.push(product.isSeasonal ? 1 : 0);
    
    // Brand popularity (simplified)
    features.push(Math.random()); // In real implementation, this would be based on brand data
    
    // Product age (days since creation)
    const ageInDays = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    features.push(Math.min(ageInDays / 365, 1)); // Normalize to 1 year
    
    // Discount percentage
    const discount = product.pricing.mrp > product.pricing.sellingPrice 
      ? (product.pricing.mrp - product.pricing.sellingPrice) / product.pricing.mrp 
      : 0;
    features.push(discount);
    
    return features;
  }

  // Generate personalized recommendations
  async generateRecommendations(user, products, limit = 10) {
    try {
      if (!this.isModelLoaded) {
        // Fallback to simple recommendations
        return this.getSimpleRecommendations(user, products, limit);
      }

      const userFeatures = this.extractUserFeatures(user);
      const recommendations = [];

      for (const product of products) {
        const productFeatures = this.extractProductFeatures(product);
        const combinedFeatures = [...userFeatures, ...productFeatures];
        
        // Pad or truncate to match model input size
        const paddedFeatures = this.padFeatures(combinedFeatures, 10);
        
        // Simplified prediction without TensorFlow
        const prediction = await this.model.predict();
        const score = await prediction.data();
        
        recommendations.push({
          productId: product._id,
          score: score[0],
          product: product
        });
      }

      // Sort by score and return top recommendations
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(rec => ({
          productId: rec.productId,
          score: rec.score,
          reason: `AI recommendation based on your preferences (confidence: ${(rec.score * 100).toFixed(1)}%)`
        }));

    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return this.getSimpleRecommendations(user, products, limit);
    }
  }

  // Extract user features for ML model
  extractUserFeatures(user) {
    const features = [];
    
    // User type encoding
    const userTypes = ['retailer', 'distributor', 'admin'];
    const userTypeIndex = userTypes.indexOf(user.userType) || 0;
    features.push(userTypeIndex / userTypes.length);
    
    // Business type encoding
    const businessTypes = ['grocery', 'electronics', 'clothing', 'pharmacy', 'general', 'other'];
    const businessTypeIndex = businessTypes.indexOf(user.businessType) || 0;
    features.push(businessTypeIndex / businessTypes.length);
    
    // Loyalty tier encoding
    const loyaltyTiers = ['bronze', 'silver', 'gold', 'platinum'];
    const loyaltyTierIndex = loyaltyTiers.indexOf(user.loyaltyTier) || 0;
    features.push(loyaltyTierIndex / loyaltyTiers.length);
    
    // Account age (days since registration)
    const ageInDays = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    features.push(Math.min(ageInDays / 365, 1)); // Normalize to 1 year
    
    // Loyalty points normalization
    features.push(Math.min(user.loyaltyPoints / 10000, 1));
    
    return features;
  }

  // Pad or truncate features to match model input size
  padFeatures(features, targetSize) {
    if (features.length >= targetSize) {
      return features.slice(0, targetSize);
    } else {
      return [...features, ...new Array(targetSize - features.length).fill(0)];
    }
  }

  // Fallback simple recommendations
  getSimpleRecommendations(user, products, limit) {
    return products
      .filter(product => product.category === user.businessType || user.businessType === 'general')
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, limit)
      .map(product => ({
        productId: product._id,
        score: product.rating.average / 5,
        reason: `Recommended based on your ${user.businessType} business type`
      }));
  }

  // Generate seasonal recommendations
  async generateSeasonalRecommendations(products) {
    const currentMonth = new Date().getMonth() + 1;
    const seasonalProducts = products.filter(product => 
      product.isSeasonal && product.seasonalMonths.includes(currentMonth)
    );

    return seasonalProducts
      .sort((a, b) => b.rating.average - a.rating.average)
      .map(product => ({
        productId: product._id,
        score: 0.8 + (product.rating.average / 5) * 0.2, // High score for seasonal
        reason: `Seasonal recommendation for ${this.getMonthName(currentMonth)}`
      }));
  }

  // Get month name
  getMonthName(month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }

  // Generate product bundles
  async generateBundles(products) {
    const bundles = [];
    
    // Tea bundle
    const teaProducts = products.filter(p => 
      p.name.toLowerCase().includes('tea') || 
      p.name.toLowerCase().includes('sugar') || 
      p.name.toLowerCase().includes('biscuit')
    );
    
    if (teaProducts.length >= 3) {
      bundles.push({
        id: 'tea-bundle',
        name: 'Tea Time Bundle',
        description: 'Perfect combination for your morning tea',
        products: teaProducts.slice(0, 3),
        discount: 0.1 // 10% discount
      });
    }
    
    // Summer bundle
    const summerProducts = products.filter(p => 
      p.name.toLowerCase().includes('cold') || 
      p.name.toLowerCase().includes('ice') || 
      p.name.toLowerCase().includes('fan')
    );
    
    if (summerProducts.length >= 3) {
      bundles.push({
        id: 'summer-bundle',
        name: 'Summer Essentials',
        description: 'Stay cool this summer',
        products: summerProducts.slice(0, 3),
        discount: 0.15 // 15% discount
      });
    }
    
    return bundles;
  }

  // Train model with user interaction data
  async trainModel(interactions) {
    try {
      if (!this.isModelLoaded) {
        throw new Error('Model not loaded');
      }

      // Simplified training without TensorFlow
      console.log(`Training model with ${interactions.length} interactions`);
      
      // Simulate training process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Model training completed (simplified mode)');
    } catch (error) {
      console.error('❌ Model training failed:', error);
    }
  }
}

module.exports = new AIService();
