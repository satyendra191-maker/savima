import React, { useState, useRef, useEffect } from 'react';

// Placeholder SVG for when images fail to load
const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#1E293B"/>
  <rect x="350" y="250" width="100" height="100" rx="8" fill="#334155"/>
  <path d="M380 290 L420 290 L420 330 L380 330 Z" fill="#475569"/>
  <circle cx="470" cy="280" r="15" fill="#64748B"/>
  <text x="400" y="400" text-anchor="middle" fill="#94A3B8" font-family="Arial" font-size="16">Image unavailable</text>
</svg>
`)}`;

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    className?: string;
    fallbackClassName?: string;
    loading?: 'lazy' | 'eager';
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * Image component with fallback for broken images
 * Handles loading states and provides graceful degradation
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    alt,
    className = '',
    fallbackClassName = '',
    loading = 'lazy',
    onLoad,
    onError,
}) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Reset state when src changes
        setHasError(false);
        setIsLoading(true);
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
        onError?.();
    };

    if (hasError) {
        return (
            <div
                className={`${className} ${fallbackClassName} bg-slate-800 flex items-center justify-center overflow-hidden`}
                role="img"
                aria-label={alt}
            >
                <img
                    src={PLACEHOLDER_SVG}
                    alt={alt}
                    className="w-full h-full object-cover opacity-70"
                />
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            {isLoading && (
                <div className={`${className} absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse`} />
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                loading={loading}
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};

// Product image placeholder
export const PRODUCT_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#F8FAFC"/>
  <rect x="150" y="100" width="100" height="100" rx="8" fill="#E2E8F0"/>
  <circle cx="200" cy="150" r="30" fill="#CBD5E1"/>
  <text x="200" y="230" text-anchor="middle" fill="#64748B" font-family="Arial" font-size="12">Product Image</text>
</svg>
`)}`;

// Factory/industrial placeholder
export const FACTORY_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(`
<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#0F172A"/>
  <rect x="100" y="300" width="150" height="200" fill="#1E293B"/>
  <rect x="280" y="250" width="120" height="250" fill="#1E293B"/>
  <rect x="430" y="200" width="100" height="300" fill="#1E293B"/>
  <rect x="560" y="280" width="140" height="220" fill="#1E293B"/>
  <rect x="120" y="320" width="30" height="40" fill="#334155"/>
  <rect x="170" y="320" width="30" height="40" fill="#334155"/>
  <rect x="300" y="280" width="25" height="35" fill="#334155"/>
  <rect x="340" y="280" width="25" height="35" fill="#334155"/>
  <text x="400" y="550" text-anchor="middle" fill="#64748B" font-family="Arial" font-size="14">Manufacturing Facility</text>
</svg>
`)}`;

export default ImageWithFallback;