const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const defaultProducts = [
  {
    company_name: 'Grommer',
    product_name: '20-20-0-23',
    product_id: 'GROM-20-20-0-23',
    description: 'NPK Fertilizer',
    is_active: true,
    is_custom: false
  },
  {
    company_name: 'Grommer',
    product_name: 'Urea',
    product_id: 'GROM-UREA',
    description: 'Nitrogen Fertilizer',
    is_active: true,
    is_custom: false
  },
  {
    company_name: 'Grommer',
    product_name: '16-16-16',
    product_id: 'GROM-16-16-16',
    description: 'NPK Fertilizer',
    is_active: true,
    is_custom: false
  },
  {
    company_name: 'Factfos',
    product_name: '20-20-0-13',
    product_id: 'FACT-20-20-0-13',
    description: 'NPK Fertilizer',
    is_active: true,
    is_custom: false
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if products already exist
    const existingProducts = await Product.find({});
    
    if (existingProducts.length > 0) {
      console.log(`ℹ️  Database already has ${existingProducts.length} products`);
      console.log('Do you want to add default products anyway? (This will skip duplicates)');
    }

    // Insert default products (skip if product_id already exists)
    let addedCount = 0;
    let skippedCount = 0;

    for (const product of defaultProducts) {
      const exists = await Product.findOne({ product_id: product.product_id });
      
      if (!exists) {
        await Product.create(product);
        console.log(`✅ Added: ${product.company_name} - ${product.product_name}`);
        addedCount++;
      } else {
        console.log(`⏭️  Skipped (already exists): ${product.company_name} - ${product.product_name}`);
        skippedCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Added: ${addedCount} products`);
    console.log(`   Skipped: ${skippedCount} products`);
    console.log(`   Total in DB: ${await Product.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
