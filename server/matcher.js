function normalizeItemName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function fuzzyMatch(str1, str2, threshold = 0.4) {
  const s1 = normalizeItemName(str1);
  const s2 = normalizeItemName(str2);
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  const maxLen = Math.max(s1.length, s2.length);
  const dist = levenshteinDistance(s1, s2);
  const score = 1 - dist / maxLen;
  return score >= threshold ? Math.round(score * 100) / 100 : 0;
}

function findBestMatch(ocrName, knownItems, threshold = 0.4) {
  let bestScore = 0;
  let bestItem = null;
  for (const item of knownItems) {
    const score = fuzzyMatch(ocrName, item.name, threshold);
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }
  return bestItem ? { matchedItem: bestItem, score: bestScore } : null;
}

async function matchReceiptItems(ocrItems, householdId, pool, threshold = 0.4) {
  const result = await pool.query(
    `SELECT DISTINCT li.id, li.name FROM list_items li
     JOIN grocery_lists gl ON li.list_id = gl.id
     WHERE gl.household_id = $1 AND li.name IS NOT NULL AND li.name != ''`,
    [householdId]
  );
  const knownItems = result.rows;
  if (knownItems.length === 0) {
    return ocrItems.map(item => ({ ...item, matchedItem: null, matchScore: 0 }));
  }
  return ocrItems.map(item => {
    const match = findBestMatch(item.name, knownItems, threshold);
    return {
      ...item,
      matchedItem: match ? { id: match.matchedItem.id, name: match.matchedItem.name } : null,
      matchScore: match ? match.score : 0,
    };
  });
}

module.exports = { normalizeItemName, levenshteinDistance, fuzzyMatch, findBestMatch, matchReceiptItems };
