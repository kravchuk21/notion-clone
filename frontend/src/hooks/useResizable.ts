import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizableOptions {
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  onWidthChange: (width: number) => void;
  direction?: 'left' | 'right';
}

interface UseResizableReturn {
  width: number;
  isResizing: boolean;
  startResize: (e: React.MouseEvent) => void;
}

export function useResizable({
  minWidth,
  maxWidth,
  defaultWidth,
  onWidthChange,
  direction = 'left',
}: UseResizableOptions): UseResizableReturn {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const delta = direction === 'left' 
        ? startXRef.current - e.clientX
        : e.clientX - startXRef.current;
      
      const newWidth = Math.min(
        Math.max(startWidthRef.current + delta, minWidth),
        maxWidth
      );

      setWidth(newWidth);
    },
    [isResizing, minWidth, maxWidth, direction]
  );

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      onWidthChange(width);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isResizing, width, onWidthChange]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  // Sync with external width changes
  useEffect(() => {
    setWidth(defaultWidth);
  }, [defaultWidth]);

  return {
    width,
    isResizing,
    startResize,
  };
}

