#!/usr/bin/env node

/**
 * Automated Build Recovery Script
 * Run with: node rebuild.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = __dirname;

console.log('\n🚀 Starting Next.js Build Recovery...\n');

try {
  // Step 1: Remove .next cache
  console.log('📦 Step 1: Removing stale build cache (.next)...');
  const nextDir = path.join(projectDir, '.next');
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ .next directory removed\n');
  } else {
    console.log('ℹ️  .next directory not found (already clean)\n');
  }

  // Step 2: Generate Prisma types
  console.log('🔧 Step 2: Generating Prisma client types...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit', cwd: projectDir });
    console.log('✅ Prisma types generated\n');
  } catch (e) {
    console.warn('⚠️  Prisma generate had issues (may be OK)\n');
  }

  // Step 3: Build Next.js
  console.log('🏗️  Step 3: Building Next.js project...');
  console.log('(This may take 1-2 minutes)\n');
  execSync('npm run build', { stdio: 'inherit', cwd: projectDir });
  console.log('\n✅ Build completed successfully!\n');

  // Step 4: Provide next steps
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ BUILD RECOVERY COMPLETE\n');
  console.log('Next steps:\n');
  console.log('1️⃣  Start the dev server:');
  console.log('   npm run dev\n');
  console.log('2️⃣  Open browser:');
  console.log('   http://localhost:3000\n');
  console.log('3️⃣  When ready, apply database migration:');
  console.log('   npx prisma migrate deploy\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

} catch (error) {
  console.error('\n❌ Build recovery failed!\n');
  console.error('Error:', error.message);
  console.error('\nTroubleshooting:\n');
  console.error('1. Check Node.js version: node --version');
  console.error('2. Check npm version: npm --version');
  console.error('3. Reinstall dependencies: npm install');
  console.error('4. Check .env file exists');
  console.error('\nFor more help, see: BUILD_RECOVERY.md\n');
  process.exit(1);
}
