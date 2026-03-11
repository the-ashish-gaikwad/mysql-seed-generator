const seedDatabase = require('./index');
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'yourpassword';

// Example 1: Basic Users Table
async function seedUsers() {
  await seedDatabase({
    user: 'root',
    password: MYSQL_PASSWORD,
    database: 'package',
    table: 'users',
    numRecords: 50,
    fields: {
      name: 'VARCHAR(255)',
      email: 'VARCHAR(255) UNIQUE',
      age: 'INT',
      city: 'VARCHAR(100)',
      phone: 'VARCHAR(20)'
    }
  });
}

// Example 2: Products Table
async function seedProducts() {
  await seedDatabase({
    user: 'root',
    password: MYSQL_PASSWORD,
    database: 'shop',
    table: 'products',
    numRecords: 100,
    fields: {
      product_name: 'VARCHAR(255)',
      price: 'DECIMAL(10,2)',
      category: 'VARCHAR(100)',
      product_image: 'VARCHAR(500)',
      description: 'TEXT',
      quantity: 'INT'
    }
  });
}

// Example 3: Employees Table
async function seedEmployees() {
  await seedDatabase({
    user: 'root',
    password: MYSQL_PASSWORD,
    database: 'company',
    table: 'employees',
    numRecords: 200,
    dropTableIfExists: true,  // ← Recreate table from scratch
    fields: {
      full_name: 'VARCHAR(255)',
      email: 'VARCHAR(255) UNIQUE',
      job_title: 'VARCHAR(100)',
      department: 'VARCHAR(100)',
      salary: 'INT',
      phone: 'VARCHAR(20)',
      is_active: 'BOOLEAN',
      created_at: 'DATETIME'
    }
  });
}

// Run one of the examples
seedUsers()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error:', err));
