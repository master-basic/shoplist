const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join('findings', 'tools-output');
const OUTPUT_PRODUCTS = path.join('server', 'data', 'bravo_products.json');
const OUTPUT_ERRORS = path.join('server', 'data', 'extract_errors.json');

function extractProductsFromHtml(html) {
  const candidates = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => m[1].trim())
    .filter(s => s.startsWith('{') && s.includes('"queries"'));

  let queryState = null;
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed.queries && parsed.queries.some(q => q.queryKey && q.queryKey[0] === 'venue-assortment')) {
        queryState = parsed;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!queryState) return { products: [], categories: [] };

  const products = [];
  const categories = [];

  for (const q of queryState.queries) {
    const key = q.queryKey;
    if (!key || key[0] !== 'venue-assortment') continue;

    if (key[1] === 'category') {
      const slug = key[3];
      // Iterate pages (though instructions imply items are in pages[N].items)
      // We'll check all pages to be safe.
      if (q.state && q.state.data && q.state.data.pages) {
        for (const page of q.state.data.pages) {
          if (page.items && Array.isArray(page.items)) {
            for (const item of page.items) {
              products.push({
                id: item.id,
                name: item.name,
                price_azn: item.price / 100,
                original_price_azn: item.original_price ? item.original_price / 100 : null,
                unit_info: item.unit_info,
                barcode: item.barcode_gtin,
                category_slug: slug,
                image: item.images && item.images[0] ? item.images[0].url : null
              });
            }
          }
        }
      }
    } else if (key[1] === 'category-listing') {
      if (q.state && q.state.data && q.state.data.categories) {
        categories.push(...q.state.data.categories);
      }
    }
  }

  return { products, categories };
}

function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error('Input directory not found');
    return;
  }

  const files = fs.readdirSync(INPUT_DIR);
  const allProducts = [];
  const errors = [];

  files.forEach(file => {
    const filePath = path.join(INPUT_DIR, file);
    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const { products } = extractProductsFromHtml(html);
      
      // To find the slug for logging, we check if any product was found
      const slug = products.length > 0 ? products[0].category_slug : 'N/A';
      console.log(`${file}, ${slug}, ${products.length}`);
      
      allProducts.push(...products);
    } catch (err) {
      errors.push({ file, error: err.message });
      console.log(`${file}, error, 0, ${err.message}`);
    }
  });

  if (!fs.existsSync(path.dirname(OUTPUT_PRODUCTS))) {
    fs.mkdirSync(path.dirname(OUTPUT_PRODUCTS), { recursive: true });
  }

  const result = {
    extractedAt: new Date().toISOString(),
    totalProducts: allProducts.length,
    products: allProducts
  };

  fs.writeFileSync(OUTPUT_PRODUCTS, JSON.stringify(result, null, 2));
  fs.writeFileSync(OUTPUT_ERRORS, JSON.stringify(errors, null, 2));

  console.log(`Final total: ${allProducts.length}`);
}

main();
