const fs = require('fs');

// HTML file paths
const htmlFiles = [
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f84388a49001g73dg8D2tbTAV5', // main venue
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843040ef001y9AGh09XmbcZRD', // Fresh Meat and Poultry
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f8431fa37001hES8aBOkS6g41B', // Dairy Products
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f8438c3310015L0nqwWdmmgFK5', // Non-alcoholic Beverages
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843db4a3001lv8Jhsj279pbYy'  // Grain Products and Cereals
];

function extractProductsFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Look for query-state JSON data
  const queryStateMatch = html.match(/<script[^>]*class="query-state"[^>]*>([\s\S]*?)<\/script>/);

  if (!queryStateMatch) {
    return { error: 'query-state not found', source: htmlPath };
  }

  try {
    const queryState = JSON.parse(queryStateMatch[1]);

    // Find venue-assortment data
    let venueAssortment = null;

    for (const query of queryState.queries || []) {
      const key = query.queryKey?.[0];
      if (key === 'venue-assortment') {
        venueAssortment = query.state?.data?.venueAssortment?.data;
        break;
      }
    }

    if (!venueAssortment) {
      return { error: 'venueAssortment not found', source: htmlPath };
    }

    // Extract products from venue assortment
    const products = [];

    if (venueAssortment.items) {
      venueAssortment.items.forEach(item => {
        if (item.venueItems) {
          item.venueItems.forEach(venueItem => {
            products.push({
              id: venueItem.id,
              name: venueItem.name,
              price: venueItem.price,
              original_price: venueItem.original_price,
              unit_info: venueItem.unit_info,
              unit_price: venueItem.unit_price,
              description: venueItem.description,
              images: venueItem.images,
              available_times: venueItem.available_times,
              allowed_delivery_methods: venueItem.allowed_delivery_methods,
              product_hierarchy_level_id: venueItem.product_hierarchy_level_id,
              barcode_gtin: venueItem.barcode_gtin,
              dietary_preferences: venueItem.dietary_preferences,
              tags: venueItem.tags,
              category: item.categorySlug || 'uncategorized'
            });
          });
        }
      });
    }

    return {
      products,
      venueAssortment,
      source: htmlPath
    };
  } catch (e) {
    return { error: e.message, source: htmlPath };
  }
}

// Extract from all HTML files
const allProducts = [];
const results = [];

htmlFiles.forEach(htmlPath => {
  const result = extractProductsFromHtml(htmlPath);
  results.push(result);

  if (result.products && result.products.length > 0) {
    result.products.forEach(product => {
      allProducts.push(product);
    });
  }
});

// Create a structured JSON file with all products
const outputData = {
  extractedAt: new Date().toISOString(),
  totalProducts: allProducts.length,
  products: allProducts,
  sources: results
};

fs.writeFileSync(
  'server/data/bravo_products.json',
  JSON.stringify(outputData, null, 2),
  'utf-8'
);

console.log(`✓ Extracted ${allProducts.length} products from ${htmlFiles.length} HTML files`);
console.log(`✓ Saved to server/data/bravo_products.json`);

// Print summary
console.log('\nProduct Summary:');
const categories = {};
allProducts.forEach(product => {
  const category = product.category || 'uncategorized';
  categories[category] = (categories[category] || 0) + 1;
});

Object.entries(categories).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});