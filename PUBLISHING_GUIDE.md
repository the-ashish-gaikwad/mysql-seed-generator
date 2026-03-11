# Publishing Guide

## Before Publishing

### 1. Update package.json

Replace these placeholders in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "url": "https://github.com/yourusername/mysql-seed-generator.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/mysql-seed-generator/issues"
  },
  "homepage": "https://github.com/yourusername/mysql-seed-generator#readme"
}
```

### 2. Update LICENSE

Replace `[Your Name]` in `LICENSE` file with your actual name.

### 3. Test Locally

```bash
# Install dependencies
npm install

# Run tests (update password in test file first)
npm test

# Try the examples
node examples/basic.js
```

### 4. Check Package Name Availability

```bash
npm search mysql-seed-generator
```

If the name is taken, change it in `package.json`:
- `quick-seed-mysql`
- `mysql-faker-seed`
- `db-seed-generator`
- etc.

## Publishing to npm

### 1. Create npm Account

If you don't have one:
```bash
npm adduser
```

Or login:
```bash
npm login
```

### 2. Verify Package Contents

```bash
npm pack --dry-run
```

This shows what files will be included in the package.

### 3. Publish

```bash
npm publish
```

**First time?** You might need to verify your email first.

### 4. Verify

Check your package is live:
```
https://www.npmjs.com/package/mysql-seed-generator
```

## After Publishing

### 1. Create GitHub Repository

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - v1.0.0"

# Add remote
git remote add origin https://github.com/yourusername/mysql-seed-generator.git

# Push
git push -u origin main
```

### 2. Add GitHub Badge to README

Add to top of README.md:
```markdown
[![npm version](https://badge.fury.io/js/mysql-seed-generator.svg)](https://www.npmjs.com/package/mysql-seed-generator)
[![npm downloads](https://img.shields.io/npm/dm/mysql-seed-generator.svg)](https://www.npmjs.com/package/mysql-seed-generator)
```

### 3. Create GitHub Release

1. Go to your GitHub repo
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `v1.0.0 - Initial Release`
5. Copy changelog from CHANGELOG.md
6. Publish release

## Updating the Package

### 1. Make Your Changes

Edit the code, update tests, etc.

### 2. Update Version

```bash
# For bug fixes
npm version patch  # 1.0.0 → 1.0.1

# For new features
npm version minor  # 1.0.0 → 1.1.0

# For breaking changes
npm version major  # 1.0.0 → 2.0.0
```

### 3. Update CHANGELOG.md

Add your changes under a new version heading.

### 4. Publish Update

```bash
npm publish
```

### 5. Push to GitHub

```bash
git push origin main --tags
```

## Package Maintenance

### Check Package Stats

```bash
npm view mysql-seed-generator
```

### Unpublish (within 72 hours)

```bash
npm unpublish mysql-seed-generator@1.0.0
```

**Warning:** Only do this if absolutely necessary. It can break projects using your package.

### Deprecate (preferred over unpublish)

```bash
npm deprecate mysql-seed-generator@1.0.0 "Please upgrade to 1.1.0"
```

## Best Practices

1. **Semantic Versioning**: Follow semver (major.minor.patch)
2. **Keep CHANGELOG**: Document all changes
3. **Test Before Publishing**: Always run tests
4. **Don't Publish Secrets**: Check .npmignore is working
5. **Respond to Issues**: Help users with problems
6. **Keep README Updated**: Clear documentation = more users

## Promotion

1. **Share on Twitter/X**: Tweet about your package
2. **Reddit**: Post to r/javascript, r/node, r/mysql
3. **Dev.to**: Write a blog post about it
4. **Product Hunt**: Submit your package
5. **Hacker News**: Share in Show HN

## Security

If someone reports a security issue:

1. Fix it immediately
2. Publish a patch version
3. Add security advisory on GitHub
4. Update CHANGELOG with security note

## Questions?

- npm documentation: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- Keep a Changelog: https://keepachangelog.com/

Good luck! 🚀
