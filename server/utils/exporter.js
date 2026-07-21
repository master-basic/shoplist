function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows, columns) {
  const header = columns.map(c => escapeCsv(c.label)).join(',');
  const body = rows.map(row =>
    columns.map(c => escapeCsv(row[c.key])).join(',')
  ).join('\n');
  return header + '\n' + body;
}

async function exportListAsCsv(listId, pool) {
  const listResult = await pool.query('SELECT id, name, created_at FROM grocery_lists WHERE id = $1', [listId]);
  if (listResult.rows.length === 0) return null;
  const list = listResult.rows[0];

  const itemsResult = await pool.query(
    `SELECT name, quantity, unit, unit_price, category, is_checked, is_recurring, notes
     FROM list_items WHERE list_id = $1 ORDER BY sort_order, name`,
    [listId]
  );

  const columns = [
    { key: 'name', label: 'Item Name' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unit', label: 'Unit' },
    { key: 'unit_price', label: 'Unit Price' },
    { key: 'category', label: 'Category' },
    { key: 'is_checked', label: 'Checked' },
    { key: 'is_recurring', label: 'Recurring' },
    { key: 'notes', label: 'Notes' },
  ];

  const rows = itemsResult.rows.map(r => ({
    ...r,
    is_checked: r.is_checked ? 'Yes' : 'No',
    is_recurring: r.is_recurring ? 'Yes' : 'No',
    unit_price: r.unit_price ? parseFloat(r.unit_price).toFixed(2) : '',
  }));

  const csv = toCsv(rows, columns);
  return { csv, filename: `list-${list.name.replace(/[^a-z0-9]/gi, '_')}-${list.created_at.toISOString().split('T')[0]}.csv` };
}

async function exportPriceHistoryAsCsv(householdId, pool) {
  let query = `SELECT ph.item_name, ph.store_name, ph.unit_price, ph.quantity, ph.purchased_at
               FROM price_history ph`;
  const params = [];
  if (householdId) {
    query += ` JOIN receipts r ON ph.session_id = r.id WHERE r.household_id = $1`;
    params.push(householdId);
  }
  query += ' ORDER BY ph.purchased_at DESC';

  const result = await pool.query(query, params);
  const columns = [
    { key: 'item_name', label: 'Item Name' },
    { key: 'store_name', label: 'Store' },
    { key: 'unit_price', label: 'Price' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'purchased_at', label: 'Date' },
  ];
  const rows = result.rows.map(r => ({
    ...r,
    unit_price: parseFloat(r.unit_price).toFixed(2),
    purchased_at: r.purchased_at ? new Date(r.purchased_at).toISOString().split('T')[0] : '',
  }));
  const csv = toCsv(rows, columns);
  return { csv, filename: `price-history-${new Date().toISOString().split('T')[0]}.csv` };
}

module.exports = { exportListAsCsv, exportPriceHistoryAsCsv };
