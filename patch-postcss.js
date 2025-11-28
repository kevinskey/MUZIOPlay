// patch-postcss.js
const fs = require('fs');
const path = require('path');

const postcssPkgPath = path.join(
  __dirname,
  'node_modules',
  'css-loader',
  'node_modules',
  'postcss',
  'package.json'
);

if (!fs.existsSync(postcssPkgPath)) {
  console.log('[patch-postcss] postcss package.json not found, skipping');
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(postcssPkgPath, 'utf8'));

if (!pkg.exports) {
  pkg.exports = {};
}

// Make sure ./package.json is exported
if (!pkg.exports['./package.json']) {
  pkg.exports['./package.json'] = './package.json';
  console.log('[patch-postcss] Added ./package.json to postcss exports');
} else {
  console.log('[patch-postcss] ./package.json already exported, nothing to do');
}

fs.writeFileSync(postcssPkgPath, JSON.stringify(pkg, null, 2));
console.log('[patch-postcss] Done');
