// =====================================================
// GroceryMind - Price Normalization Utilities
// =====================================================

import { formatCurrency } from './dateUtils';

/**
 * Normalizes item names for consistent price tracking
 * Strips brand names, standardizes units, removes extra formatting
 */

// Common brand patterns to strip (can be expanded)
const BRAND_PATTERNS = [
  /\b(heinz|ketchup| Heinz)/gi,
  /\b(mars|snickers|mars bar)/gi,
  /\b(coca-cola|pepsi|sprite|coke)/gi,
  /\b(nestle|nestle's)/gi,
  /\b(unilever|unilever ltd)/gi,
  /\b(p&g|pampers)/gi,
  /\b(golden|golden brand)/gi,
  /\b(südü|azərbaycan südü)/i,
  /\b(danone|yogurt|yogurt dano)/gi,
  /\b(fauna|fauna butter)/gi,
  /\b(şimal|şimal butter)/gi,
  /\b(garanti|garanti brand)/gi,
  /\b(bravo|bravo market)/gi,
  /\b(carrefour|carrefour market)/gi,
  /\b(hypernova|hypernova market)/gi,
  /\b(lidl|lidl market)/gi,
  /\b(a101|a101 market)/gi,
  /\b(ost|ost market)/gi,
  /\b(gümüşpala|gümüşpala market)/gi,
  /\b(şok|şok market)/gi,
  /\b(almaza|almaza market)/gi,
  /\b(1920|1920 market)/gi,
  /\b(berk|berk market)/gi,
  /\b(akmerkez|akmerkez market)/gi,
];

// Unit standardization map
const UNIT_STANDARDIZATION: {[key: string]: string} = {
  'kg': 'kg',
  'kilogram': 'kg',
  'kilograms': 'kg',
  'ltr': 'l',
  'litre': 'l',
  'litres': 'l',
  'liter': 'l',
  'milliliter': 'ml',
  'milliliters': 'ml',
  'g': 'g',
  'gram': 'g',
  'grams': 'g',
  'pcs': 'pcs',
  'piece': 'pcs',
  'pieces': 'pcs',
  'pack': 'pack',
  'packs': 'pack',
  'can': 'can',
  'cans': 'can',
  'bottle': 'bottle',
  'bottles': 'bottle',
  'box': 'box',
  'boxes': 'box',
  'dozen': 'dozen',
  'dozens': 'dozen',
};

/**
 * Normalize a string to a standard format
 */
export const normalizeString = (str: string): string => {
  if (!str) return '';
  
  // Convert to lowercase
  let result = str.toLowerCase().trim();
  
  // Remove special characters and extra spaces
  result = result.replace(/[^a-z0-9\s]/gi, '');
  result = result.replace(/\s+/g, ' ').trim();
  
  return result;
};

/**
 * Extract quantity and unit from a string
 * e.g., "1.5 kg" -> { quantity: 1.5, unit: 'kg' }
 */
export const extractQuantityAndUnit = (str: string): {quantity?: number; unit?: string; text?: string} => {
  if (!str) return {};
  
  // Pattern to match numbers with optional decimals and units
  const match = str.match(/^([\d.,]+)\s*(.*)$/);
  
  if (match) {
    const quantityStr = match[1].replace(',', '.');
    const unitStr = match[2].trim();
    
    return {
      quantity: parseFloat(quantityStr),
      unit: unitStr.toLowerCase(),
      text: str,
    };
  }
  
  return { text: str };
};

/**
 * Normalize item name for price tracking
 */
export const normalizeItemName = (itemName: string): string => {
  if (!itemName) return '';
  
  let normalized = normalizeString(itemName);
  
  // Remove brand patterns
  BRAND_PATTERNS.forEach(pattern => {
    normalized = normalized.replace(pattern, '');
  });
  
  // Remove "for", "per", "each" etc.
  normalized = normalized.replace(/\b(for|per|each)\b/g, '');
  
  // Remove currency symbols
  normalized = normalized.replace(/[$€₼\£]/g, '');
  
  // Remove common suffixes
  normalized = normalized.replace(/\b(discount|sale|special|promo|offer)\b/gi, '');
  
  // Clean up multiple spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
};

/**
 * Standardize unit to a canonical form
 */
export const standardizeUnit = (unit: string): string => {
  const normalized = normalizeString(unit);
  return UNIT_STANDARDIZATION[normalized] || normalized;
};

/**
 * Create a normalized item key for price history
 * Format: "quantity+unit+normalized_name"
 * e.g., "1kg+milk" or "500g+flour"
 */
export const createItemKey = (name: string, quantity?: number, unit?: string): string => {
  const normalized = normalizeItemName(name);
  const stdUnit = unit ? standardizeUnit(unit) : 'pcs';
  
  if (quantity && stdUnit !== 'pcs') {
    return `${quantity}${stdUnit}+${normalized}`;
  }
  
  return `${stdUnit}+${normalized}`;
};

/**
 * Parse item key back to components
 */
export const parseItemKey = (key: string): {name: string; quantity?: number; unit?: string} => {
  const parts = key.split('+');
  
  if (parts.length < 2) {
    return { name: key };
  }
  
  const name = parts.slice(1).join('+');
  const firstPart = parts[0];
  
  // Try to extract quantity and unit
  const match = firstPart.match(/^([\d.,]+)(.*)$/);
  
  if (match) {
    return {
      name,
      quantity: parseFloat(match[1].replace(',', '.')),
      unit: match[2].toLowerCase(),
    };
  }
  
  return { name: firstPart };
};

/**
 * Fuzzy match two strings
 */
export const fuzzyMatch = (str1: string, str2: string, threshold = 0.6): boolean => {
  const s1 = normalizeString(str1).toLowerCase();
  const s2 = normalizeString(str2).toLowerCase();
  
  // Simple ratio-based matching
  const intersection = s1.split('').filter(c => s2.includes(c)).length;
  const union = new Set([...s1.split(''), ...s2.split('')]).size;
  
  if (union === 0) return false;
  
  return intersection / union >= threshold;
};

/**
 * Suggest improvements for item name normalization
 */
export const suggestNormalization = (original: string, normalized: string): string[] => {
  const suggestions: string[] = [];
  
  // If they're very different, suggest manual review
  if (fuzzyMatch(original, normalized, 0.8)) {
    suggestions.push('Consider reviewing this item name');
  }
  
  // Suggest standard units
  const { unit } = extractQuantityAndUnit(original);
  if (unit && !['kg', 'g', 'l', 'ml', 'pcs'].includes(unit.toLowerCase())) {
    suggestions.push(`Standardize unit "${unit}" to one of: kg, g, l, ml, pcs`);
  }
  
  return suggestions;
};

/**
 * Calculate price per unit
 */
export const calculateUnitPrice = (totalPrice: number, quantity: number, unit: string): number => {
  if (!quantity || quantity <= 0) return 0;
  return totalPrice / quantity;
};

/**
 * Format unit price for display
 */
export const formatUnitPrice = (price: number, unit: string, currency: string = 'USD'): string => {
  const perUnit = unit === 'pcs' ? '' : ` per ${unit}`;
  return `${formatCurrency(price, currency)}${perUnit}`;
};

/**
 * Compare two item names for price history matching
 */
export const itemsMatchForPriceHistory = (item1: string, item2: string): {match: boolean; confidence: number; normalized: string} => {
  const norm1 = normalizeItemName(item1);
  const norm2 = normalizeItemName(item2);
  
  const match = fuzzyMatch(norm1, norm2);
  
  // If they don't match, try to find common keywords
  if (!match) {
    const keywords1 = new Set(norm1.split(' ').filter(w => w.length > 3));
    const keywords2 = new Set(norm2.split(' ').filter(w => w.length > 3));
    const common = [...keywords1].filter(k => keywords2.has(k));
    
    const confidence = Math.min(1, common.length / Math.max(keywords1.size, keywords2.size));
    return { match: confidence > 0.3, confidence, normalized: norm1 };
  }
  
  return { match: true, confidence: 0.9, normalized: norm1 };
};