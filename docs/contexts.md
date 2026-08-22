# WAN IP Context Providers

This directory contains React Context providers for global state management of the `my-ip` application.

## Available Contexts

### 1. `WanIpContext` - Settings Only
Provides access to WAN IP settings (provider, auto-refresh, interval) with localStorage persistence.

**Usage:**
```tsx
import { WanIpProvider, useWanIpContext } from '@/contexts';

// Wrap your app
<WanIpProvider>
  <App />
</WanIpProvider>

// Use in components
function MyComponent() {
  const { provider, setProvider, autoRefreshEnabled, setAutoRefreshEnabled } = useWanIpContext();
  // ... use the state
}
```

### 2. `WanIpFullContext` - Complete App State
Provides access to all WAN IP state including IP fetching, history, and time management.

**Usage:**
```tsx
import { WanIpFullProvider, useWanIpFullContext } from '@/contexts';

// Wrap your app
<WanIpFullProvider>
  <App />
</WanIpFullProvider>

// Use in components
function MyComponent() {
  const {
    ipAddress,
    isLoading,
    handleRefresh,
    ipHistory,
    clearHistory,
    // ... all other state
  } = useWanIpFullContext();
  // ... use the complete state
}
```

## Benefits

- **🎯 Centralized State**: All state management in one place
- **🔄 Automatic Persistence**: Settings automatically saved to localStorage
- **♻️ Reusable**: State can be accessed from any component in the tree
- **🧪 Testable**: Context can be mocked for testing
- **📦 Clean Components**: Components focus on UI, not state management

## Example App Structure

```tsx
// app/layout.tsx or _app.tsx
import { WanIpFullProvider } from '@/contexts';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WanIpFullProvider>
          {children}
        </WanIpFullProvider>
      </body>
    </html>
  );
}

// Any component can now access the global state
function MyComponent() {
  const { ipAddress, handleRefresh } = useWanIpFullContext();
  // ... component logic
}
```

## Migration Guide

To migrate from local state to context:

1. **Replace hook imports**:
   ```tsx
   // Before
   import { useWanIpState } from '@/hooks/useWanIpState';

   // After
   import { useWanIpFullContext } from '@/contexts';
   ```

2. **Replace hook usage**:
   ```tsx
   // Before
   const { provider, setProvider } = useWanIpState();

   // After
   const { provider, setProvider } = useWanIpFullContext();
   ```

3. **Remove local state**: The context handles all state management automatically.

## TypeScript Support

Both contexts are fully typed with TypeScript interfaces:
- `WanIpContextType` - For settings-only context
- `WanIpFullContextType` - For complete app state context

The hooks will throw helpful errors if used outside their respective providers.
