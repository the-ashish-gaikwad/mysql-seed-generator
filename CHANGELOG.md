# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-03-13

### Added
- Custom column names are now supported.
- Data generation now falls back to SQL-type inference when a predefined field name is not used.
- Optional `fieldGenerators` overrides are supported for per-column control using a generator key or custom function.
- Added `map` option as a simpler way to map custom column names to generators.
- Simplified field configuration: `fields.<name>` can now be an object with `{ type, generator }`.

### Fixed
- `AUTO_INCREMENT` columns (for example `id INT AUTO_INCREMENT PRIMARY KEY`) are now treated as database-managed and are excluded from generated insert payloads.
- Added clearer guidance for `ER_NO_DEFAULT_FOR_FIELD` when an existing table schema requires columns missing from current `fields` input.
- Added identifier validation for database, table, and field names to avoid unsafe SQL construction.
- Added SQL type safety checks to block obvious multi-statement/comment payloads.
- Insert operations are now batched (`batchSize`) to reduce large-query failures.
- Fixed test workflow: `npm test` now runs `test/basic.test.js` and the test file imports package code correctly.

## [2.0.0] - 2026-03-13

### Changed
- Table creation no longer injects an implicit `id INT AUTO_INCREMENT PRIMARY KEY` column.

### Breaking
- You must define every column you want in `fields`, including primary keys.

### Migration Notes
- If your current code relies on implicit IDs, add an explicit ID field:

```js
fields: {
  id: 'INT AUTO_INCREMENT PRIMARY KEY',
  name: 'VARCHAR(255)',
  email: 'VARCHAR(255) UNIQUE'
}
```

## [1.0.1] - 2026-03-12

### Fixed
- Generated phone numbers are now bounded to avoid `ER_DATA_TOO_LONG` when used with common schemas such as `VARCHAR(20)`.

### Changed
- Documentation and examples were refined for setup clarity and safer defaults.
- Repository hygiene updates (`.gitignore`, tracked file cleanup).

## [1.0.0] - 2026-03-11

### Added
- Initial release of `mysql-seed-generator`.
- MySQL seeding flow: connect, create database/table, generate fake data, and insert records.
- Auto-detected fake data generation for common field names (people, contact, location, product, images, dates, booleans, and more).
- Config options for `host`, `port`, `user`, `password`, `database`, `table`, `numRecords`, `dropTableIfExists`, and `truncateBeforeInsert`.
- Promise-based API with async/await support.
- Helpful runtime error hints for common MySQL failures.

### Notes
- In `1.0.0`, table creation included an implicit `id INT AUTO_INCREMENT PRIMARY KEY` column.

[Unreleased]: https://github.com/the-ashish-gaikwad/mysql-seed-generator/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/the-ashish-gaikwad/mysql-seed-generator/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/the-ashish-gaikwad/mysql-seed-generator/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/the-ashish-gaikwad/mysql-seed-generator/compare/4ca1991...v1.0.1
[1.0.0]: https://github.com/the-ashish-gaikwad/mysql-seed-generator/commit/4ca1991