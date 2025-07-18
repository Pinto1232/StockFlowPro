#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to remove comments from TypeScript and TSX files while preserving ESLint comments
 */

class CommentRemover {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.createBackups = options.createBackups !== false; // Default to true
    this.backupDir = options.backupDir || '.comment-backups';
    
    // ESLint comment patterns to preserve
    this.eslintPatterns = [
      /\/\*\s*eslint.*?\*\//gi,
      /\/\/\s*eslint-disable.*$/gm,
      /\/\/\s*eslint-enable.*$/gm,
      /\/\/\s*eslint.*$/gm,
      /\/\*\s*eslint-disable.*?\*\//gi,
      /\/\*\s*eslint-enable.*?\*\//gi
    ];

    // Patterns for comments that might be important to preserve
    this.importantCommentPatterns = [
      /\/\*\*[\s\S]*?\*\//g, // JSDoc comments - we'll be more careful with these
      /\/\/\s*@ts-/gm, // TypeScript compiler directives
      /\/\*\s*@ts-/gm, // TypeScript compiler directives
      /\/\/\s*TODO:/gm, // TODO comments
      /\/\/\s*FIXME:/gm, // FIXME comments
      /\/\/\s*NOTE:/gm, // NOTE comments
      /\/\/\s*HACK:/gm, // HACK comments
      /\/\/\s*WARNING:/gm, // WARNING comments
      /\/\*\s*TODO:[\s\S]*?\*\//gm, // Multi-line TODO
      /\/\*\s*FIXME:[\s\S]*?\*\//gm, // Multi-line FIXME
      /\/\/\s*https?:\/\//gm, // URLs in comments
      /\/\*[\s\S]*?https?:\/\/[\s\S]*?\*\//gm // URLs in multi-line comments
    ];
  }

  /**
   * Create backup directory if it doesn't exist
   */
  ensureBackupDir(rootDir) {
    const backupPath = path.join(rootDir, this.backupDir);
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    return backupPath;
  }

  /**
   * Create a backup of the original file
   */
  createBackup(filePath, rootDir) {
    if (!this.createBackups) return null;

    const backupPath = this.ensureBackupDir(rootDir);
    const relativePath = path.relative(rootDir, filePath);
    const backupFilePath = path.join(backupPath, relativePath);
    
    // Ensure backup subdirectories exist
    const backupFileDir = path.dirname(backupFilePath);
    if (!fs.existsSync(backupFileDir)) {
      fs.mkdirSync(backupFileDir, { recursive: true });
    }

    fs.copyFileSync(filePath, backupFilePath);
    return backupFilePath;
  }

  /**
   * Check if a comment should be preserved
   */
  shouldPreserveComment(comment) {
    // Always preserve ESLint comments
    if (this.eslintPatterns.some(pattern => pattern.test(comment))) {
      return true;
    }

    // Check for important comment patterns
    return this.importantCommentPatterns.some(pattern => pattern.test(comment));
  }

  /**
   * Analyze comments in the code and provide a report
   */
  analyzeComments(code) {
    const analysis = {
      totalComments: 0,
      eslintComments: 0,
      importantComments: 0,
      regularComments: 0,
      commentsToRemove: [],
      commentsToPreserve: []
    };

    // Find all single-line comments
    const singleLineComments = code.match(/\/\/.*$/gm) || [];
    // Find all multi-line comments
    const multiLineComments = code.match(/\/\*[\s\S]*?\*\//g) || [];
    
    const allComments = [...singleLineComments, ...multiLineComments];
    analysis.totalComments = allComments.length;

    allComments.forEach(comment => {
      if (this.eslintPatterns.some(pattern => pattern.test(comment))) {
        analysis.eslintComments++;
        analysis.commentsToPreserve.push(comment);
      } else if (this.importantCommentPatterns.some(pattern => pattern.test(comment))) {
        analysis.importantComments++;
        analysis.commentsToPreserve.push(comment);
      } else {
        analysis.regularComments++;
        analysis.commentsToRemove.push(comment);
      }
    });

    return analysis;
  }

  /**
   * Safely remove comments from code while preserving important ones
   */
  removeComments(code) {
    let result = code;
    const preservedComments = [];
    const placeholders = [];

    // First, extract and store all comments that should be preserved
    [...this.eslintPatterns, ...this.importantCommentPatterns].forEach(pattern => {
      result = result.replace(pattern, (match) => {
        const placeholder = `__PRESERVED_COMMENT_${preservedComments.length}__`;
        preservedComments.push(match);
        placeholders.push(placeholder);
        return placeholder;
      });
    });

    // Now safely remove remaining comments
    // Remove single-line comments (excluding those in strings)
    result = result.replace(/\/\/(?![^\r\n]*["'`]).*$/gm, '');

    // Remove multi-line comments (more carefully)
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');

    // Restore preserved comments
    placeholders.forEach((placeholder, index) => {
      result = result.replace(placeholder, preservedComments[index]);
    });

    // Clean up extra whitespace but preserve intentional formatting
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return result;
  }

  /**
   * Process a single file with safety checks
   */
  processFile(filePath, rootDir) {
    try {
      const relativePath = path.relative(rootDir, filePath);
      console.log(`Processing: ${relativePath}`);
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Analyze comments before processing
      const analysis = this.analyzeComments(content);
      
      if (analysis.totalComments === 0) {
        console.log(`  - No comments found`);
        return { processed: true, updated: false, analysis };
      }

      console.log(`  - Found ${analysis.totalComments} comments (${analysis.eslintComments} ESLint, ${analysis.importantComments} important, ${analysis.regularComments} regular)`);
      
      if (analysis.regularComments === 0) {
        console.log(`  - No comments to remove`);
        return { processed: true, updated: false, analysis };
      }

      const processedContent = this.removeComments(content);
      
      // Only proceed if content actually changed
      if (content !== processedContent) {
        if (this.dryRun) {
          console.log(`  🔍 DRY RUN: Would remove ${analysis.regularComments} comments`);
          return { processed: true, updated: false, analysis, dryRun: true };
        }

        // Create backup before modifying
        let backupPath = null;
        if (this.createBackups) {
          backupPath = this.createBackup(filePath, rootDir);
          console.log(`  💾 Backup created: ${path.relative(rootDir, backupPath)}`);
        }

        // Write the processed content
        fs.writeFileSync(filePath, processedContent, 'utf8');
        console.log(`  ✓ Updated: Removed ${analysis.regularComments} comments`);
        
        return { 
          processed: true, 
          updated: true, 
          analysis, 
          backupPath 
        };
      } else {
        console.log(`  - No changes needed`);
        return { processed: true, updated: false, analysis };
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${filePath}:`, error.message);
      return { processed: false, updated: false, error: error.message };
    }
  }

  /**
   * Recursively find all TypeScript and TSX files in the project
   */
  findTsFiles(rootDir) {
    const excludeDirs = ['node_modules', 'dist', 'build', '.expo', '.git', '.vscode', '.qodo', '.zencoder'];
    const files = [];

    const walkDir = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Skip excluded directories
            if (!excludeDirs.includes(item)) {
              walkDir(fullPath);
            }
          } else if (stat.isFile()) {
            // Check if file has .ts or .tsx extension
            if (item.endsWith('.ts') || item.endsWith('.tsx')) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
      }
    };

    walkDir(rootDir);
    return files;
  }

  /**
   * Main execution function
   */
  run(targetDir = null) {
    const rootDir = path.resolve(targetDir || process.cwd());
    
    console.log('🚀 Starting safe comment removal process...');
    console.log(`📁 Target directory: ${rootDir}`);
    console.log(`🔍 Mode: ${this.dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
    console.log(`💾 Backups: ${this.createBackups ? 'Enabled' : 'Disabled'}`);
    console.log('📋 Preserving: ESLint comments, TypeScript directives, TODO/FIXME, JSDoc, URLs');
    console.log('');

    const tsFiles = this.findTsFiles(rootDir);
    
    if (tsFiles.length === 0) {
      console.log('❌ No TypeScript or TSX files found.');
      return { success: false, message: 'No files found' };
    }

    console.log(`📄 Found ${tsFiles.length} TypeScript/TSX files`);
    console.log('');

    const results = {
      processedCount: 0,
      updatedCount: 0,
      errorCount: 0,
      totalCommentsRemoved: 0,
      totalCommentsPreserved: 0,
      backupPaths: [],
      errors: []
    };

    tsFiles.forEach(file => {
      const result = this.processFile(file, rootDir);
      results.processedCount++;
      
      if (result.processed) {
        if (result.updated) {
          results.updatedCount++;
        }
        if (result.analysis) {
          results.totalCommentsRemoved += result.analysis.regularComments;
          results.totalCommentsPreserved += result.analysis.eslintComments + result.analysis.importantComments;
        }
        if (result.backupPath) {
          results.backupPaths.push(result.backupPath);
        }
      } else {
        results.errorCount++;
        if (result.error) {
          results.errors.push({ file, error: result.error });
        }
      }
    });

    console.log('');
    console.log('✅ Comment removal process completed!');
    console.log(`📊 Files processed: ${results.processedCount}`);
    console.log(`📝 Files updated: ${results.updatedCount}`);
    console.log(`❌ Errors: ${results.errorCount}`);
    console.log(`🗑️  Comments removed: ${results.totalCommentsRemoved}`);
    console.log(`🔒 Comments preserved: ${results.totalCommentsPreserved}`);
    
    if (results.backupPaths.length > 0) {
      console.log(`💾 Backups created: ${results.backupPaths.length} files in ${this.backupDir}/`);
    }

    if (this.dryRun && results.totalCommentsRemoved > 0) {
      console.log('');
      console.log('🔍 This was a dry run. To actually remove comments, run without --dry-run flag.');
    }

    if (results.errorCount > 0) {
      console.log('');
      console.log('❌ Errors encountered:');
      results.errors.forEach(({ file, error }) => {
        console.log(`  - ${path.relative(rootDir, file)}: ${error}`);
      });
    }

    return results;
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node remove-comments.js [directory] [options]

Safely remove comments from TypeScript and TSX files while preserving important ones.

Arguments:
  directory              Target directory to process (default: current directory)

Options:
  --dry-run             Preview changes without modifying files
  --no-backup           Skip creating backup files (not recommended)
  --backup-dir <dir>    Custom backup directory (default: .comment-backups)
  --help, -h            Show this help message

Safety Features:
  ✅ Automatic backups before modification
  ✅ Preserves ESLint comments (eslint-disable, etc.)
  ✅ Preserves TypeScript compiler directives (@ts-ignore, etc.)
  ✅ Preserves TODO, FIXME, NOTE, HACK, WARNING comments
  ✅ Preserves JSDoc comments (/** ... */)
  ✅ Preserves URLs in comments
  ✅ Dry-run mode to preview changes
  ✅ Detailed analysis and reporting

Examples:
  node remove-comments.js --dry-run          # Preview changes without modifying
  node remove-comments.js ./src              # Process src directory with backups
  node remove-comments.js --no-backup        # Process without creating backups
  node remove-comments.js --backup-dir .bak  # Use custom backup directory
    `);
    process.exit(0);
  }

  // Parse command line options
  const options = {
    dryRun: args.includes('--dry-run'),
    createBackups: !args.includes('--no-backup'),
    backupDir: '.comment-backups'
  };

  // Get custom backup directory if specified
  const backupDirIndex = args.indexOf('--backup-dir');
  if (backupDirIndex !== -1 && args[backupDirIndex + 1]) {
    options.backupDir = args[backupDirIndex + 1];
  }

  // Get target directory (first non-option argument)
  const targetDir = args.find(arg => !arg.startsWith('--') && arg !== options.backupDir) || null;

  const remover = new CommentRemover(options);
  const results = remover.run(targetDir);

  // Exit with appropriate code
  process.exit(results.errorCount > 0 ? 1 : 0);
}

module.exports = CommentRemover;