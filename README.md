# MySQL Seed Generator

Simple MySQL database seeder with auto-generated fake data. Perfect for testing, development, and prototyping.

## Features

✅ **Zero Configuration** - Works out of the box with sensible defaults  
✅ **Auto-Generated Fake Data** - Works with predefined field names and custom column names  
✅ **50+ Field Types** - Names, emails, addresses, images, dates, and more  
✅ **Custom Column Names** - Use your own schema naming style and still generate realistic data  
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
| `fields` | object | **required** | Field definitions. Supports `'SQL_TYPE'` or `{ type, generator }` per field |
| `map` | object | `{}` | Recommended simple mapping for custom column names (`fieldName: 'name'` or `fieldName: () => value`) |
| `fieldGenerators` | object | `{}` | Optional legacy per-field generator overrides (`fieldName: 'name'` or `fieldName: () => value`) |
| `generators` | object | `{}` | Alias for `fieldGenerators` |
| `numRecords` | number | `10` | Number of records to generate |
| `dropTableIfExists` | boolean | `false` | Drop table before creating |
| `truncateBeforeInsert` | boolean | `false` | Truncate table before inserting |

## Supported Field Types

Predefined field names generate smart matching data automatically.
Custom field names are also supported and will use SQL-type inference (or explicit overrides).

### Simplest Custom-Name Format (Recommended)

Keep your `fields` simple, and use `map` only for the custom names you want to control:

```javascript
fields: {
  customer_name: 'VARCHAR(255)',
  customer_email: 'VARCHAR(255)',
  joined_on: 'DATE',
  loyalty_points: 'INT'
},
map: {
  customer_name: 'name',
  customer_email: 'email'
}
```

Plain string values are always treated as SQL types, so your datatype and constraints remain fully under your control.

### AUTO_INCREMENT and DB-Managed Columns

Columns such as `id INT AUTO_INCREMENT PRIMARY KEY` are treated as database-managed.
They are included in table creation, but values are not generated or inserted by the package.

```javascript
fields: {
  id: 'INT AUTO_INCREMENT PRIMARY KEY',
  name: 'VARCHAR(255)',
  email: 'VARCHAR(255) UNIQUE'
}
```

### Inline Field Format (Advanced)

Keep everything in one place by defining type and generator inside each field:

```javascript
fields: {
  customer_name: {
    type: 'VARCHAR(255)',
    generator: 'name' // built-in generator key
  },
  customer_code: {
    type: 'VARCHAR(20)',
    generator: () => `CUST-${Math.floor(Math.random() * 100000)}`
  },
  joined_on: {
    type: 'DATE'
  }
}
```

### Generator Resolution Order

When generating values, this package resolves each field in the following order:

1. `fields[fieldName].generator` inline override (if provided)
2. `map[fieldName]` (recommended simple override)
3. `fieldGenerators[fieldName]` or `generators[fieldName]` (legacy aliases)
4. Exact predefined field match (for example `email`, `name`)
5. Alias match inside custom field names (for example `customer_email`)
6. SQL-type inference fallback (for example `INT`, `DATE`, `BOOLEAN`, `DECIMAL`, `VARCHAR`)


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

### Custom Column Names

```javascript
async function seedCustomColumns() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'crm',
    table: 'customers',
    numRecords: 25,
    fields: {
      customer_full_name: 'VARCHAR(255)',
      customer_email_address: 'VARCHAR(255)',
      loyalty_points_total: 'INT',
      onboarded_on: 'DATE'
    },
    map: {
      customer_full_name: 'name',
      customer_email_address: 'email'
    }
  });
}
```

### Existing Schema Naming Convention

```javascript
async function seedLegacyUserTable() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'legacy_app',
    table: 'user_master',
    numRecords: 100,
    fields: {
      usr_id: 'INT AUTO_INCREMENT PRIMARY KEY',
      usr_full_nm: 'VARCHAR(255) NOT NULL',
      usr_mail_addr: 'VARCHAR(255) UNIQUE',
      usr_city_nm: 'VARCHAR(120)',
      usr_is_active: 'BOOLEAN'
    },
    map: {
      usr_full_nm: 'name',
      usr_mail_addr: 'email',
      usr_city_nm: 'city',
      usr_is_active: 'is_active'
    }
  });
}
```

### Domain-Specific Custom Columns

```javascript
async function seedAdmissions() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'hospital',
    table: 'admissions',
    numRecords: 40,
    fields: {
      patient_uid: 'VARCHAR(36) PRIMARY KEY',
      patient_full_name: 'VARCHAR(255)',
      contact_email: 'VARCHAR(255)',
      admission_date: 'DATE',
      emergency_contact_phone: 'VARCHAR(20)'
    },
    map: {
      patient_uid: 'uuid',
      patient_full_name: 'name',
      contact_email: 'email',
      admission_date: 'date',
      emergency_contact_phone: 'phone'
    }
  });
}
```

### Custom Generators for Any Column

```javascript
async function seedCustomGenerators() {
  await seedDatabase({
    user: 'root',
    password: 'password',
    database: 'crm',
    table: 'customers',
    numRecords: 25,
    fields: {
      customer_name: {
        type: 'VARCHAR(255)',
        generator: 'name'
      },
      preferred_color: {
        type: 'VARCHAR(50)',
        generator: 'color'
      },
      customer_code: {
        type: 'VARCHAR(20)',
        generator: () => `CUST-${Math.floor(Math.random() * 100000)}`
      }
    }
  });
}
```

Legacy style with `fieldGenerators` and `generators` still works for backward compatibility.

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

## Running Tests

This project includes integration tests in [basic.test.js](basic.test.js). Tests require a running MySQL instance and a password for your MySQL user.

Set `MYSQL_PASSWORD` and run tests:

```bash
# Git Bash / macOS / Linux
MYSQL_PASSWORD=yourpassword npm test
```

```powershell
# Windows PowerShell
$env:MYSQL_PASSWORD="yourpassword"; npm test
```

```cmd
:: Windows CMD
set MYSQL_PASSWORD=yourpassword && npm test
```

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

### Cannot Auto-Generate Field Error

```
❌ Error: Cannot auto-generate data for field 'my_custom_field' with SQL type '...'
```

If this happens on `id` with `AUTO_INCREMENT`, upgrade to the latest package version.

**Fix options:**
- Use a predefined field name (for example `email`, `name`, `city`), or
- Keep your custom field name and use a compatible SQL type (`VARCHAR`, `INT`, `DATE`, etc.), or
- Add an explicit inline `generator` or `fieldGenerators` override for that field.

Example:

```javascript
fields: {
  my_custom_field: {
    type: 'VARCHAR(50)',
    generator: () => 'custom-value'
  }
}
```

### Field Doesn't Have a Default Value

```
❌ Error: Field 'id' doesn't have a default value
```

This usually means the table already exists with a required column (often `id`) that is not part of your current `fields` input.

**Fix options:**
- Recreate the table from current fields:

```javascript
await seedDatabase({
  // ...other options
  dropTableIfExists: true,
  fields: {
    name: 'VARCHAR(255)',
    email: 'VARCHAR(255) UNIQUE'
  }
});
```

- Or include the required column in `fields` (for example `id: 'INT AUTO_INCREMENT PRIMARY KEY'`).

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

## Acknowledgments

This project is built with help from excellent open source maintainers. Thank you for your work and generosity.

- [@faker-js/faker](https://github.com/faker-js/faker): fake data generation used throughout this package.
- [mysql2](https://github.com/sidorares/node-mysql2): reliable MySQL client used for database connectivity.

Their projects make this package possible and much better for everyone.

For license details, see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## License

MIT

## Support

If you find this package useful, please star it on GitHub! ⭐

For bugs and feature requests, please open an issue on GitHub.
