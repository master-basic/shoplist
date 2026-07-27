const categoryRules = [
  {
    category: 'Dairy',
    patterns: [/milk/, /cream/, /cheese/, /yogurt/, /butter/, /eggs?\s*(dozen|pack|carton|littera)/, /lactic\//],
  },
  {
    category: 'Meat & Poultry',
    patterns: [/chicken|frango|pui/],
  },
  {
    category: 'Beverages',
    patterns: [/water|ap|suco|watera|coke|pepsi|fanta|sprite|juice|cola|beer|bere|vin|wine|soft.?drink|energ[^a]/],
  },
  {
    category: 'Snacks',
    patterns: [/chip|chips|biscuit|biscotti|cookie|cookies|cracker|crackers|popcorn|popped/, /nuci|nuts|almond/],
  },
  {
    category: 'Produce',
    patterns: [/apple|applea|pear|banana|orange|lime|limetza|lemon|lămîie|grape|strawberry|strawberries|fruit|fructe|vege|vegetable|salad|salata|tomato|tomate|potato|cartof|onion|ceapă|pepper|ardei|carrot|morcov/],
  },
  {
    category: 'Bakery',
    patterns: [/bread|pâine|pan|cake|tort|pie|clan|roll|rolls|croissant|bagel|bun/],
  },
  {
    category: 'Frozen Foods',
    patterns: [/frozen|congelat|pizza|pîzza|ice.?cream|înghețată|fries|cartof|waffle|clan/],
  },
  {
    category: 'Pasta & Grains',
    patterns: [/pasta|spaghetti|macaroni|rice|orez|noodle|noodles|cereal|cereale|flour|făină|floro/],
  },
  {
    category: 'Condiments & Sauces',
    patterns: [/sauce|sos|ketchup|mustard|muștar|mayonnaise|mayoneză|oil|ulei|vinegar|oțet|spice|condiment|salt|sare|pepper|piper/],
  },
  {
    category: 'Canned & Jarred',
    patterns: [/can|conserva|jar|borcan|tomato.?paste|paste|legume|bean|fasole|soup|supă|stew|ciorbă/],
  },
  {
    category: 'Baby & Pet',
    patterns: [/baby|bebeluș|formula|lapte|pet|animal|dog.?food|cat.?food|pisoi|câine/],
  },
  {
    category: 'Health & Beauty',
    patterns: [/shampoo|sapun|soap|cremă|lotiune|lotion|deodorant|sare|medicine|medicament|vitamin|vitamine|tooth|dinte|mouthwash|rins|bandage|plastur/],
  },
  {
    category: 'Household',
    patterns: [/towel|prosap|paper|hârtie|bag| sac|clean|curat|detergent|soap|sapun|sponge| burete|brush|perie|trash|gunoi|foil|folie|wrap|ambal/],
  },
  {
    category: 'Beverages',
    patterns: [/coffee|cafea|tea|ceai|energy|energizz|drink|ber/],
  },
  {
    category: 'Snacks',
    patterns: [/candy|confect|chocolate|ciocolată|sugar|zahar|sweet|dulce|salty|sărat|crunch|crocant/],
  },
  {
    category: 'Condiments & Sauces',
    patterns: [/honey|miere|jam|dulceață|jelly|gem|pickle|murăt/],
  },
];

function categorizeItem(name) {
  if (!name || name.trim().length === 0) {
    return { category: 'Other', confidence: 0 };
  }

  const normalizedName = name.toLowerCase().trim();

  for (const rule of categoryRules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(normalizedName)) {
        return { category: rule.category, confidence: Math.round(Math.random() * 15 + 85) };
      }
    }
  }

  return { category: 'Other', confidence: 0 };
}

function autoCategorizeItems(items) {
  return items.map(item => {
    const result = categorizeItem(item.name);
    return {
      ...item,
      category: result.category,
      categoryConfidence: result.confidence,
    };
  });
}

module.exports = { categorizeItem, autoCategorizeItems, categoryRules };
