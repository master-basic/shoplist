const fs = require('fs');
const data = JSON.parse(fs.readFileSync('server/data/query_state_debug.json', 'utf8'));

data.queries.forEach((q, i) => {
  const key = q.queryKey;
  if (key && key[0] === 'venue-assortment') {
    console.log(`\n=== Query ${i} ===`);
    console.log('queryKey:', JSON.stringify(key));
    const sd = q.state.data;
    if (sd) {
      if (Array.isArray(sd)) {
        console.log('state.data is ARRAY of length', sd.length);
      } else if (sd.pages) {
        console.log('state.data has pages:', sd.pages.length);
        const page = sd.pages[0];
        if (page) {
          console.log('  page keys:', Object.keys(page));
          if (page.categories) {
            console.log('  page.categories length:', page.categories.length);
            if (page.categories.length > 0) {
              console.log('  page.categories[0] keys:', Object.keys(page.categories[0]));
              console.log('  page.categories[0].id:', page.categories[0].id);
              console.log('  page.categories[0].name:', page.categories[0].name);
            }
          }
          if (page.items) {
            console.log('  page.items length:', Array.isArray(page.items) ? page.items.length : typeof page.items);
            if (Array.isArray(page.items) && page.items.length > 0) {
              console.log('  page.items[0] keys:', Object.keys(page.items[0]));
              console.log('  page.items[0].name:', page.items[0].name);
              console.log('  page.items[0].price:', page.items[0].price);
            }
          }
          if (page.sections) {
            console.log('  page.sections length:', page.sections.length);
            if (page.sections.length > 0) {
              console.log('  page.sections[0] keys:', Object.keys(page.sections[0]));
            }
          }
        }
      } else {
        console.log('state.data keys:', Object.keys(sd));
        if (sd.categories) {
          console.log('  categories length:', sd.categories.length);
          if (sd.categories.length > 0) {
            console.log('  categories[0] keys:', Object.keys(sd.categories[0]));
            console.log('  categories[0].id:', sd.categories[0].id);
            console.log('  categories[0].name:', sd.categories[0].name);
          }
        }
        if (sd.items) {
          console.log('  items type:', typeof sd.items, Array.isArray(sd.items) ? 'array' : 'object');
          if (Array.isArray(sd.items)) {
            console.log('  items length:', sd.items.length);
          } else {
            console.log('  items keys:', Object.keys(sd.items).slice(0, 5));
            const firstKey = Object.keys(sd.items)[0];
            if (firstKey) {
              console.log('  items[firstKey] length:', sd.items[firstKey].length);
              console.log('  items[firstKey][0] keys:', Object.keys(sd.items[firstKey][0]));
              console.log('  items[firstKey][0].name:', sd.items[firstKey][0].name);
            }
          }
        }
      }
    }
  }
});
