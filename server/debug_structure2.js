const fs = require('fs');
const data = JSON.parse(fs.readFileSync('server/data/query_state_debug.json', 'utf8'));

// Explore query 6 (venue-content)
data.queries.forEach((q, i) => {
  const key = q.queryKey;
  if (key && key[0] === 'venue-assortment' && key[1] === 'venue-content') {
    console.log(`\n=== Query ${i}: venue-content ===`);
    const pages = q.state.data.pages;
    const page = pages[0];
    console.log('sections count:', page.sections.length);
    page.sections.forEach((s, si) => {
      console.log(`\n  Section ${si}:`, s.section_type, '-', s.name);
      if (s.categories) {
        console.log(`    categories: ${s.categories.length}`);
        s.categories.forEach((c, ci) => {
          if (ci < 3) {
            console.log(`      [${ci}] id: ${c.id}, name: ${c.name || 'N/A'}, item_ids: ${(c.item_ids || []).length}`);
          }
        });
        if (s.categories.length > 3) console.log(`      ... and ${s.categories.length - 3} more`);
      }
      if (s.items) {
        console.log(`    items: ${Array.isArray(s.items) ? s.items.length : typeof s.items}`);
        if (Array.isArray(s.items) && s.items.length > 0) {
          console.log(`    items[0].name: ${s.items[0].name}, price: ${s.items[0].price}`);
        }
      }
    });
  }
});

// Also check query 7 for total items count
let totalItemsQ7 = 0;
data.queries.forEach((q, i) => {
  const key = q.queryKey;
  if (key && key[0] === 'venue-assortment' && key[1] === 'category') {
    const pages = q.state.data.pages;
    const items = pages[0].items || [];
    const catName = pages[0].category?.name || 'unknown';
    console.log(`\nQuery 7 subtype (${i}): ${catName} - ${items.length} items`);
    totalItemsQ7 += items.length;
  }
});
console.log(`\nTotal items from all venue-assortment category queries: ${totalItemsQ7}`);
