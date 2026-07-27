const fs = require('fs');
const path = require('path');

// Simple SVG icon as base64 for generating PNG icons
// We'll use a minimal approach: create SVG files and note they should be converted to PNG
const icons = [72, 96, 128, 144, 152, 192, 256, 512];

icons.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#22c55e" rx="${size/4}"/>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size/2.2}" fill="white" text-anchor="middle" dominant-baseline="middle">GM</text>
  </svg>`;
  
  const svgPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svg);
});

// Also create a robots.txt
const robots = `User-agent: *
Allow: /
Sitemap: https://grocerymind.app/sitemap.xml
`;
fs.writeFileSync(path.join(__dirname, '..', 'public', 'robots.txt'), robots);

// And a favicon
const favicon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#22c55e" rx="2"/><text x="50%" y="60%" font-family="Arial" font-size="10" fill="white" text-anchor="middle">GM</text></svg>';
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), favicon);

console.log('Generated icon files for all sizes');
