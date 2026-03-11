const seedDatabase = require('./index');

const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';

/**
 * Basic test for mysql-seed-generator
 * 
 * Before running:
 * 1. Make sure MySQL is running
 * 2. Set MYSQL_PASSWORD environment variable
 * 3. Run: npm test
 */

async function runTests() {
  console.log('🧪 Running basic tests...\n');

  if (!MYSQL_PASSWORD) {
    throw new Error('Set MYSQL_PASSWORD before running tests. Example: MYSQL_PASSWORD=yourpassword npm test');
  }

  try {
    // Test 1: Basic seeding
    console.log('Test 1: Basic database seeding');
    const result1 = await seedDatabase({
      user: 'root',
      password: MYSQL_PASSWORD,
      database: 'test_db',
      table: 'test_users',
      dropTableIfExists: true,
      numRecords: 10,
      fields: {
        name: 'VARCHAR(255)',
        email: 'VARCHAR(255) UNIQUE',
        age: 'INT'
      }
    });
    console.log('✅ Test 1 passed\n');

    // Test 2: Multiple field types
    console.log('Test 2: Multiple field types');
    const result2 = await seedDatabase({
      user: 'root',
      password: MYSQL_PASSWORD,
      database: 'test_db',
      table: 'test_products',
      dropTableIfExists: true,
      numRecords: 5,
      fields: {
        product_name: 'VARCHAR(255)',
        price: 'DECIMAL(10,2)',
        category: 'VARCHAR(100)',
        product_image: 'VARCHAR(500)',
        description: 'TEXT',
        quantity: 'INT',
        is_active: 'BOOLEAN',
        created_at: 'DATETIME'
      }
    });
    console.log('✅ Test 2 passed\n');

    // Test 3: Image fields
    console.log('Test 3: Image URL generation');
    const result3 = await seedDatabase({
      user: 'root',
      password: MYSQL_PASSWORD,
      database: 'test_db',
      table: 'test_images',
      dropTableIfExists: true,
      numRecords: 3,
      fields: {
        name: 'VARCHAR(255)',
        avatar: 'VARCHAR(500)',
        cover_image: 'VARCHAR(500)',
        thumbnail: 'VARCHAR(500)'
      }
    });
    console.log('✅ Test 3 passed\n');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
