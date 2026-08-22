# Component Architecture Documentation

This document outlines the refactored component structure for better maintainability and reusability.

## File Structure

```
src/
├── types/
│   └── index.ts                      # TypeScript interfaces and type definitions
├── utils/
│   └── historyStorage.ts            # localStorage operations for IP history
├── hooks/
│   ├── useIpHistory.ts              # Custom hook for managing IP history state
│   ├── useIpFetcher.ts              # Custom hook for IP fetching logic
│   ├── useLocalStorage.ts           # Generic localStorage hook
│   ├── useTime.ts                   # Time management hook
│   └── useWanIpState.ts             # WAN IP state management hook
├── contexts/
│   ├── WanIpContext.tsx             # Settings context provider
│   ├── WanIpFullContext.tsx         # Full app state context provider
│   └── index.ts                     # Context exports
└── app/components/
    ├── TimeSeriesLog.tsx            # Reusable time-series visualization component
    ├── ProviderPicker.tsx           # IP provider selection component
    ├── IPReadout.tsx                # Current IP display component
    ├── RefreshButton.tsx            # Manual refresh button
    ├── AutoRefreshControls.tsx      # Auto-refresh settings
    ├── FloatingTooltip.tsx          # Tooltip component
    └── IPTracker.tsx                # Main application component
```

## Components

### IPTracker.tsx
- **Purpose**: Main IP tracking component that orchestrates all IP monitoring functionality
- **Features**: 
  - Integrates all sub-components (ProviderPicker, IPReadout, TimeSeriesLog, etc.)
  - Uses WanIpFullContext for centralized state management
  - Handles IP fetching, history tracking, and user interactions
- **Dependencies**: WanIpFullContext, all sub-components

### ProviderPicker.tsx
- **Purpose**: Radio button selection for IP API providers
- **Features**: 
  - Multiple provider options (ipify, IP-API, IPinfo, ipapi.co)
  - Descriptions and API URLs for each provider
- **Reusable**: Can be used by other application screens

### IPReadout.tsx
- **Purpose**: Displays current IP address and fetch status
- **Features**:
  - IP address with provider name
  - Last fetch timestamp
  - Seconds since last fetch
- **Reusable**: Can be used by other application screens

## Custom Hooks

### useIpHistory.ts
- **Purpose**: Manages IP history state and localStorage persistence
- **API**:
  - `ipHistory`: Array of history entries
  - `addHistoryEntry(ip, timestamp)`: Add new history entry
  - `clearHistoryData()`: Clear all history

### useIpFetcher.ts
- **Purpose**: Handles IP fetching logic with polling and error handling
- **API**:
  - `ipAddress`: Current IP address
  - `lastFetch`: Timestamp of last fetch
  - `isLoading`: Loading state
  - `handleRefresh()`: Manual refresh function
- **Features**:
  - Automatic polling every 60 seconds
  - Error handling
  - Loading state management
  - Callback for history updates

## Utilities

### historyStorage.ts
- **Purpose**: localStorage operations for IP history
- **Functions**:
  - `loadHistory()`: Load history from localStorage
  - `saveHistory(history)`: Save history to localStorage
  - `pushHistoryEntry(ip, timestamp, setter)`: Add entry and update state
  - `clearHistory(setter)`: Clear history and localStorage

## Types

### index.ts
- **IpResponse**: Interface for IP API responses
  - `ip: string` - The IP address
- **HistoryEntry**: Interface for IP history entries
  - `ip: string | null` - IP address or null for failures
  - `start: number` - Start timestamp
  - `end?: number` - End timestamp (optional, current time if ongoing)
- **TimeSeriesLogProps**: Props interface for TimeSeriesLog component

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Components can be reused across different screens
3. **Testability**: Hooks and utilities are easier to unit test
4. **Maintainability**: Changes to specific features are isolated
5. **Type Safety**: Shared TypeScript interfaces ensure consistency
6. **Performance**: Custom hooks optimize re-renders and side effects

## Future Enhancements

- Add unit tests for hooks and utilities
- Create Storybook stories for individual components
- Add more IP provider options
- Implement different time window options for the timeline
- Add export/import functionality for history data
