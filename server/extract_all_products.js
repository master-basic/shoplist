const fs = require('fs');
const path = require('path');

const queryStatePath = path.join(__dirname, 'data', 'query_state_debug.json');
const outputPath = path.join(__dirname, 'data', 'all_bravo_products.json');

function extractProducts() {
  const raw = fs.readFileSync(queryStatePath, 'utf-8');
  const data = JSON.parse(raw);
  
  const venueQueries = data.queries.filter(q => q.queryKey?.[0] === 'venue-assortment');
  const venueData = venueQueries.find(q => q.state?.data?.pages);
  
  if (!venueData) {
    console.log('No venue-assortment with pages found');
    return { extractedAt: new Date().toISOString(), totalProducts: 0, categories: [] };
  }
  
  const pages = venueData.state.data.pages;
  const categories = [];
  const allProducts = [];
  
  for (const page of pages) {
    const sections = page.sections || [];
    for (const section of sections) {
      const categoryName = section.name || section.slug || 'Unknown';
      const categorySlug = section.slug || '';
      
      const products = (section.items || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price / 100,
        original_price: item.original_price ? item.original_price / 100 : null,
        unit_info: item.unit_info || '',
        unit_price: item.unit_price,
        description: item.description || '',
        barcode_gtin: item.barcode_gtin,
        category: categoryName,
        category_slug: categorySlug,
        images: item.images || [],
        dietary_preferences: item.dietary_preferences || [],
        tags: item.tags || [],
        vat_percentage: item.vat_percentage,
        store: 'Bravo'
      }));
      
      if (products.length > 0) {
        categories.push({
          name: categoryName,
          slug: categorySlug,
          product_count: products.length
        });
        allProducts.push(...products);
      }
    }
  }
  
  const result = {
    extractedAt: new Date().toISOString(),
    totalProducts: allProducts.length,
    store: 'Bravo',
    categories,
    products: allProducts
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Extracted ${allProducts.length} products from ${categories.length} categories`);
  console.log(`Saved to ${outputPath}`);
  
  // Summary by category
  const catMap = {};
  for (const p of allProducts) {
    catMap[p.category] = (catMap[p.category] || 0) + 1;
  }
  console.log('\nProducts by category:');
  Object.entries(catMap).forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
  
  return result;
}

extractProducts();