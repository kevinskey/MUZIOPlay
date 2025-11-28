// patch-postcss.js
const fs = require('fs');
const path = require('path');

function patchPostcss(pkgPath) {
  if (!fs.existsSync(pkgPath)) {
    console.log(`[patch-postcss] ${pkgPath} not found, skipping`);
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (!pkg.exports) {
    pkg.exports = {};
  }

  if (!pkg.exports['./package.json']) {
    pkg.exports['./package.json'] = './package.json';
    console.log(
      `[patch-postcss] Added ./package.json to postcss exports in ${pkgPath}`
    );
  } else {
    console.log(
      `[patch-postcss] ./package.json already exported in ${pkgPath}, nothing to do`
    );
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('[patch-postcss] Done');
  return true;
}

// 1) Most likely location: css-loader's bundled postcss
const candidate1 = path.join(
  __dirname,
  'node_modules',
  'css-loader',
  'node_modules',
  'postcss',
  'package.json'
);

// 2) Fallback: top-level postcss
const candidate2 = path.join(
  __dirname,
  'node_modules',
  'postcss',
  'package.json'
);

if (!patchPostcss(candidate1)) {
  patchPostcss(candidate2);
}
