const { WebSocketServer } = require('ws');

let wss = null;

const households = new Map();
const userClients = new Map();

function setupWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const householdId = url.searchParams.get('householdId');
    const userId = url.searchParams.get('userId');

    if (!householdId || !userId) {
      ws.close(4000, 'householdId and userId required');
      return;
    }

    ws.householdId = householdId;
    ws.userId = userId;

    if (!households.has(householdId)) households.set(householdId, new Set());
    households.get(householdId).add(ws);

    if (!userClients.has(userId)) userClients.set(userId, new Set());
    userClients.get(userId).add(ws);

    ws.on('close', () => {
      households.get(householdId)?.delete(ws);
      userClients.get(userId)?.delete(ws);
    });

    ws.send(JSON.stringify({ type: 'connected', payload: { householdId, userId } }));
  });

  return wss;
}

function broadcastToHousehold(householdId, message) {
  if (!wss) return;
  const clients = households.get(householdId);
  if (!clients) return;
  const data = JSON.stringify(message);
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(data);
  }
}

function broadcastToUser(userId, message) {
  if (!wss) return;
  const clients = userClients.get(userId);
  if (!clients) return;
  const data = JSON.stringify(message);
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(data);
  }
}

function getWss() {
  return wss;
}

module.exports = { setupWebSocket, broadcastToHousehold, broadcastToUser, getWss };
