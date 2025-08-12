#!/usr/bin/env node

/**
 * Test runner for services
 * Runs comprehensive service layer tests with coverage reporting
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const logSection = (title) => {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`${title}`, colors.cyan + colors.bright);
  log(`${'='.repeat(60)}`, colors.cyan);
};

const logSubSection = (title) => {
  log(`\n${'-'.repeat(40)}`, colors.blue);
  log(`${title}`, colors.blue + colors.bright);
  log(`${'-'.repeat(40)}`, colors.blue);
};

// Configuration
const config = {
  jestConfig: path.join(__dirname, '../src/libs/services/__tests__/setup/jest.services.config.js'),
  coverageDir: path.join(__dirname, '../coverage/services'),
  testPattern: 'src/libs/services/**/__tests__/**/*.test.(ts|tsx)',
  timeout: 300000, // 5 minutes
};

// Command line options
const args = process.argv.slice(2);
const options = {
  watch: args.includes('--watch') || args.includes('-w'),
  coverage: !args.includes('--no-coverage'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  bail: args.includes('--bail'),
  silent: args.includes('--silent'),
  updateSnapshots: args.includes('--update-snapshots') || args.includes('-u'),
  testNamePattern: args.find(arg => arg.startsWith('--testNamePattern='))?.split('=')[1],
  testPathPattern: args.find(arg => arg.startsWith('--testPathPattern='))?.split('=')[1],
};

// Build Jest command
const buildJestCommand = () => {
  const jestBin = path.join(__dirname, '../node_modules/.bin/jest');
  const cmd = [
    jestBin,
    '--config', config.jestConfig,
    '--testTimeout', config.timeout.toString(),
  ];

  // Add conditional options
  if (options.watch) {
    cmd.push('--watch');
  } else {
    cmd.push('--watchAll=false');
  }

  if (options.coverage && !options.watch) {
    cmd.push('--coverage');
    cmd.push('--coverageDirectory', config.coverageDir);
  }

  if (options.verbose) {
    cmd.push('--verbose');
  }

  if (options.bail) {
    cmd.push('--bail', '1');
  }

  if (options.silent) {
    cmd.push('--silent');
  }

  if (options.updateSnapshots) {
    cmd.push('--updateSnapshot');
  }

  if (options.testNamePattern) {
    cmd.push('--testNamePattern', options.testNamePattern);
  }

  if (options.testPathPattern) {
    cmd.push('--testPathPattern', options.testPathPattern);
  }

  // Add test pattern
  cmd.push(config.testPattern);

  return cmd;
};

// Pre-test setup
const preTestSetup = async () => {
  logSection('Services Test Setup');

  // Ensure coverage directory exists
  if (!fs.existsSync(config.coverageDir)) {
    fs.mkdirSync(config.coverageDir, { recursive: true });
    log(`✓ Created coverage directory: ${config.coverageDir}`, colors.green);
  }

  // Check Jest config exists
  if (!fs.existsSync(config.jestConfig)) {
    log(`✗ Jest config not found: ${config.jestConfig}`, colors.red);
    process.exit(1);
  }

  log(`✓ Jest config found: ${config.jestConfig}`, colors.green);
  log(`✓ Test pattern: ${config.testPattern}`, colors.green);
  log(`✓ Coverage enabled: ${options.coverage}`, colors.green);
  log(`✓ Watch mode: ${options.watch}`, colors.green);
};

// Run tests
const runTests = async () => {
  logSection('Running Services Tests');

  const jestCommand = buildJestCommand();
  
  log(`Command: ${jestCommand.join(' ')}`, colors.dim);

  return new Promise((resolve, reject) => {
    const jest = spawn(jestCommand[0], jestCommand.slice(1), {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        TZ: 'UTC',
        JEST_VERBOSE: options.verbose ? 'true' : 'false',
      },
    });

    jest.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Jest exited with code ${code}`));
      }
    });

    jest.on('error', (error) => {
      reject(error);
    });
  });
};

// Post-test reporting
const postTestReporting = async (success) => {
  logSection('Test Results');

  if (success) {
    log('✓ All tests passed!', colors.green + colors.bright);
  } else {
    log('✗ Some tests failed!', colors.red + colors.bright);
  }

  if (options.coverage && !options.watch) {
    logSubSection('Coverage Reports Generated');
    
    const reports = [
      { name: 'HTML Report', path: path.join(config.coverageDir, 'lcov-report/index.html') },
      { name: 'LCOV Report', path: path.join(config.coverageDir, 'lcov.info') },
      { name: 'JSON Summary', path: path.join(config.coverageDir, 'coverage-summary.json') },
      { name: 'Services HTML Report', path: path.join(config.coverageDir, 'html-report/services-test-report.html') },
    ];

    reports.forEach(report => {
      if (fs.existsSync(report.path)) {
        log(`✓ ${report.name}: ${report.path}`, colors.green);
      } else {
        log(`✗ ${report.name}: Not generated`, colors.yellow);
      }
    });

    // Display coverage summary if available
    const coverageSummaryPath = path.join(config.coverageDir, 'coverage-summary.json');
    if (fs.existsSync(coverageSummaryPath)) {
      try {
        const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
        if (coverageSummary.total) {
          logSubSection('Coverage Summary');
          const total = coverageSummary.total;
          log(`Lines: ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})`, 
              total.lines.pct >= 80 ? colors.green : colors.yellow);
          log(`Functions: ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})`, 
              total.functions.pct >= 80 ? colors.green : colors.yellow);
          log(`Branches: ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})`, 
              total.branches.pct >= 80 ? colors.green : colors.yellow);
          log(`Statements: ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})`, 
              total.statements.pct >= 80 ? colors.green : colors.yellow);
        }
      } catch (error) {
        log(`Warning: Could not parse coverage summary: ${error.message}`, colors.yellow);
      }
    }
  }

  // Test suite summary
  logSubSection('Test Suite Information');
  log(`Test Pattern: ${config.testPattern}`, colors.dim);
  log(`Configuration: ${config.jestConfig}`, colors.dim);
  log(`Coverage Directory: ${config.coverageDir}`, colors.dim);
  
  if (options.testNamePattern) {
    log(`Test Name Pattern: ${options.testNamePattern}`, colors.dim);
  }
  
  if (options.testPathPattern) {
    log(`Test Path Pattern: ${options.testPathPattern}`, colors.dim);
  }
};

// Display help
const showHelp = () => {
  logSection('Services Test Runner - Help');
  
  log('Usage: node scripts/test-services.js [options]', colors.bright);
  log('');
  log('Options:', colors.bright);
  log('  --watch, -w              Run tests in watch mode');
  log('  --no-coverage            Disable coverage reporting');
  log('  --verbose, -v            Enable verbose output');
  log('  --bail                   Stop on first test failure');
  log('  --silent                 Reduce output to errors only');
  log('  --update-snapshots, -u   Update test snapshots');
  log('  --testNamePattern=<pattern>   Run tests matching name pattern');
  log('  --testPathPattern=<pattern>   Run tests matching path pattern');
  log('  --help, -h               Show this help message');
  log('');
  log('Examples:', colors.bright);
  log('  node scripts/test-services.js                    # Run all tests with coverage');
  log('  node scripts/test-services.js --watch            # Run in watch mode');
  log('  node scripts/test-services.js --verbose          # Run with verbose output');
  log('  node scripts/test-services.js --testNamePattern="auth"    # Run only auth-related tests');
  log('  node scripts/test-services.js --testPathPattern="stripe"  # Run only Stripe tests');
  log('');
  log('Test Categories:', colors.bright);
  log('  - HTTP layer services (handleRequest, API utilities)');
  log('  - Core API services (auth, user, reservation, venue)');
  log('  - External service integrations (Stripe, Cloudinary, Resend)');
  log('  - Database services (Prisma repositories)');
  log('  - Service layer business logic and error handling');
};

// Main execution
const main = async () => {
  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  try {
    logSection('ReservApp Services Test Suite');
    log(`Node.js version: ${process.version}`, colors.dim);
    log(`Platform: ${process.platform}`, colors.dim);
    log(`Working directory: ${process.cwd()}`, colors.dim);

    await preTestSetup();
    
    const startTime = Date.now();
    let success = false;
    
    try {
      await runTests();
      success = true;
    } catch (error) {
      log(`\nTest execution failed: ${error.message}`, colors.red);
      success = false;
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    await postTestReporting(success);
    
    log(`\nTotal execution time: ${duration}s`, colors.dim);
    
    if (success) {
      logSection('🎉 Services tests completed successfully!');
      process.exit(0);
    } else {
      logSection('❌ Services tests failed!');
      process.exit(1);
    }
    
  } catch (error) {
    log(`\nFatal error: ${error.message}`, colors.red + colors.bright);
    log(error.stack, colors.red + colors.dim);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGINT', () => {
  log('\n\nReceived SIGINT, shutting down gracefully...', colors.yellow);
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n\nReceived SIGTERM, shutting down gracefully...', colors.yellow);
  process.exit(0);
});

// Run the main function
main().catch(error => {
  log(`Unhandled error: ${error.message}`, colors.red + colors.bright);
  process.exit(1);
});