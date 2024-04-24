import ws from 'ws';

declare module 'ws' {
  export interface WebSocket extends ws {
    id?: string;
  }
}