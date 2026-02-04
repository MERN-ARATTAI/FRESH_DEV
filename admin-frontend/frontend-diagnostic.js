#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

console.log('\n🔍 FRONTEND DIAGNOSTIC REPORT\n');

const adminPath = path.join(__dirname, 'admin backend');

// Check package.json
console.log('1️⃣ Checking package.json...');
const packagePath = path.join(adminPath, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('✅ package.json exists');
  console.log('   Name:', pkg.name);
  console.log('   Version:', pkg.version);
  console.log('   Dependencies:', Object.keys(pkg.dependencies).join(', '));
} else {
  console.log('❌ package.json NOT found!');
}

// Check node_modules
console.log('\n2️⃣ Checking node_modules...');
const nodeModulesPath = path.join(adminPath, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const packages = fs.readdirSync(nodeModulesPath)
    .filter(f => !f.startsWith('.'))
    .length;
  console.log('✅ node_modules exists with', packages, 'packages');
  
  const requiredPackages = ['react', 'react-dom', 'react-router-dom', 'axios', 'vite'];
  requiredPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log('   ✅', pkg);
    } else {
      console.log('   ❌', pkg, '(MISSING!)');
    }
  });
} else {
  console.log('❌ node_modules NOT found! Run: npm install');
}

// Check src directory
console.log('\n3️⃣ Checking src directory...');
const srcPath = path.join(adminPath, 'src');
if (fs.existsSync(srcPath)) {
  const files = fs.readdirSync(srcPath);
  console.log('✅ src directory exists with files:', files.join(', '));
} else {
  console.log('❌ src directory NOT found!');
}

// Check key files
console.log('\n4️⃣ Checking key files...');
const keyFiles = [
  'src/main.jsx',
  'src/App.jsx',
  'src/index.css',
  'src/context/AuthContext.jsx',
  'src/services/api.js',
  'src/pages/Login.jsx',
  'src/pages/Dashboard.jsx',
  'vite.config.js',
  'package.json',
  'index.html'
];

keyFiles.forEach(file => {
  const filePath = path.join(adminPath, file);
  if (fs.existsSync(filePath)) {
    console.log('   ✅', file);
  } else {
    console.log('   ❌', file, '(NOT FOUND!)');
  }
});

// Check pages directory
console.log('\n5️⃣ Checking pages directory...');
const pagesPath = path.join(adminPath, 'src/pages');
if (fs.existsSync(pagesPath)) {
  const pages = fs.readdirSync(pagesPath).filter(f => f.endsWith('.jsx'));
  console.log('✅ Pages found:', pages.join(', '));
} else {
  console.log('❌ Pages directory NOT found!');
}

// Check components directory
console.log('\n6️⃣ Checking components directory...');
const componentsPath = path.join(adminPath, 'src/components');
if (fs.existsSync(componentsPath)) {
  const components = fs.readdirSync(componentsPath).filter(f => f.endsWith('.jsx'));
  console.log('✅ Components found:', components.join(', '));
} else {
  console.log('❌ Components directory NOT found!');
}

// Check if vite.config.js is correct
console.log('\n7️⃣ Checking vite.config.js...');
const viteConfigPath = path.join(adminPath, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  if (viteConfig.includes('port: 5173')) {
    console.log('✅ vite.config.js has correct port (5173)');
  } else {
    console.log('⚠️ vite.config.js port might be incorrect');
  }
} else {
  console.log('❌ vite.config.js NOT found!');
}

console.log('\n✅ DIAGNOSTIC COMPLETE\n');
