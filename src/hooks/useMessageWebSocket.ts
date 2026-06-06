import { useEffect } from 'react';
import { useMessageStore } from '../store/useMessageStore';
import { messageWebSocket } from '../services/websocket';
import type { Message } from '../types';

export const useMessageWebSocket = (autoConnect = true) => {
  const addMessage = useMessageStore((state) => state.addMessage);
  const setConnected = useMessageStore((state) => state.setConnected);

  useEffect(() => {
    if (!autoConnect) return;

    const handleMessage = (message: Message) => {
      addMessage(message);
    };

    const handleConnectionChange = (connected: boolean) => {
      setConnected(connected);
    };

    const unsubscribeMessage = messageWebSocket.onMessage(handleMessage);
    const unsubscribeConnection = messageWebSocket.onConnectionChange(handleConnectionChange);

    messageWebSocket.connect();

    return () => {
      unsubscribeMessage();
      unsubscribeConnection();
      messageWebSocket.disconnect();
    };
  }, [autoConnect, addMessage, setConnected]);

  return {
    connect: () => messageWebSocket.connect(),
    disconnect: () => messageWebSocket.disconnect(),
    isConnected: useMessageStore((state) => state.isConnected),
  };
};
