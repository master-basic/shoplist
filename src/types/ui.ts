export const normalizeItemName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const fuzzyMatch = (str1: string, str2: string, threshold = 0.5): number => {
  if (!str1 || !str2) return 0;
  const s1 = normalizeItemName(str1);
  const s2 = normalizeItemName(str2);
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  const chars1 = new Set(s1.split(' '));
  const chars2 = new Set(s2.split(' '));
  const overlap = [...chars1].filter(c => chars2.has(c)).length;
  const total = new Set([...chars1, ...chars2]).size;
  return total > 0 ? overlap / total : 0;
};

export const normalizeStoreName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
};

export const STORES = [
  'Bravo', 'Araz', 'OBA', 'Al-market'
];

export const CATEGORIES = [
  'produce',
  'dairy',
  'meat',
  'bakery',
  'frozen',
  'household',
  'pantry',
  'beverages',
  'snacks',
  'personal_care',
  'other',
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_GROUPS: Record<Category, string> = {
  produce: 'Produce',
  dairy: 'Dairy & Eggs',
  meat: 'Meat & Seafood',
  bakery: 'Bakery',
  frozen: 'Frozen Foods',
  household: 'Household Supplies',
  pantry: 'Pantry',
  beverages: 'Beverages',
  snacks: 'Snacks',
  personal_care: 'Personal Care',
  other: 'Other',
};

export const UNITS = [
  'pcs',
  'kg',
  'g',
  'l',
  'ml',
  'oz',
  'lb',
  'dozen',
  'pack',
  'can',
  'bottle',
  'box',
] as const;

export type Unit = typeof UNITS[number];
