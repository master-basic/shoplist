// =====================================================
// GroceryMind - OCR Utilities
// =====================================================

import { 
  OCRData, 
  OCRItem, 
  SmartSuggestion, 
  ListItem,
  PriceHistoryItem,
  normalizeStoreName, 
  STORES,
  normalizeItemName,
  fuzzyMatch,
} from '../types';

/**
 * Extract store name from receipt text (header matching)
 */
export const extractStoreName = (text: string): string => {
  const textLower = text.toLowerCase();
  
  // Check for known store names in header positions
  const headerPatterns = [
    /^.*?(bravo|carrefour|hypernova|lidl|a101|ost|gümüşpala|şok|almaza|1920|berk|akmerkez|migros|metro|bim).*$/i,
    /^(bravo|carrefour|hypernova|lidl|a101|ost|gümüşpala|şok|almaza|1920|berk|akmerkez|migros|metro|bim).*$/i,
  ];
  
  for (const pattern of headerPatterns) {
    const match = text.match(pattern);
    if (match) {
      return normalizeStoreName(match[1]);
    }
  }
  
  // Fallback: try to find any store name in the text
  for (const store of STORES) {
    if (textLower.includes(store.toLowerCase())) {
      return store;
    }
  }
  
  return 'Unknown Store';
};

/**
 * Extract date from receipt text
 */
export const extractDate = (text: string): string => {
  // Common date patterns
  const datePatterns = [
    // YYYY-MM-DD
    /(\d{4})-(\d{2})-(\d{2})/,
    // MM/DD/YYYY
    /(\d{2})\/(\d{2})\/(\d{4})/,
    // DD/MM/YYYY
    /(\d{2})\.(\d{2})\.(\d{4})/,
    // DD.MM.YYYY
    /(\d{2})\.(\d{2})\.(\d{4})/,
    // Month DD, YYYY
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i,
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      // Try to format as YYYY-MM-DD
      let year = match[3] || match[4]; // DD/MM/YYYY or DD.MM.YYYY
      let month = match[2] || match[3] || match[4]; // YYYY-MM-DD or MM/DD/YYYY or MM.DD.YYYY or Month DD, YYYY
      let day = match[1] || match[2] || match[3];
      
      if (month.match(/^[a-z]/i)) {
        // Month name - convert to number
        const monthMap: {[key: string]: number} = {
          january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
          july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
          jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
        };
        const monthNum = monthMap[month.toLowerCase()] !== undefined ? monthMap[month.toLowerCase()] + 1 : 1;
        const dayVal = match[2] || match[3];
        const yearVal = match[4] || match[5];
        month = monthNum.toString();
        day = dayVal;
        year = yearVal;
      }
      
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }
  
  return new Date().toISOString().split('T')[0];
};

/**
 * Extract total amount from receipt text
 */
export const extractTotal = (text: string): number => {
  // Look for total patterns
  const totalPatterns = [
    /total[:\s]+([\d.,]+)/i,
    /grand[:\s]+([\d.,]+)/i,
    /amount[:\s]+([\d.,]+)/i,
    /to pay[:\s]+([\d.,]+)/i,
    /payable[:\s]+([\d.,]+)/i,
    /([\d.,]+)\s*(total|subtotal)/i,
  ];
  
  for (const pattern of totalPatterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  
  // Fallback: look for the highest number that looks like a price
  const numbers = text.match(/[\d.,]+/g) || [];
  let maxAmount = 0;
  
  for (const num of numbers) {
    const amount = parseFloat(num.replace(/,/g, ''));
    if (!isNaN(amount) && amount > 1 && amount > maxAmount) {
      maxAmount = amount;
    }
  }
  
  return maxAmount > 0 ? maxAmount : 0;
};

/**
 * Extract line items from receipt text
 */
export const extractItems = (text: string, total?: number): OCRItem[] => {
  const items: OCRItem[] = [];
  
  // Split by common line item patterns
  const lines = text.split('\n');
  
  // Look for item lines (usually contain numbers and text)
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Skip header/footer lines
    const skipPatterns = [
      /receipt/i,
      /cash register/i,
      /cashier/i,
      /date/i,
      /time/i,
      /total/i,
      /subtotal/i,
      /tax/i,
      /payment/i,
      /method/i,
      /change/i,
      /thank you/i,
      /^-+$/,
    ];
    
    if (skipPatterns.some(p => p.test(trimmed))) continue;
    
    // Try to extract item info
    const item = tryParseItemLine(trimmed, total);
    if (item) {
      items.push(item);
    }
  }
  
  // Sort by confidence
  items.sort((a, b) => b.confidence - a.confidence);
  
  return items;
};

/**
 * Try to parse a single line as an item
 */
const tryParseItemLine = (line: string, total?: number): OCRItem | null => {
  // Look for patterns like: "item name 1.5 kg 5.00" or "1.5 kg item name 5.00"
  
  const patterns = [
    // "item name quantity unit price"
    /(.+?)\s+([\d.,]+)\s*(kg|g|l|ml|pcs|pack|can|bottle|box)?\s+([\d.,]+)/i,
    // "quantity unit item name price"
    /([\d.,]+)\s*(kg|g|l|ml|pcs|pack|can|bottle|box)?\s+(.+?)\s+([\d.,]+)/i,
    // "item name - price"
    /(.+?)\s*-\s*([\d.,]+)/i,
    // "item name @ price"
    /(.+?)\s*@\s*([\d.,]+)/i,
    // Just a price (might be subtotal/total)
    /^([\d.,]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      if (match[4]) {
        // Full match with item name, quantity, unit, price
        const qty = parseFloat(match[2].replace(/,/g, '.'));
        const price = parseFloat(match[4].replace(/,/g, '.'));
        const unit = match[3]?.toLowerCase() || 'pcs';
        const totalVal = qty * price;
        
        return {
          name: match[1].trim(),
          quantity: qty,
          unit: unit,
          unit_price: price,
          total_price: totalVal,
          confidence: 0.8,
        };
      } else if (match[3]) {
        // Match with item name and price
        const price = parseFloat(match[2].replace(/,/g, '.'));
        const totalVal = (total || 0) as number || price;
        
        // If there's a quantity in the line, use it
        const quantityMatch = line.match(/([\d.,]+)/);
        let quantity = quantityMatch ? parseFloat(quantityMatch[0].replace(/,/g, '.')) : totalVal / price;
        
        return {
          name: match[1].trim(),
          quantity: quantity,
          unit: 'pcs',
          unit_price: price,
          total_price: totalVal,
          confidence: 0.7,
        };
      }
    }
  }
  
  return null;
};

/**
 * Match OCR items to existing grocery list items
 */
export const matchItemsToList = (ocrItems: OCRItem[], listItems: ListItem[], threshold = 0.6): {
  matched: boolean;
  ocrItem: OCRItem;
  listItem?: ListItem;
}[] => {
  return ocrItems.map(ocrItem => {
    const normalizedOcr = normalizeItemName(ocrItem.name);
    
    // Find best matching list item
    let bestMatch: ListItem | undefined = undefined;
    let bestScore = 0;
    
    for (const listItem of listItems) {
      const normalizedList = normalizeItemName(listItem.name);
      const score = fuzzyMatch(normalizedOcr, normalizedList, threshold);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = listItem;
      }
    }
    
    return {
      matched: bestScore >= threshold,
      ocrItem,
      listItem: bestMatch,
    };
  });
};

/**
 * Generate smart suggestions from purchase history
 */
export const generateSmartSuggestions = (
  items: ListItem[],
  priceHistory: PriceHistoryItem[],
  store?: string,
  limit = 10
): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];
  
  // Get unique items
  const uniqueItems = new Map<string, ListItem>();
  for (const item of items) {
    const key = normalizeItemName(item.name);
    if (!uniqueItems.has(key)) {
      uniqueItems.set(key, item);
    }
  }
  
  for (const [key, item] of uniqueItems) {
    // Find price history for this item
    const history = priceHistory.filter(p => {
      const normalized = normalizeItemName(p.item_name);
      return fuzzyMatch(normalized, normalizeItemName(item.name));
    });
    
    if (history.length > 0) {
      // Get most recent price
      const sorted = history.sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());
      const recent = sorted[0];
      
      // Calculate frequency
      const frequency = history.length;
      
      suggestions.push({
        item_name: item.name,
        last_price: recent.unit_price,
        store: recent.store_name,
        frequency,
        last_bought_at: recent.purchased_at,
      });
    }
  }
  
  // Sort by frequency and limit
  suggestions.sort((a, b) => b.frequency - a.frequency);
  return suggestions.slice(0, limit);
};

/**
 * Clean OCR text for better parsing
 */
export const cleanOcrText = (text: string): string => {
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Remove common OCR artifacts
  cleaned = cleaned.replace(/\d{4}(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, 'XXXX$1$2$3$4$5'); // Hide personal info
  
  return cleaned.trim();
};

/**
 * Validate OCR confidence
 */
export const validateOcrConfidence = (
  text: string,
  items: OCRItem[],
  total: number,
  date: string,
  store: string
): {valid: boolean; issues: string[]} => {
  const issues: string[] = [];
  
  // Check if we extracted anything
  if (items.length === 0) {
    issues.push('No items were extracted from the receipt');
  }
  
  // Check total extraction
  if (!total && text.length > 50) {
    issues.push('Total amount could not be extracted');
  }
  
  // Check date extraction
  if (!date) {
    issues.push('Date could not be extracted');
  }
  
  // Check store extraction
  if (store === 'Unknown Store' && text.length > 100) {
    issues.push('Store name could not be recognized');
  }
  
  // Check confidence
  let avgConfidence = 100;
  if (items.length > 0) {
    avgConfidence = items.reduce((sum, item) => sum + item.confidence, 0) / items.length;
    if (avgConfidence < 0.5) {
      issues.push('Low confidence score detected for extracted items');
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Calculate total from items
 */
export const calculateItemsTotal = (items: OCRItem[]): number => {
  return items.reduce((sum, item) => sum + (item.total_price || 0), 0);
};