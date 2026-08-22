import React, { useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';

interface FloatingTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
}

export default function FloatingTooltip({ 
  content, 
  children, 
  placement = 'top',
  delay = 300,
  maxWidth = 300
}: FloatingTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    // The offset, flip and shift middleware handle collisions
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 5 }),
    ],
    // Ensures the floating element is repositioned when the reference element moves
    whileElementsMounted: autoUpdate,
  });

  // Interaction hooks
  const hover = useHover(context, {
    move: false,
    delay: { open: delay, close: 150 },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      {React.cloneElement(children, {
        ...getReferenceProps({
          ref: refs.setReference,
        }),
      })}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              backgroundColor: 'var(--tooltip-bg)',
              color: 'var(--text)',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              maxWidth: `${maxWidth}px`,
              zIndex: 1000,
              boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
              fontFamily: 'system-ui, sans-serif',
            }}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}