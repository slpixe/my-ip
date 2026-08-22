import React from 'react';

interface RefreshButtonProps {
  onRefresh: () => Promise<void> | void;
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function RefreshButton({
  onRefresh,
  isLoading,
  disabled = false,
  className = '',
  style = {}
}: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={disabled || isLoading}
      className={className}
      style={{
        padding: '.5rem 1rem',
        ...style
      }}
    >
      {isLoading ? 'Refreshing…' : 'Refresh'}
    </button>
  );
}