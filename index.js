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
 * @param {Object} options.fields - Field definitions.
 *   Supported formats:
 *   - { fieldName: 'SQL_TYPE' }
 *   - { fieldName: { type: 'SQL_TYPE', generator: 'name' | Function } }
 * @param {Object<string, string|Function>} [options.fieldGenerators={}] - Optional per-field generator overrides.
 *   Value can be a built-in generator key (for example 'name', 'email') or a custom function that returns a value.
 * @param {Object<string, string|Function>} [options.generators={}] - Alias for fieldGenerators.
 * @param {Object<string, string|Function>} [options.map={}] - Simple mapping for custom column names to generators.
 *   Example: { customer_name: 'name', customer_email: 'email' }
 * @param {number} [options.numRecords=10] - Number of records to generate
 * @param {number} [options.batchSize=500] - Number of rows inserted per SQL statement
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
  fieldGenerators = {},
  generators = {},
  map = {},
  numRecords = 10,
  batchSize = 500,
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
  if (!Number.isInteger(numRecords)) {
    throw new Error('numRecords must be an integer');
  }
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new Error('batchSize must be an integer >= 1');
  }

  const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;
  const assertSafeIdentifier = (identifier, label) => {
    if (!IDENTIFIER_REGEX.test(identifier)) {
      throw new Error(
        `Invalid ${label} '${identifier}'. Use only letters, numbers, and underscores; it must not start with a number.`
      );
    }
  };

  const escapeIdentifier = (identifier) => `\`${identifier}\``;
    const assertSafeSqlType = (sqlType, fieldName) => {
      const value = String(sqlType || '').trim();
      if (!value) {
        throw new Error(`SQL type is required for field '${fieldName}'.`);
      }

      // Keep types flexible, but block obvious multi-statement/comment payloads.
      if (/[;]|--|\/\*|\*\//.test(value)) {
        throw new Error(`Invalid SQL type for field '${fieldName}'. Unsafe tokens are not allowed.`);
      }
    };

  assertSafeIdentifier(database, 'database name');
  assertSafeIdentifier(table, 'table name');

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
    const escapedDatabase = escapeIdentifier(database);
    const escapedTable = escapeIdentifier(table);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${escapedDatabase}`);
    await connection.query(`USE ${escapedDatabase}`);
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
      price: () => faker.number.float({ min: 10, max: 1000, multipleOf: 0.01 }),
      salary: () => faker.number.int({ min: 30000, max: 150000 }),
      quantity: () => faker.number.int({ min: 1, max: 100 }),
      rating: () => faker.number.float({ min: 1, max: 5, multipleOf: 0.1 }),
      
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

    const inferGeneratorFromSqlType = (sqlType) => {
      const type = String(sqlType || '').toUpperCase();

      if (!type) {
        return null;
      }

      if (type.includes('BOOL') || /TINYINT\s*\(\s*1\s*\)/.test(type)) {
        return () => faker.datatype.boolean();
      }

      if (type.includes('UUID')) {
        return () => faker.string.uuid();
      }

      if (type.includes('DATETIME') || type.includes('TIMESTAMP')) {
        return () => faker.date.recent({ days: 30 }).toISOString().slice(0, 19).replace('T', ' ');
      }

      if (/\bDATE\b/.test(type)) {
        return () => faker.date.past({ years: 1 }).toISOString().split('T')[0];
      }

      if (/\bTIME\b/.test(type)) {
        return () => faker.date.recent({ days: 1 }).toISOString().split('T')[1].slice(0, 8);
      }

      if (type.includes('DECIMAL') || type.includes('NUMERIC') || type.includes('FLOAT') || type.includes('DOUBLE')) {
        return () => faker.number.float({ min: 10, max: 1000, multipleOf: 0.01 });
      }

      if (type.includes('INT') || type.includes('BIT')) {
        return () => faker.number.int({ min: 1, max: 10000 });
      }

      if (type.includes('JSON')) {
        return () => JSON.stringify({ value: faker.lorem.word(), createdAt: faker.date.recent().toISOString() });
      }

      if (type.includes('TEXT')) {
        return () => faker.lorem.paragraph();
      }

      if (type.includes('CHAR') || type.includes('ENUM') || type.includes('SET')) {
        return () => faker.lorem.words({ min: 1, max: 3 });
      }

      return null;
    };

    const mergedFieldGenerators = {
      ...map,
      ...generators,
      ...fieldGenerators
    };

    const getFieldDefinitions = (rawFields) => {
      return Object.entries(rawFields).map(([fieldName, config]) => {
        if (typeof config === 'string') {
          return {
            name: fieldName,
            type: config,
            generatorOverride: undefined
          };
        }

        if (config && typeof config === 'object' && !Array.isArray(config)) {
          const { type, generator } = config;

          if (typeof type !== 'string' || !type.trim()) {
            throw new Error(
              `Invalid field config for '${fieldName}'. Expected { type: 'SQL_TYPE', generator?: string|function }.`
            );
          }

          return {
            name: fieldName,
            type,
            generatorOverride: generator
          };
        }

        throw new Error(
          `Invalid field definition for '${fieldName}'. Expected 'SQL_TYPE' string or { type, generator } object.`
        );
      });
    };

    const isDbManagedField = (fieldType) => {
      const normalizedType = String(fieldType || '').toUpperCase();
      return normalizedType.includes('AUTO_INCREMENT') || normalizedType.includes('GENERATED ALWAYS AS');
    };

    const resolveGenerator = (fieldName, fieldType, inlineOverride) => {
      const override = inlineOverride !== undefined ? inlineOverride : mergedFieldGenerators[fieldName];

      if (override !== undefined) {
        if (typeof override === 'function') {
          return override;
        }

        if (typeof override === 'string') {
          if (!autoGenerators[override]) {
            throw new Error(
              `Invalid fieldGenerators override for '${fieldName}': '${override}' is not a known generator key.\n` +
              `Supported generator keys: ${Object.keys(autoGenerators).join(', ')}`
            );
          }

          return autoGenerators[override];
        }

        throw new Error(
          `Invalid fieldGenerators override for '${fieldName}'. Value must be a generator key string or function.`
        );
      }

      if (autoGenerators[fieldName]) {
        return autoGenerators[fieldName];
      }

      const normalizedName = fieldName.toLowerCase();
      const aliasKey = Object.keys(autoGenerators).find((key) =>
        normalizedName === key ||
        normalizedName.startsWith(`${key}_`) ||
        normalizedName.endsWith(`_${key}`) ||
        normalizedName.includes(`_${key}_`)
      );

      if (aliasKey) {
        return autoGenerators[aliasKey];
      }

      const inferredGenerator = inferGeneratorFromSqlType(fieldType);
      if (inferredGenerator) {
        return inferredGenerator;
      }

      throw new Error(
        `Cannot auto-generate data for field '${fieldName}' with SQL type '${fieldType}'.\n` +
        `Use a recognized field name, or provide fieldGenerators['${fieldName}'] with a known generator key or custom function.`
      );
    };

    // 4. DROP TABLE IF REQUESTED
    if (dropTableIfExists) {
      await connection.query(`DROP TABLE IF EXISTS ${escapedTable}`);
      console.log(`🗑️  Dropped existing table '${table}'`);
    }

    // 5. CREATE TABLE
    const fieldDefinitions = getFieldDefinitions(fields);
    fieldDefinitions.forEach(({ name, type }) => {
      assertSafeIdentifier(name, 'field name');
      assertSafeSqlType(type, name);
    });
    const columns = fieldDefinitions
      .map(({ name, type }) => `${escapeIdentifier(name)} ${type}`)
      .join(', ');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ${escapedTable} (
        ${columns}
      )
    `);
    console.log(`✅ Table '${table}' ready`);

    // 6. TRUNCATE IF REQUESTED
    if (truncateBeforeInsert) {
      await connection.query(`TRUNCATE TABLE ${escapedTable}`);
      console.log(`🗑️  Truncated table '${table}'`);
    }

    // 7. PREPARE INSERTABLE FIELDS (skip DB-managed columns like AUTO_INCREMENT)
    const insertableFieldDefinitions = fieldDefinitions.filter(({ type }) => !isDbManagedField(type));
    const fieldNames = insertableFieldDefinitions.map(({ name }) => name);
    const resolvedGenerators = insertableFieldDefinitions.map(({ name, type, generatorOverride }) =>
      resolveGenerator(name, type, generatorOverride)
    );

    // 8. GENERATE + 9. INSERT (batched)
    console.log(`📝 Generating ${numRecords} fake records...`);
    const hasInsertableFields = fieldNames.length > 0;
    const escapedFieldNames = fieldNames.map((name) => escapeIdentifier(name));
    const placeholderRow = hasInsertableFields
      ? `(${fieldNames.map(() => '?').join(', ')})`
      : '()';

    let insertedRecords = 0;
    for (let offset = 0; offset < numRecords; offset += batchSize) {
      const currentBatchSize = Math.min(batchSize, numRecords - offset);
      const records = [];

      for (let i = 0; i < currentBatchSize; i++) {
        const record = resolvedGenerators.map((generator) => generator());
        records.push(record);
      }

      const insertSQL = hasInsertableFields
        ? `INSERT INTO ${escapedTable} (${escapedFieldNames.join(', ')}) VALUES ${Array.from({ length: currentBatchSize }, () => placeholderRow).join(', ')}`
        : `INSERT INTO ${escapedTable} () VALUES ${Array.from({ length: currentBatchSize }, () => '()').join(', ')}`;
      const flatValues = hasInsertableFields ? records.flat() : [];

      const [result] = await connection.query(insertSQL, flatValues);
      insertedRecords += result.affectedRows;
    }

    console.log(`✅ Inserted ${insertedRecords} records!`);

    // 10. SHOW SAMPLE
    const [rows] = await connection.query(`SELECT * FROM ${escapedTable} LIMIT 3`);
    console.log('\n📋 Sample data:');
    console.table(rows);

    return {
      success: true,
      insertedRecords,
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
    } else if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
      console.error(
        "\n💡 Fix: The existing table schema has a required column without default (commonly 'id'). " +
        "Use dropTableIfExists: true to recreate the table from your current fields, or include that required column in fields."
      );
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
