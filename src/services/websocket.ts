import type { Message } from '../types';
import { generateRandomMessage } from '../data/messages';

type MessageHandler = (message: Message) => void;
type ConnectionHandler = (connected: boolean) => void;

interface WebSocketServiceOptions {
  url?: string;
  usePolling?: boolean;
  pollingInterval?: number;
  simulateRealTime?: boolean;
  simulateInterval?: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;
  private simulateTimer: ReturnType<typeof setInterval> | null = null;
  private isConnected = false;
  private url: string;
  private usePolling: boolean;
  private pollingInterval: number;
  private simulateRealTime: boolean;
  private simulateInterval: number;

  constructor(options: WebSocketServiceOptions = {}) {
    this.url = options.url || 'ws://localhost:8080/ws';
    this.usePolling = options.usePolling || false;
    this.pollingInterval = options.pollingInterval || 5000;
    this.simulateRealTime = options.simulateRealTime ?? true;
    this.simulateInterval = options.simulateInterval || 8000;
  }

  connect(): void {
    if (this.isConnected) return;

    if (this.usePolling) {
      this.startPolling();
    } else {
      this.connectWebSocket();
    }

    if (this.simulateRealTime) {
      this.startSimulation();
    }
  }

  private connectWebSocket(): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
        console.log('[WebSocket] Connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as Message;
          this.notifyMessageHandlers(message);
        } catch (e) {
          console.error('[WebSocket] Failed to parse message:', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.notifyConnectionHandlers(false);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyConnectionHandlers(false);
        console.log('[WebSocket] Disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      this.notifyConnectionHandlers(false);
      this.attemptReconnect();
    }
  }

  private startPolling(): void {
    if (this.pollingTimer) return;

    this.isConnected = true;
    this.notifyConnectionHandlers(true);
    console.log('[Polling] Started');

    this.pollingTimer = setInterval(() => {
      console.log('[Polling] Checking for new messages...');
    }, this.pollingInterval);
  }

  private stopPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
      console.log('[Polling] Stopped');
    }
  }

  private startSimulation(): void {
    if (this.simulateTimer) return;

    console.log('[Simulation] Real-time message simulation started');

    this.simulateTimer = setInterval(() => {
      if (this.isConnected) {
        const message = generateRandomMessage();
        this.notifyMessageHandlers(message);
      }
    }, this.simulateInterval);
  }

  private stopSimulation(): void {
    if (this.simulateTimer) {
      clearInterval(this.simulateTimer);
      this.simulateTimer = null;
      console.log('[Simulation] Stopped');
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WebSocket] Max reconnect attempts reached, falling back to polling');
      this.startPolling();
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected) {
        this.connectWebSocket();
      }
    }, delay);
  }

  disconnect(): void {
    this.stopSimulation();
    this.stopPolling();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.notifyConnectionHandlers(false);
    console.log('[WebSocket] Service disconnected');
  }

  sendMessage(message: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Not connected, cannot send message');
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    handler(this.isConnected);
    return () => this.connectionHandlers.delete(handler);
  }

  private notifyMessageHandlers(message: Message): void {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const messageWebSocket = new WebSocketService({
  simulateRealTime: true,
  simulateInterval: 8000,
});

export const useMessageWebSocket = () => {
  return messageWebSocket;
};
