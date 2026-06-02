// =====================================================
// GroceryMind - Store Utilities
// =====================================================

export const STORES = [
  'Bravo',
  'Carrefour',
  'Hypernova',
  'Lidl',
  'A101',
  'Ost',
  'Gümüşpala',
  'Şok',
  'Almaza',
  '1920',
  'Berk',
  'Akmerkez',
  'Migros',
  'Metro',
  'BİM',
  'Şehirkul',
  'Nur',
  'Other',
] as const;

export type Store = typeof STORES[number];

export const normalizeStoreName = (store: string): Store => {
  const normalized = store.toLowerCase().trim();
  
  const storeMap: {[key: string]: Store} = {
    'bravo': 'Bravo',
    'carrefour': 'Carrefour',
    'hypernova': 'Hypernova',
    'lidl': 'Lidl',
    'a101': 'A101',
    'ost': 'Ost',
    'gümüşpala': 'Gümüşpala',
    'şok': 'Şok',
    'almaza': 'Almaza',
    '1920': '1920',
    'berk': 'Berk',
    'akmerkez': 'Akmerkez',
    'migros': 'Migros',
    'metro': 'Metro',
    'bim': 'BİM',
    'sehirkul': 'Şehirkul',
    'nur': 'Nur',
    'other': 'Other',
  };
  
  return storeMap[normalized] || 'Other';
};

export const getStoreLogoUrl = (store: string): string => {
  // Would typically return logo URLs from a CDN
  return `/stores/${store.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
};

export const getStoreColors = (store: string): {primary: string; secondary: string} => {
  const storeColors: {[key: string]: {primary: string; secondary: string}} = {
    'Bravo': { primary: '#15803d', secondary: '#dcfce7' },
    'Carrefour': { primary: '#2563eb', secondary: '#dbeafe' },
    'Hypernova': { primary: '#dc2626', secondary: '#fee2e2' },
    'Lidl': { primary: '#fbbf24', secondary: '#fef3c7' },
    'A101': { primary: '#059669', secondary: '#d1fae5' },
    'Ost': { primary: '#7c3aed', secondary: '#ede9fe' },
    'Gümüşpala': { primary: '#db2777', secondary: '#fce7f3' },
    'Şok': { primary: '#ea580c', secondary: '#ffedd5' },
    'Almaza': { primary: '#0891b2', secondary: '#cffafe' },
    '1920': { primary: '#475569', secondary: '#f1f5f9' },
    'Berk': { primary: '#be185d', secondary: '#fce7f3' },
    'Akmerkez': { primary: '#1e40af', secondary: '#dbeafe' },
    'Migros': { primary: '#b91c1c', secondary: '#fee2e2' },
    'Metro': { primary: '#0f172a', secondary: '#f8fafc' },
    'BİM': { primary: '#16a34a', secondary: '#dcfce7' },
    'Şehirkul': { primary: '#ea580c', secondary: '#ffedd5' },
    'Nur': { primary: '#7c3aed', secondary: '#ede9fe' },
    'Other': { primary: '#64748b', secondary: '#f1f5f9' },
  };
  
  return storeColors[store] || { primary: '#64748b', secondary: '#f1f5f9' };
};