import type { ListItem } from '@/types';

export interface CategoryMapping {
  pattern: RegExp;
  category: ListItem['category'];
  confidence: number;
}

export const CATEGORY_MAPPINGS: CategoryMapping[] = [
  // ============ PRODUCE ============
  { pattern: /alma|apple/i, category: 'produce', confidence: 0.95 },
  { pattern: /banan|banana/i, category: 'produce', confidence: 0.95 },
  { pattern: /pomidor|tomato/i, category: 'produce', confidence: 0.95 },
  { pattern: /xiyar|cucumber/i, category: 'produce', confidence: 0.95 },
  { pattern: /kartof|potato/i, category: 'produce', confidence: 0.95 },
  { pattern: /soyan|onion/i, category: 'produce', confidence: 0.95 },
  { pattern: /nar|pomegranate/i, category: 'produce', confidence: 0.95 },
  { pattern: /limon|lemon/i, category: 'produce', confidence: 0.95 },
  { pattern: /koltom|cabbage/i, category: 'produce', confidence: 0.95 },
  { pattern: /armud|pear/i, category: 'produce', confidence: 0.95 },
  { pattern: /portaqal|orange/i, category: 'produce', confidence: 0.95 },
  { pattern: /izim|grape/i, category: 'produce', confidence: 0.95 },
  { pattern: /striberry|strawberry/i, category: 'produce', confidence: 0.95 },
  { pattern: /kivi/i, category: 'produce', confidence: 0.95 },
  { pattern: /manqo|mango/i, category: 'produce', confidence: 0.95 },
  { pattern: /yerkgek|carrot/i, category: 'produce', confidence: 0.95 },
  { pattern: /badamcan|eggplant/i, category: 'produce', confidence: 0.95 },
  { pattern: /bolqar bibri|bell pepper/i, category: 'produce', confidence: 0.95 },
  { pattern: /saramsaq|garlic/i, category: 'produce', confidence: 0.95 },
  { pattern: /gayeri|herbs/i, category: 'produce', confidence: 0.90 },
  { pattern: /spanaq|spinach/i, category: 'produce', confidence: 0.95 },
  { pattern: /kahi|lettuce/i, category: 'produce', confidence: 0.95 },
  { pattern: /salad/i, category: 'produce', confidence: 0.90 },
  { pattern: /brokoly|broccoli/i, category: 'produce', confidence: 0.95 },
  { pattern: /qovmaq|bulgur/i, category: 'produce', confidence: 0.90 },
  
  // ============ DAIRY ============
  { pattern: /sd|süd|milk/i, category: 'dairy', confidence: 0.95 },
  { pattern: /qatq|yogurt/i, category: 'dairy', confidence: 0.95 },
  { pattern: /ktr ya|butter/i, category: 'dairy', confidence: 0.95 },
  { pattern: /toyuq yumurta|chicken egg/i, category: 'dairy', confidence: 0.95 },
  { pattern: /pendir|cheese/i, category: 'dairy', confidence: 0.95 },
  
  // ============ MEAT ============
  { pattern: /toyuq|chicken/i, category: 'meat', confidence: 0.95 },
  { pattern: /qoz|pork/i, category: 'meat', confidence: 0.95 },
  { pattern: /d|beef/i, category: 'meat', confidence: 0.95 },
  { pattern: /qur|lamb/i, category: 'meat', confidence: 0.95 },
  { pattern: /balq|bacon/i, category: 'meat', confidence: 0.90 },
  { pattern: /qur|ham/i, category: 'meat', confidence: 0.90 },
  
  // ============ BAKERY ============
  { pattern: /k|bread/i, category: 'bakery', confidence: 0.95 },
  { pattern: /q|cake/i, category: 'bakery', confidence: 0.95 },
  { pattern: /k|cookie/i, category: 'bakery', confidence: 0.95 },
  { pattern: /puf|pudding/i, category: 'bakery', confidence: 0.90 },
  { pattern: /p|pie/i, category: 'bakery', confidence: 0.90 },
  { pattern: /k|croissant/i, category: 'bakery', confidence: 0.90 },
  { pattern: /doner/i, category: 'bakery', confidence: 0.95 },
  { pattern: /sandvich|sandwich/i, category: 'bakery', confidence: 0.95 },
  
  // ============ FROZEN ============
  { pattern: /dondr|frozen/i, category: 'frozen', confidence: 0.95 },
  { pattern: /bulyon|soup/i, category: 'frozen', confidence: 0.90 },
  { pattern: /pasta|pasta/i, category: 'frozen', confidence: 0.90 },
  { pattern: /piza|pizza/i, category: 'frozen', confidence: 0.95 },
  
  // ============ PANTRY ============
  { pattern: /ya|oil/i, category: 'pantry', confidence: 0.95 },
  { pattern: /du|sugar/i, category: 'pantry', confidence: 0.95 },
  { pattern: /duz|salt/i, category: 'pantry', confidence: 0.95 },
  { pattern: /un|flour/i, category: 'pantry', confidence: 0.95 },
  { pattern: /kafe|coffee/i, category: 'pantry', confidence: 0.95 },
  { pattern: /ca|tea/i, category: 'pantry', confidence: 0.95 },
  { pattern: /soya|soy/i, category: 'pantry', confidence: 0.90 },
  { pattern: /qat|cereal/i, category: 'pantry', confidence: 0.90 },
  
  // ============ BEVERAGES ============
  { pattern: /cola/i, category: 'beverages', confidence: 0.95 },
  { pattern: /qat|juice/i, category: 'beverages', confidence: 0.95 },
  { pattern: /su|water/i, category: 'beverages', confidence: 0.95 },
  { pattern: /qat|soda/i, category: 'beverages', confidence: 0.95 },
  
  // ============ SNACKS ============
  { pattern: /qat|chips/i, category: 'snacks', confidence: 0.95 },
  
  // ============ HOUSEHOLD ============
  { pattern: /qat|cleaning/i, category: 'household', confidence: 0.90 },
  
  // ============ PERSONAL CARE ============
  { pattern: /qat|shampoo/i, category: 'personal_care', confidence: 0.95 },
  { pattern: /qat|soap/i, category: 'personal_care', confidence: 0.95 },
  { pattern: /qat|toothpaste/i, category: 'personal_care', confidence: 0.95 },
];

export function categorizeItem(itemName: string): { category: ListItem['category']; confidence: number; suggestion?: string } {
  const normalized = itemName.toLowerCase().trim();
  
  // Try exact matches first
  for (const mapping of CATEGORY_MAPPINGS) {
    if (mapping.pattern.test(normalized)) {
      return {
        category: mapping.category,
        confidence: mapping.confidence,
      };
    }
  }
  
  // Fuzzy matching based on word boundaries
  const words = normalized.split(/[\s\.,]+/);
  for (const word of words) {
    if (word.length > 2) {
      for (const mapping of CATEGORY_MAPPINGS) {
        if (mapping.pattern.test(word)) {
          return {
            category: mapping.category,
            confidence: mapping.confidence * 0.8,
            suggestion: `${mapping.category} - ${word}`,
          };
        }
      }
    }
  }
  
  // Default to pantry for unknown items (common for groceries)
  return {
    category: 'pantry',
    confidence: 0.5,
    suggestion: 'uncategorized',
  };
}

export function getAllCategories(): ListItem['category'][] {
  return [...new Set(CATEGORY_MAPPINGS.map(m => m.category))];
}
