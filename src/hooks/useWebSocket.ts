import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import log from '@/utils/debug';

interface WsMessage {
  type: string;
  payload: Record<string, unknown>;
}

export function useWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMessage = useCallback((msg: WsMessage) => {
    log.info('WebSocket message received', { type: msg.type });
    switch (msg.type) {
      case 'list_created':
      case 'list_updated':
      case 'list_deleted':
        queryClient.invalidateQueries({ queryKey: ['lists'] });
        break;
      case 'item_added':
      case 'item_updated':
      case 'item_deleted':
      case 'item_toggled':
        queryClient.invalidateQueries({ queryKey: ['lists'] });
        break;
      case 'member_added':
      case 'member_removed':
        queryClient.invalidateQueries({ queryKey: ['households'] });
        break;
    }
  }, [queryClient]);

  const connect = useCallback(() => {
    const userId = localStorage.getItem('user_id');
    const householdId = localStorage.getItem('currentHouseholdId');
    if (!userId || !householdId) {
      log.info('WebSocket skipped: no userId or householdId', { userId, householdId });
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = 'localhost:3001';
    const url = `${protocol}//${host}?householdId=${householdId}&userId=${userId}`;
    log.info('WebSocket connecting', { url });

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => log.info('WebSocket connected');
    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data);
        handleMessage(msg);
      } catch {
        log.warn('WebSocket malformed message', { data: event.data });
      }
    };
    ws.onclose = (e) => {
      log.info('WebSocket closed', { code: e.code, reason: e.reason });
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };
    ws.onerror = () => {
      log.error('WebSocket error');
      ws.close();
    };
  }, [handleMessage]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return wsRef;
}
