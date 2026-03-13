const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');

/**
 * Seeds a MySQL database with fake data
 * 
 * @param {Object} options - Configuration options
 * @param {string} [options.user='root'] - MySQL username
 * @param {string} [options.password=''] - MySQL password
 * @param {string} [options.host='localhost'] - MySQL host
 * @param {number} [options.port=3306] - MySQL port
 * @param {string} options.database - Database name (will be created if doesn't exist)
 * @param {string} options.table - Table name (will be created if doesn't exist)
 * @param {Object} options.fields - Field definitions { fieldName: 'SQL_TYPE' }
 * @param {number} [options.numRecords=10] - Number of records to generate
 * @param {boolean} [options.dropTableIfExists=false] - Drop table before creating
 * @param {boolean} [options.truncateBeforeInsert=false] - Truncate table before inserting
 * 
 * @returns {Promise<Object>} Result object with insertedRecords count
 * 
 * @example
 * const seedDatabase = require('mysql-seed-generator');
 * 
 * await seedDatabase({
 *   user: 'root',
 *   password: 'password',
 *   database: 'myapp',
 *   table: 'users',
 *   numRecords: 100,
 *   fields: {
 *     name: 'VARCHAR(255)',
 *     email: 'VARCHAR(255) UNIQUE',
 *     age: 'INT'
 *   }
 * });
 */
async function seedDatabase({
  user = 'root',
  password = '',
  host = 'localhost',
  port = 3306,
  database,
  table,
  fields = {},
  numRecords = 10,
  dropTableIfExists = false,
  truncateBeforeInsert = false
}) {
  // Validation
  if (!database) {
    throw new Error('database is required');
  }
  if (!table) {
    throw new Error('table is required');
  }
  if (!fields || Object.keys(fields).length === 0) {
    throw new Error('fields object is required and must have at least one field');
  }
  if (numRecords < 1) {
    throw new Error('numRecords must be at least 1');
  }

  let connection;
  
  try {
    // 1. CONNECT
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    console.log('✅ Connected');

    // 2. CREATE DATABASE
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.query(`USE \`${database}\``);
    console.log(`✅ Database '${database}' ready`);

    // 3. AUTO-DETECT GENERATORS
    const autoGenerators = {
      // People
      name: () => faker.person.fullName(),
      first_name: () => faker.person.firstName(),
      last_name: () => faker.person.lastName(),
      full_name: () => faker.person.fullName(),
      
      // Contact
      email: () => faker.internet.email(),
      username: () => faker.internet.userName(),
      // Keep phone values within VARCHAR(20) by generating E.164-like numbers.
      phone: () => `+${faker.string.numeric({ length: { min: 10, max: 14 } })}`,
      
      // Numbers
      age: () => faker.number.int({ min: 18, max: 65 }),
      price: () => faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
      salary: () => faker.number.int({ min: 30000, max: 150000 }),
      quantity: () => faker.number.int({ min: 1, max: 100 }),
      rating: () => faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      
      // Location
      city: () => faker.location.city(),
      country: () => faker.location.country(),
      address: () => faker.location.streetAddress(),
      state: () => faker.location.state(),
      zip: () => faker.location.zipCode(),
      zipcode: () => faker.location.zipCode(),
      latitude: () => faker.location.latitude(),
      longitude: () => faker.location.longitude(),
      
      // Work
      job_title: () => faker.person.jobTitle(),
      company: () => faker.company.name(),
      department: () => faker.commerce.department(),
      
      // Products
      product: () => faker.commerce.productName(),
      product_name: () => faker.commerce.productName(),
      category: () => faker.commerce.department(),
      description: () => faker.lorem.paragraph(),
      
      // Images
      image: () => faker.image.url(),
      image_url: () => faker.image.url(),
      photo: () => faker.image.url(),
      photo_url: () => faker.image.url(),
      avatar: () => faker.image.avatar(),
      avatar_url: () => faker.image.avatar(),
      thumbnail: () => faker.image.urlLoremFlickr({ width: 200, height: 200 }),
      product_image: () => faker.image.urlLoremFlickr({ width: 400, height: 400, category: 'product' }),
      cover_image: () => faker.image.urlLoremFlickr({ width: 1200, height: 600 }),
      
      // Dates
      date: () => faker.date.past({ years: 1 }).toISOString().split('T')[0],
      created_at: () => faker.date.recent({ days: 30 }).toISOString().slice(0, 19).replace('T', ' '),
      updated_at: () => faker.date.recent({ days: 7 }).toISOString().slice(0, 19).replace('T', ' '),
      birth_date: () => faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
      
      // Boolean
      is_active: () => faker.datatype.boolean(),
      is_verified: () => faker.datatype.boolean(),
      is_premium: () => faker.datatype.boolean(),
      
      // Others
      status: () => faker.helpers.arrayElement(['active', 'inactive', 'pending']),
      title: () => faker.lorem.sentence(),
      bio: () => faker.person.bio(),
      url: () => faker.internet.url(),
      color: () => faker.color.human(),
      uuid: () => faker.string.uuid()
    };

    // 4. DROP TABLE IF REQUESTED
    if (dropTableIfExists) {
      await connection.query(`DROP TABLE IF EXISTS ${table}`);
      console.log(`🗑️  Dropped existing table '${table}'`);
    }

    // 5. CREATE TABLE
    const columns = Object.entries(fields)
      .map(([name, type]) => `${name} ${type}`)
      .join(', ');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ${table} (
        ${columns}
      )
    `);
    console.log(`✅ Table '${table}' ready`);

    // 6. TRUNCATE IF REQUESTED
    if (truncateBeforeInsert) {
      await connection.query(`TRUNCATE TABLE ${table}`);
      console.log(`🗑️  Truncated table '${table}'`);
    }

    // 7. VALIDATE FIELD GENERATORS
    const fieldNames = Object.keys(fields);
    for (const fieldName of fieldNames) {
      if (!autoGenerators[fieldName]) {
        throw new Error(
          `Unknown field '${fieldName}'. Please use one of the supported field names or open an issue on GitHub to request support for this field type.\n` +
          `Supported fields: ${Object.keys(autoGenerators).join(', ')}`
        );
      }
    }

    // 8. GENERATE DATA
    console.log(`📝 Generating ${numRecords} fake records...`);
    const records = [];
    
    for (let i = 0; i < numRecords; i++) {
      const record = fieldNames.map(fieldName => {
        return autoGenerators[fieldName]();
      });
      records.push(record);
    }

    // 9. INSERT
    const fieldNamesStr = fieldNames.join(', ');
    const placeholders = records.map(() => `(${fieldNames.map(() => '?').join(', ')})`).join(', ');
    const insertSQL = `INSERT INTO ${table} (${fieldNamesStr}) VALUES ${placeholders}`;
    const flatValues = records.flat();

    const [result] = await connection.query(insertSQL, flatValues);
    console.log(`✅ Inserted ${result.affectedRows} records!`);

    // 10. SHOW SAMPLE
    const [rows] = await connection.query(`SELECT * FROM ${table} LIMIT 3`);
    console.log('\n📋 Sample data:');
    console.table(rows);

    return {
      success: true,
      insertedRecords: result.affectedRows,
      database,
      table
    };

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    // Helpful error messages
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Fix: Check your MySQL credentials (user and password)');
    } else if (error.code === 'ER_DUP_ENTRY') {
      console.error('\n💡 Fix: Duplicate entry. Try setting dropTableIfExists: true or truncateBeforeInsert: true');
    } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE' || error.code === 'ER_DATA_TOO_LONG') {
      console.error('\n💡 Fix: Data doesn\'t match column type. Check your field SQL types');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Fix: Cannot connect to MySQL. Make sure MySQL is running');
    }

    throw error;
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

module.exports = seedDatabase;
