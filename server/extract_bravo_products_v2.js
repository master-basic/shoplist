const fs = require('fs');
const path = require('path');

// Main HTML file path
const mainHtmlPath = 'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f84388a49001g73dg8D2tbTAV5';
// Category HTML file paths
const categoryHtmlPaths = [
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843040ef001y9AGh09XmbcZRD',
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f8431fa37001hES8aBOkS6g41B',
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f8438c3310015L0nqwWdmmgFK5',
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843db4a3001lv8Jhsj279pbYy'
];

function extractProductsFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Look for query-state JSON data which typically contains venue and product info
  const queryStateMatch = html.match(/<script[^>]*class="query-state"[^>]*>([\s\S]*?)<\/script>/);
  if (queryStateMatch) {
    try {
      const queryState = JSON.parse(queryStateMatch[1]);
      return { queryState, source: htmlPath };
    } catch (e) {
      console.log(`Failed to parse query-state from ${htmlPath}`);
    }
  }

  // Look for JSON data in script tags
  const scriptMatches = html.matchAll(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g);
  for (const match of scriptMatches) {
    try {
      const jsonData = JSON.parse(match[1]);
      if (jsonData && (jsonData.venue || jsonData.venues || jsonData.products || jsonData.items)) {
        return { data: jsonData, source: htmlPath };
      }
    } catch (e) {
      continue;
    }
  }

  // Look for product data in the HTML body
  const productPattern = /"name":"([^"]+)".*"price":(\d+).*"unit":"([^"]+)"/g;
  const products = [];
  const match = productPattern.exec(html);
  if (match) {
    products.push({
      name: match[1],
      price: match[2],
      unit: match[3]
    });
  }

  return { products, source: htmlPath, note: 'Basic pattern match found' };
}

// Extract from main venue page
console.log('Extracting from main venue page...');
const mainResult = extractProductsFromHtml(mainHtmlPath);
console.log(JSON.stringify(mainResult, null, 2));

// Extract from category pages
console.log('\nExtracting from category pages...');
categoryHtmlPaths.forEach(path => {
  const result = extractProductsFromHtml(path);
  console.log(`\n${path}:`);
  console.log(JSON.stringify(result, null, 2));
});