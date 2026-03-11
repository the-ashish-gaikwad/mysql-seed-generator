# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-11

### Added
- Initial release
- MySQL database seeding functionality
- Auto-generated fake data using Faker.js
- Support for 50+ field types including:
  - People fields (name, email, phone, etc.)
  - Location fields (city, country, address, etc.)
  - Product fields (product_name, price, category, etc.)
  - Image URLs (avatar, product_image, cover_image, etc.)
  - Date fields (date, created_at, birth_date, etc.)
  - Boolean fields (is_active, is_verified, etc.)
- Database and table auto-creation
- Configuration options:
  - Custom host, port, user, password
  - dropTableIfExists option
  - truncateBeforeInsert option
- Comprehensive error handling with helpful messages
- Promise-based API with async/await support
- JSDoc documentation
- Examples and test files

### Future Plans
- v1.1: Custom field generators
- v2.0: PostgreSQL support
- v2.1: SQLite support
- v3.0: MongoDB support

## [Unreleased]

Nothing yet!
