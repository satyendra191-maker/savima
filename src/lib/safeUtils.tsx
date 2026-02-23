import type { ReactNode, ComponentType, FC } from 'react';

export const DEFAULT_ICON = '📦';

export function safeArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data;
}

export function safeObject<T extends Record<string, unknown>>(obj: unknown, fallback: T): T {
  if (!obj || typeof obj !== 'object') return fallback;
  return obj as T;
}

export function safeMap<T, R>(
  arr: unknown,
  fn: (item: T, index: number) => R
): R[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(fn);
}

export function getSafeIcon(icon: unknown): string {
  if (!icon) return DEFAULT_ICON;
  if (typeof icon === 'string') return icon;
  return DEFAULT_ICON;
}

export function getOptionalIcon(icon: unknown, fallback: ReactNode = null): ReactNode {
  if (!icon) return fallback;
  return icon as ReactNode;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  fallback: ReactNode = null
): FC<P> {
  return (props: P) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.warn(`Error rendering ${Component.name}:`, error);
      return <>{fallback}</>;
    }
  };
}

export function logProductionWarning(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'production') {
    console.warn(`[PRODUCTION WARNING] ${context}:`, error);
  }
}
