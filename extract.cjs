const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join('findings', 'tool-output');
const OUTPUT_PRODUCTS = path.join('server', 'data', 'bravo_products.json');
const OUTPUT_ERRORS = path.join('server', 'data', 'extract_errors.json');

function extractProductsFromHtml(html) {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  let queryState = null;

  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content.includes('venue-assortment')) {
      // Try to find the JSON object by looking for the first '{' and the last '}'
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonCandidate = content.substring(firstBrace, lastBrace + 1);
        try {
          const parsed = JSON.parse(jsonCandidate);
          if (parsed.queries && parsed.queries.some(q => q.queryKey && q.queryKey[0] === 'venue-assortment')) {
            queryState = parsed;
            break;
          }
        } catch (e) {
          // Continue to next script tag
        }
      }
    }
  }

  if (!queryState) return { products: [] };

  const products = [];
  for (const q of queryState.queries) {
    const key = q.queryKey;
    if (!key || key[0] !== 'venue-assortment') continue;

    if (key[1] === 'category') {
      const slug = key[3];
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
    }
  }

  return { products };
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
