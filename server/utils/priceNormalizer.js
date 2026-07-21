const UNIT_PATTERNS = [
  { regex: /(\d+(?:[.,]\d+)?)\s*(kg|kilogram|kilograms)/i, baseUnit: 'kg', multiplier: 1 },
  { regex: /(\d+(?:[.,]\d+)?)\s*(g|gram|grams)/i, baseUnit: 'kg', multiplier: 0.001 },
  { regex: /(\d+(?:[.,]\d+)?)\s*(l|litre|litres|liter|liters)/i, baseUnit: 'L', multiplier: 1 },
  { regex: /(\d+(?:[.,]\d+)?)\s*(ml|milliliter|milliliters)/i, baseUnit: 'L', multiplier: 0.001 },
  { regex: /(\d+(?:[.,]\d+)?)\s*(oz|ounce|ounces)/i, baseUnit: 'kg', multiplier: 0.0283495 },
  { regex: /(\d+(?:[.,]\d+)?)\s*(lb|lbs|pound|pounds)/i, baseUnit: 'kg', multiplier: 0.453592 },
];

function parseQuantityAndUnit(itemName) {
  for (const pattern of UNIT_PATTERNS) {
    const match = itemName.match(pattern.regex);
    if (match) {
      const quantity = parseFloat(match[1].replace(',', '.'));
      return { quantity, rawUnit: match[2], baseUnit: pattern.baseUnit, quantityInBaseUnit: quantity * pattern.multiplier };
    }
  }
  return { quantity: 1, rawUnit: 'pcs', baseUnit: 'pcs', quantityInBaseUnit: 1 };
}

function calculateNormalizedPrice(totalPrice, quantityInBaseUnit) {
  if (!quantityInBaseUnit || quantityInBaseUnit <= 0) return null;
  return Math.round((totalPrice / quantityInBaseUnit) * 100) / 100;
}

function normalizeItemPrice(itemName, totalPrice) {
  const parsed = parseQuantityAndUnit(itemName);
  const normalizedPrice = calculateNormalizedPrice(totalPrice, parsed.quantityInBaseUnit);
  return {
    ...parsed,
    originalPrice: totalPrice,
    normalizedPrice,
    normalizedUnit: `per ${parsed.baseUnit}`,
  };
}

function normalizeMultiplePrices(items) {
  return items.map(item => normalizeItemPrice(item.name, item.price));
}

module.exports = { parseQuantityAndUnit, calculateNormalizedPrice, normalizeItemPrice, normalizeMultiplePrices };
