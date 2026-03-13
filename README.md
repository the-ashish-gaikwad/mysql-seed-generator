# MySQL Seed Generator

Simple MySQL database seeder with auto-generated fake data. Perfect for testing, development, and prototyping.

## Features

✅ **Zero Configuration** - Works out of the box with sensible defaults  
✅ **Auto-Generated Fake Data** - Just specify field names, data is generated automatically  
✅ **50+ Field Types** - Names, emails, addresses, images, dates, and more  
✅ **Database & Table Creation** - Creates database and tables if they don't exist  
✅ **Simple API** - One function does everything  
✅ **Promise-based** - Modern async/await support

## Installation

```bash
npm install mysql-seed-generator
```

## Quick Start

```javascript
const seedDatabase = require('mysql-seed-generator');

async function seedUsers() {
  await seedDatabase({
    user: 'root',              // MySQL username
    password: 'yourpassword',  // MySQL password
    database: 'myapp',
    table: 'users',
    numRecords: 100,
    fields: {
      name: 'VARCHAR(255)',
      email: 'VARCHAR(255) UNIQUE',
      age: 'INT',
      city: 'VARCHAR(100)'
    }
  });
}

seedUsers()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error:', err));
```

That's it! The function will:
1. Connect to MySQL
2. Create the database (if needed)
3. Create the table (if needed)
4. Generate 100 fake users
5. Insert them into the database

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `user` | string | `'root'` | MySQL username |
| `password` | string | `''` | MySQL password |
| `host` | string | `'localhost'` | MySQL host |
| `port` | number | `3306` | MySQL port |
| `database` | string | **required** | Database name |
| `table` | string | **required** | Table name |
| `fields` | object | **required** | Field definitions |
| `numRecords` | number | `10` | Number of records to generate |
| `dropTableIfExists` | boolean | `false` | Drop table before creating |
| `truncateBeforeInsert` | boolean | `false` | Truncate table before inserting |

## Supported Field Types

Just use these field names and fake data is generated automatically!

### 👤 People
- `name`, `full_name` → "John Doe"
- `first_name` → "John"
- `last_name` → "Doe"

### 📧 Contact
- `email` → "john@example.com"
- `username` → "john_doe123"
- `phone` → "+14155552671" (E.164-like, fits `VARCHAR(20)`)

### 🔢 Numbers
- `age` → 25
- `price` → 49.99
- `salary` → 75000
- `quantity` → 50
- `rating` → 4.5

### 📍 Location
- `city` → "New York"
- `country` → "United States"
- `address` → "123 Main St"
- `state` → "California"
- `zip`, `zipcode` → "12345"
- `latitude` → 37.7749
- `longitude` → -122.4194

### 💼 Work
- `job_title` → "Software Engineer"
- `company` → "Tech Corp"
- `department` → "Engineering"

### 🛍️ Products
- `product`, `product_name` → "Awesome Product"
- `category` → "Electronics"
- `description` → "Long description text..."

### 🖼️ Images
- `image`, `image_url`, `photo` → Random image URL
- `avatar`, `avatar_url` → Avatar image
- `thumbnail` → Small image (200x200)
- `product_image` → Product photo (400x400)
- `cover_image` → Cover image (1200x600)

### 📅 Dates
- `date` → "2024-03-15"
- `created_at`, `updated_at` → "2024-03-15 10:30:45"
- `birth_date` → "1990-05-20"

### ✅ Boolean
- `is_active`, `is_verified`, `is_premium` → true/false

### 🎯 Others
- `status` → "active", "inactive", or "pending"
- `title` → "Some Title Text"
- `bio` → "A short biography..."
- `url` → "https://example.com"
- `color` → "blue"
- `uuid` → "550e8400-e29b-41d4-a716-446655440000"

## Examples

### Basic Users

```javascript
async function seedUsers() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'myapp',
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

seedUsers()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error:', err));
```

### E-commerce Products

```javascript
async function seedUsers() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'shop',
    table: 'products',
    numRecords: 200,
    fields: {
      product_name: 'VARCHAR(255)',
      price: 'DECIMAL(10,2)',
      category: 'VARCHAR(100)',
      product_image: 'VARCHAR(500)',
      description: 'TEXT',
      quantity: 'INT',
      rating: 'DECIMAL(2,1)'
    }
  });
}
```

### Employee Records

```javascript
async function seedUsers() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'company',
    table: 'employees',
    numRecords: 100,
    fields: {
      full_name: 'VARCHAR(255)',
      email: 'VARCHAR(255) UNIQUE',
      job_title: 'VARCHAR(100)',
      department: 'VARCHAR(100)',
      salary: 'INT',
      phone: 'VARCHAR(20)',
      created_at: 'DATETIME',
      is_active: 'BOOLEAN'
    }
  });
}
```

### Blog Posts with Images

```javascript
async function seedUsers() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'blog',
    table: 'posts',
    numRecords: 30,
    fields: {
      title: 'VARCHAR(255)',
      description: 'TEXT',
      cover_image: 'VARCHAR(500)',
      created_at: 'DATETIME',
      status: 'VARCHAR(20)'
    }
});
}
```

### Users with Avatars

```javascript
async function seedUsers() {
await seedDatabase({
  user: 'root',
  password: 'password',
  database: 'myapp',
  table: 'users',
  numRecords: 100,
  fields: {
    username: 'VARCHAR(100) UNIQUE',
    email: 'VARCHAR(255) UNIQUE',
    avatar: 'VARCHAR(500)',
    bio: 'TEXT',
    is_verified: 'BOOLEAN',
    created_at: 'DATETIME'
  }
});
}
```

## Common SQL Data Types

- `VARCHAR(255)` - Text up to 255 characters
- `VARCHAR(255) UNIQUE` - Unique text (no duplicates)
- `TEXT` - Long text
- `INT` - Integer number
- `DECIMAL(10,2)` - Decimal with precision (e.g., prices)
- `BOOLEAN` - True/False
- `DATE` - Date only (YYYY-MM-DD)
- `DATETIME` - Date and time
- `TIMESTAMP` - Timestamp

## Advanced Usage

### Drop and Recreate Table

```javascript
async function seedUsers() {
await seedDatabase({
  user: 'root',
  password: 'password',
  database: 'myapp',
  table: 'users',
  dropTableIfExists: true,  // ← Drops table first
  numRecords: 100,
  fields: {
    name: 'VARCHAR(255)',
    email: 'VARCHAR(255) UNIQUE'
  }
});
}
```

### Truncate Before Insert

```javascript
async function seedUsers() {
await seedDatabase({
  user: 'root',
  password: 'password',
  database: 'myapp',
  table: 'users',
  truncateBeforeInsert: true,  // ← Clears existing data
  numRecords: 100,
  fields: {
    name: 'VARCHAR(255)',
    email: 'VARCHAR(255) UNIQUE'
  }
});
}
```

### Custom Host and Port

```javascript
async function seedUsers() {
await seedDatabase({
  host: '192.168.1.100',
  port: 3307,
  user: 'dbuser',
  password: 'password',
  database: 'myapp',
  table: 'users',
  numRecords: 50,
  fields: {
    name: 'VARCHAR(255)',
    email: 'VARCHAR(255) UNIQUE'
  }
});
}
```
## Requirements

- Node.js >= 14.0.0
- MySQL server running and accessible

## Troubleshooting

### Access Denied Error

```
❌ Error: Access denied for user 'root'@'localhost'
```

**Fix:** Check your MySQL username and password:
```javascript
await seedDatabase({
  user: 'root',        // ← Verify this
  password: 'yourpassword',  // ← Verify this
  // ...
});
```

### Connection Refused

```
❌ Error: ECONNREFUSED
```

**Fix:** Make sure MySQL is running:
- Mac: `mysql.server start` or `brew services start mysql`
- Linux: `sudo systemctl start mysql`
- Windows: Start MySQL from Services

### Unknown Field Error

```
❌ Error: Unknown field 'my_custom_field'
```

**Fix:** Use one of the supported field names from the list above, or open an issue on GitHub to request support for new field types.

## Roadmap

Development strategy is intentionally phased so each database package can mature independently before combining everything.

### Phase 1: Database-specific packages

- ✅ `mysql-seed-generator` (this package)
- 🔜 `postgresql-seed-generator`
- 🔜 `sqlite-seed-generator`
- 🔜 Additional dedicated generators (for example `mongodb-seed-generator`)

### Phase 2: Stability and feature parity

- Align core features across all generators
- Improve reliability and database-specific edge case handling
- Add consistent docs, examples, and test coverage for each package

### Phase 3: One-stop unified solution

- Build a single package that brings all generators together under one API
- Keep driver-specific behavior where needed while sharing common workflows
- Ship an integrated seeding toolkit once individual packages are production-ready

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you find this package useful, please star it on GitHub! ⭐

For bugs and feature requests, please open an issue on GitHub.
