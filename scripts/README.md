# Safe Comment Removal Script

This script safely removes comments from TypeScript (`.ts`) and TSX (`.tsx`) files while preserving important comments that could affect your application's functionality.

## 🛡️ Safety Features

- ✅ **Automatic backups** before any modification
- ✅ **Dry-run mode** to preview changes without modifying files
- ✅ **Intelligent comment preservation** for important comments
- ✅ **Detailed analysis and reporting** of what will be changed
- ✅ **Error handling** with graceful recovery
- ✅ **Selective processing** - only modifies files that need changes

## 🔍 What Gets Preserved

The script intelligently preserves comments that are important for your application:

### ESLint Comments
- `// eslint-disable-next-line`
- `// eslint-disable`
- `// eslint-enable`
- `/* eslint-disable */`
- `/* eslint-enable */`
- Any comment containing "eslint"

### TypeScript Compiler Directives
- `// @ts-ignore`
- `// @ts-expect-error`
- `// @ts-nocheck`
- `/* @ts-ignore */`

### Important Development Comments
- `// TODO: ...`
- `// FIXME: ...`
- `// NOTE: ...`
- `// HACK: ...`
- `// WARNING: ...`
- Multi-line versions of the above

### Documentation Comments
- JSDoc comments: `/** ... */`
- Comments containing URLs: `// https://example.com`

## 🗑️ What Gets Removed

- Regular single-line comments: `// This is a comment`
- Regular multi-line comments: `/* This is a comment */`
- Any comment that doesn't match the preservation patterns above

## 📖 Usage

### Using npm scripts (recommended):

```bash
# Preview changes without modifying files (SAFE)
npm run remove-comments:dry-run

# Preview changes for src directory only
npm run remove-comments:src-dry

# Remove comments from entire project (with backups)
npm run remove-comments

# Remove comments from src directory only (with backups)
npm run remove-comments:src

# Remove comments without creating backups (not recommended)
npm run remove-comments:no-backup
```

### Direct execution with options:

```bash
# Preview changes (dry run) - RECOMMENDED FIRST STEP
node scripts/remove-comments.js --dry-run

# Process with backups (default)
node scripts/remove-comments.js ./src

# Process without backups (not recommended)
node scripts/remove-comments.js ./src --no-backup

# Use custom backup directory
node scripts/remove-comments.js --backup-dir .my-backups

# Show help
node scripts/remove-comments.js --help
```

## 🚀 Recommended Workflow

1. **First, run a dry-run to see what would be changed:**
   ```bash
   npm run remove-comments:dry-run
   ```

2. **Review the output and ensure you're comfortable with the changes**

3. **Run the actual removal (backups are created automatically):**
   ```bash
   npm run remove-comments
   ```

4. **Test your application to ensure everything works correctly**

5. **If something breaks, restore from backups in `.comment-backups/`**

## 📁 Backup System

- Backups are automatically created in `.comment-backups/` directory
- Original directory structure is preserved in backups
- Only files that are actually modified get backed up
- You can restore any file by copying from the backup directory

## 📊 Example Output

```
🚀 Starting safe comment removal process...
📁 Target directory: /path/to/your/project
🔍 Mode: LIVE
💾 Backups: Enabled
📋 Preserving: ESLint comments, TypeScript directives, TODO/FIXME, JSDoc, URLs

📄 Found 45 TypeScript/TSX files

Processing: src/components/Button.tsx
  - Found 8 comments (2 ESLint, 1 important, 5 regular)
  💾 Backup created: .comment-backups/src/components/Button.tsx
  ✓ Updated: Removed 5 comments

Processing: src/utils/helpers.ts
  - Found 3 comments (0 ESLint, 1 important, 2 regular)
  💾 Backup created: .comment-backups/src/utils/helpers.ts
  ✓ Updated: Removed 2 comments

✅ Comment removal process completed!
📊 Files processed: 45
📝 Files updated: 12
❌ Errors: 0
🗑️  Comments removed: 127
🔒 Comments preserved: 23
💾 Backups created: 12 files in .comment-backups/
```

## 🚫 Excluded Directories

The script automatically skips these directories:
- `node_modules`
- `dist`
- `build`
- `.expo`
- `.git`
- `.vscode`
- `.qodo`
- `.zencoder`

## 🔧 Advanced Options

```bash
# Custom backup directory
node scripts/remove-comments.js --backup-dir .my-backups

# Process specific directory with dry run
node scripts/remove-comments.js ./src --dry-run

# Disable backups (use with caution)
node scripts/remove-comments.js --no-backup
```

## ⚠️ Important Notes

1. **Always run with `--dry-run` first** to preview changes
2. **Test your application** after removing comments
3. **Keep the backup directory** until you're sure everything works
4. **Use version control** as an additional safety net
5. **The script preserves important comments** but review the dry-run output to be sure

## 🆘 Recovery

If something goes wrong:

1. **From backups:** Copy files from `.comment-backups/` back to their original locations
2. **From git:** Use `git checkout` to restore files
3. **Selective restore:** Only restore specific files that are causing issues