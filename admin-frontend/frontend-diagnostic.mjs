import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n🔍 FRONTEND DIAGNOSTIC REPORT\n');

// Check package.json
console.log('1️⃣ Checking package.json...');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('✅ package.json exists');
  console.log('   Name:', pkg.name);
  console.log('   Version:', pkg.version);
  console.log('   Type:', pkg.type);
  console.log('   Dependencies count:', Object.keys(pkg.dependencies).length);
} else {
  console.log('❌ package.json NOT found!');
}

// Check node_modules
console.log('\n2️⃣ Checking node_modules...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
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
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
  const files = fs.readdirSync(srcPath);
  console.log('✅ src directory exists with', files.length, 'items');
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
  'vite.config.js',
  'index.html'
];

keyFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log('   ✅', file);
  } else {
    console.log('   ❌', file, '(NOT FOUND!)');
  }
});

// Check vite.config.js port
console.log('\n5️⃣ Checking vite.config.js port...');
const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  if (viteConfig.includes('port: 5173')) {
    console.log('✅ vite.config.js has correct port (5173)');
  } else {
    console.log('⚠️ vite.config.js might have incorrect port');
  }
} else {
  console.log('❌ vite.config.js NOT found!');
}

console.log('\n✅ DIAGNOSTIC COMPLETE\n');
