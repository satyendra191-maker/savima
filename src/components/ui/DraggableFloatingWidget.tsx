import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Minus, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface DraggableFloatingWidgetProps {
  id: string;
  children: React.ReactNode;
  defaultPosition?: Position;
  snapThreshold?: number;
  className?: string;
}

export const DraggableFloatingWidget: React.FC<DraggableFloatingWidgetProps> = ({
  id,
  children,
  defaultPosition = { x: 20, y: 100 },
  snapThreshold = 20,
  className = ''
}) => {
  const [position, setPosition] = useState<Position>(() => {
    const saved = localStorage.getItem(`widget_pos_${id}`);
    return saved ? JSON.parse(saved) : defaultPosition;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const savePosition = useCallback((pos: Position) => {
    localStorage.setItem(`widget_pos_${id}`, JSON.stringify(pos));
    setPosition(pos);
  }, [id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const widgetWidth = widgetRef.current?.offsetWidth || 320;
      const widgetHeight = widgetRef.current?.offsetHeight || 400;

      // Snap to edges
      if (newX < snapThreshold) newX = 0;
      if (newX > windowWidth - widgetWidth - snapThreshold) newX = windowWidth - widgetWidth;
      if (newY < snapThreshold) newY = 0;
      if (newY > windowHeight - widgetHeight - snapThreshold) newY = windowHeight - widgetHeight;

      // Keep within bounds
      newX = Math.max(0, Math.min(newX, windowWidth - widgetWidth));
      newY = Math.max(0, Math.min(newY, windowHeight - widgetHeight));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      savePosition(position);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, snapThreshold, savePosition]);

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      let newX = touch.clientX - dragOffset.current.x;
      let newY = touch.clientY - dragOffset.current.y;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const widgetWidth = widgetRef.current?.offsetWidth || 320;
      const widgetHeight = widgetRef.current?.offsetHeight || 400;

      if (newX < snapThreshold) newX = 0;
      if (newX > windowWidth - widgetWidth - snapThreshold) newX = windowWidth - widgetWidth;
      if (newY < snapThreshold) newY = 0;
      if (newY > windowHeight - widgetHeight - snapThreshold) newY = windowHeight - widgetHeight;

      newX = Math.max(0, Math.min(newX, windowWidth - widgetWidth));
      newY = Math.max(0, Math.min(newY, windowHeight - widgetHeight));

      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      savePosition(position);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, position, snapThreshold, savePosition]);

  if (!isVisible) return null;

  return (
    <div
      ref={widgetRef}
      className={`fixed z-[100] ${className}`}
      style={{
        left: position.x,
        top: position.y,
        maxWidth: '360px'
      }}
    >
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
          overflow-hidden transition-all duration-300
          ${isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab'}
          ${isMinimized ? 'h-auto' : ''}
        `}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Header */}
        <div className="no-drag flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brass-500 to-brass-600 text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-semibold text-sm">Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <ChevronUp size={16} /> : <Minus size={16} />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`
          transition-all duration-300 overflow-hidden
          ${isMinimized ? 'max-h-0' : 'max-h-[70vh]'}
        `}>
          {children}
        </div>
      </div>

      {/* Restore Button when minimized/closed */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-brass-500 hover:bg-brass-600 text-white rounded-full shadow-lg flex items-center justify-center z-[99] animate-bounce"
        >
          <Maximize2 size={24} />
        </button>
      )}
    </div>
  );
};

export default DraggableFloatingWidget;
