"use client";

import { useWanIpContext } from './WanIpContext';

// Re-export the context hook for convenience
export { useWanIpContext } from './WanIpContext';

// Re-export the full context for complete app state
export {
  WanIpFullProvider,
  useWanIpFullContext,
  WanIpFullContext
} from './WanIpFullContext';

// Export types
export type { WanIpContextType } from './WanIpContext';
export type { WanIpFullContextType } from './WanIpFullContext';