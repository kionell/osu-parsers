import { Buffer as WebBuffer } from 'buffer/';

declare global {
  interface Window {
    Buffer: WebBuffer;
  }
}

if (typeof window !== 'undefined') {
  window.Buffer = WebBuffer as any;
}
