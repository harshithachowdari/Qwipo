const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './config.env' });

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if any users exist
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount === 0) {
      console.log('🔧 Creating test user...');
      
      // Create a test user
      const testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        userType: 'retailer',
        phone: '+1234567890',
        businessName: 'Test Store',
        businessType: 'general',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'India'
        }
      });
      
      console.log('✅ Test user created:', testUser.email);
    } else {
      // List existing users
      const users = await User.find({}, 'firstName lastName email userType');
      console.log('👥 Existing users:');
      users.forEach(user => {
        console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - ${user.userType}`);
      });
    }

    // Test login with test user
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    const user = await User.findOne({ email: testEmail }).select('+password');
    if (user) {
      const isValidPassword = await user.comparePassword(testPassword);
      console.log(`🔐 Password validation for ${testEmail}: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log(`❌ User ${testEmail} not found`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testLogin();
