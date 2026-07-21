const fs = require('fs');

// HTML file paths
const htmlFiles = [
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843db4a3001lv8Jhsj279pbYy'  // Grain Products and Cereals
];

function debugQueryState(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Look for query-state JSON data
  const queryStateMatch = html.match(/<script[^>]*class="query-state"[^>]*>([\s\S]*?)<\/script>/);

  if (!queryStateMatch) {
    console.log('No query-state found');
    return;
  }

  try {
    const queryState = JSON.parse(queryStateMatch[1]);

    // Save the raw query-state to a file
    fs.writeFileSync(
      'server/data/query_state_debug.json',
      JSON.stringify(queryState, null, 2),
      'utf-8'
    );

    console.log('✓ Saved query-state to server/data/query_state_debug.json');

    // Print structure
    console.log('\nQuery state structure:');
    console.log('  mutations:', queryState.mutations?.length || 0);
    console.log('  queries:', queryState.queries?.length || 0);

    // Find venue-assortment
    let venueAssortment = null;
    for (const query of queryState.queries || []) {
      const key = query.queryKey?.[0];
      console.log(`  Query key: ${key}`);
      if (key === 'venue-assortment') {
        venueAssortment = query.state?.data?.venueAssortment?.data;
        console.log('  ✓ Found venue-assortment!');
        break;
      }
    }

    if (venueAssortment) {
      console.log('  Venue assortment has items:', venueAssortment.items?.length || 0);
      console.log('  Venue assortment has venueItems:', venueAssortment.venueItems?.length || 0);

      // Save venue assortment
      fs.writeFileSync(
        'server/data/venue_assortment_debug.json',
        JSON.stringify(venueAssortment, null, 2),
        'utf-8'
      );
      console.log('✓ Saved venue-assortment to server/data/venue_assortment_debug.json');
    }
  } catch (e) {
    console.log('Error parsing query-state:', e.message);
  }
}

debugQueryState(htmlFiles[0]);