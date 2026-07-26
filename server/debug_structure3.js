const fs = require('fs');
const data = JSON.parse(fs.readFileSync('server/data/query_state_debug.json', 'utf8'));

// Let's count all venue-assortment queries
let vaCount = 0;
data.queries.forEach((q, i) => {
  const key = q.queryKey;
  if (key && key[0] === 'venue-assortment') {
    vaCount++;
    console.log(`Query ${i}: [${key.slice(0, 3).join(', ')}...] type=${key[1]}`);
  }
});
console.log(`\nTotal venue-assortment queries: ${vaCount}`);

// Look at Query 5 (category-listing) categories - check which have item_ids
console.log('\n=== Query 5: Categories with item_ids ===');
const q5 = data.queries.find(q => q.queryKey?.[0] === 'venue-assortment' && q.queryKey?.[1] === 'category-listing');
if (q5) {
  const cats = q5.state.data.categories;
  let totalItems = 0;
  cats.forEach(c => {
    const directCount = (c.item_ids || []).length;
    let subCount = 0;
    (c.subcategories || []).forEach(sc => {
      subCount += (sc.item_ids || []).length;
    });
    if (directCount > 0 || subCount > 0) {
      console.log(`  ${c.name}: direct=${directCount}, subcategories=${subCount}`);
    }
    totalItems += directCount + subCount;
  });
  console.log(`Total item_ids across all categories: ${totalItems}`);
}

// Look at Query 6 sections - count total items
console.log('\n=== Query 6: Section items ===');
const q6 = data.queries.find(q => q.queryKey?.[0] === 'venue-assortment' && q.queryKey?.[1] === 'venue-content');
if (q6) {
  let totalSectionItems = 0;
  q6.state.data.pages[0].sections.forEach((s, i) => {
    if (s.items) {
      console.log(`  Section ${i} (${s.name || s.section_type}): ${s.items.length} items`);
      totalSectionItems += s.items.length;
    }
  });
  console.log(`Total items in sections: ${totalSectionItems}`);
}

// Now - what about the venue-assortment category queries?
// Only 1 exists. But maybe there are items embedded in other structures.
// Let's look for any items arrays with product-like objects
console.log('\n=== All queries with items arrays containing products ===');
data.queries.forEach((q, i) => {
  const key = q.queryKey;
  if (!key) return;
  
  function findItems(obj, depth = 0) {
    if (!obj || typeof obj !== 'object' || depth > 10) return 0;
    let count = 0;
    if (Array.isArray(obj)) {
      // Check if this is an items array with product-like objects
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null && obj[0].name && obj[0].price !== undefined) {
        return obj.length;
      }
      for (const item of obj) {
        count += findItems(item, depth + 1);
      }
    } else {
      for (const val of Object.values(obj)) {
        count += findItems(val, depth + 1);
      }
    }
    return count;
  }
  
  const count = findItems(q.state?.data);
  if (count > 0) {
    console.log(`Query ${i} [${key[0]}, ${key[1] || ''}]: ${count} product-like items`);
  }
});
