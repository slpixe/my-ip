import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      return item ? deserialize(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, serialize(valueToStore));
    } catch (error) {
      // Silently fail for localStorage errors in production
    }
  }, [key, serialize, value]);

  return [value, setStoredValue] as const;
}

// Specialized hooks for common types
export function useLocalStorageString(key: string, defaultValue: string) {
  return useLocalStorage(key, defaultValue, (v) => v, (v) => v);
}

export function useLocalStorageBoolean(key: string, defaultValue: boolean) {
  return useLocalStorage(
    key,
    defaultValue,
    (v) => v ? '1' : '0',
    (v) => v === '1'
  );
}

export function useLocalStorageNumber(key: string, defaultValue: number) {
  return useLocalStorage(
    key,
    defaultValue,
    (v) => String(v),
    (v) => Number(v)
  );
}