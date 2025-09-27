/*
 Seed script to insert sample distributors and products.
 Usage:
   1) Ensure MongoDB URI is set in server/config.env as MONGODB_URI
   2) Run: node server/scripts/seed.js
*/

require('dotenv').config({ path: require('path').join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
}

function point(lng, lat) {
  return { type: 'Point', coordinates: [lng, lat] };
}

async function createDistributors() {
  const samples = [
    {
      firstName: 'Ravi', lastName: 'Kumar', email: 'ravi@dist.example.com', password: 'Password@123', userType: 'distributor',
      phone: '+91 9876543210', businessName: 'Ravi Foods Distributors', businessType: 'grocery',
      address: { city: 'Hyderabad', state: 'Telangana', zipCode: '500081', country: 'India', location: point(78.382, 17.448) }
    },
    {
      firstName: 'Priya', lastName: 'Sharma', email: 'priya@dist.example.com', password: 'Password@123', userType: 'distributor',
      phone: '+91 9876501234', businessName: 'Sharma Traders', businessType: 'electronics',
      address: { city: 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India', location: point(77.5946, 12.9716) }
    },
    {
      firstName: 'Arun', lastName: 'Menon', email: 'arun@dist.example.com', password: 'Password@123', userType: 'distributor',
      phone: '+91 9812345678', businessName: 'Menon Pharma Supplies', businessType: 'pharmacy',
      address: { city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001', country: 'India', location: point(80.2707, 13.0827) }
    }
  ];

  const existing = await User.find({ email: { $in: samples.map(s => s.email) } }).select('email');
  const existingSet = new Set(existing.map(u => u.email));
  const toCreate = samples.filter(s => !existingSet.has(s.email));

  if (!toCreate.length) {
    console.log('Distributors already exist, skipping.');
    return await User.find({ email: { $in: samples.map(s => s.email) } });
  }

  const created = await User.insertMany(toCreate);
  console.log(`Created ${created.length} distributors.`);
  return created;
}

function sampleProducts(distUser) {
  const base = [
    {
      name: 'Aashirvaad Atta 10kg',
      description: 'High quality whole wheat flour for soft rotis.',
      category: 'grocery', subcategory: 'staples', brand: 'Aashirvaad', sku: `ATTA10-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://via.placeholder.com/400x400?text=Atta', alt: 'Atta', isPrimary: true }],
      pricing: { mrp: 520, sellingPrice: 480, distributorPrice: 430, currency: 'INR' },
      inventory: { quantity: 120, isInStock: true },
      specifications: { weight: '10kg', countryOfOrigin: 'India' },
      tags: ['atta', 'flour', 'wheat'],
      isFeatured: true,
    },
    {
      name: 'Amul Butter 500g',
      description: 'Creamy and delicious table butter.',
      category: 'grocery', subcategory: 'dairy', brand: 'Amul', sku: `AMUL500-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://via.placeholder.com/400x400?text=Butter', alt: 'Butter', isPrimary: true }],
      pricing: { mrp: 285, sellingPrice: 270, distributorPrice: 250, currency: 'INR' },
      inventory: { quantity: 200, isInStock: true },
      specifications: { weight: '500g', countryOfOrigin: 'India' },
      tags: ['butter', 'dairy'],
      isFeatured: false,
    },
    {
      name: 'Dettol Handwash 900ml',
      description: 'Antibacterial handwash for daily hygiene.',
      category: 'pharmacy', subcategory: 'hygiene', brand: 'Dettol', sku: `DETHW900-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://via.placeholder.com/400x400?text=Handwash', alt: 'Handwash', isPrimary: true }],
      pricing: { mrp: 199, sellingPrice: 169, distributorPrice: 150, currency: 'INR' },
      inventory: { quantity: 150, isInStock: true },
      specifications: { weight: '900ml', countryOfOrigin: 'India' },
      tags: ['handwash', 'hygiene'],
      isFeatured: false,
    },
    {
      name: 'Mi 20000mAh Power Bank',
      description: 'Fast-charging dual USB output power bank.',
      category: 'electronics', subcategory: 'accessories', brand: 'Xiaomi', sku: `MI20000-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://via.placeholder.com/400x400?text=Power+Bank', alt: 'Power Bank', isPrimary: true }],
      pricing: { mrp: 1999, sellingPrice: 1699, distributorPrice: 1499, currency: 'INR' },
      inventory: { quantity: 80, isInStock: true },
      specifications: { weight: '350g', countryOfOrigin: 'India' },
      tags: ['powerbank', 'electronics'],
      isFeatured: true,
    }
  ];
  return base.map(p => ({ ...p, distributor: distUser._id }));
}

async function createProducts(distributors) {
  let createdCount = 0;
  for (const d of distributors) {
    const prods = sampleProducts(d);
    // Avoid duplicate SKUs if script re-run
    const skus = prods.map(p => p.sku);
    const existing = await Product.find({ sku: { $in: skus } }).select('sku');
    const existingSet = new Set(existing.map(e => e.sku));
    const toCreate = prods.filter(p => !existingSet.has(p.sku));
    if (toCreate.length) {
      const created = await Product.insertMany(toCreate);
      createdCount += created.length;
    }
  }
  console.log(`Created ${createdCount} products.`);
}

(async () => {
  try {
    await connect();
    const distributors = await createDistributors();
    await createProducts(distributors);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected.');
  }
})();
