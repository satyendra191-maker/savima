# UI Issues Report

## Overview
This document captures UI issues identified during manual verification of the application running at `http://localhost:5173`.

## Verification Date
2026-02-22

## Issues

| Page | Issue Description | Severity | Suggested Fix |
|------|-------------------|----------|---------------|
| Footer | Copyright year shows "© 2020" - hardcoded and outdated | Medium | Make year dynamic using `new Date().getFullYear()` |
| Hero (Home) | "Watch Factory Tour" button has no functionality - just a placeholder | Medium | Add onClick handler to open video modal or link to factory tour page |
| Home/About | Stats inconsistency: Hero shows "30+ Years", About page shows "34+ Years" | Low | Standardize stats across all pages |
| Hero (Home) | Animation classes `delay-100`, `delay-200`, `delay-300` used but not defined in Tailwind config | Medium | Add these animation delay utilities to tailwind.config.js |
| Mobile Menu | Animation `animate-slide-in-right` used but not defined in Tailwind config | Medium | Add keyframes for slide-in-right animation |
| Search Overlay | Search functionality not implemented - only shows placeholder text | High | Implement actual search logic with ProductService |
| Layout | Focus visible ring uses `ring-offset-2` which may not be visible on all backgrounds | Low | Improve focus indicator visibility or add distinct focus styles |
| Quote Calculator | Fixed button width may cut off label "Instant Quote" on small screens | Low | Use icon-only on mobile or adjust button sizing |
| Products Page | Loading state shows simple spinner - could benefit from skeleton loader | Low | Add skeleton loading component during data fetch |
| Contact Form | File upload shows generic error messages - could be more user-friendly | Low | Add specific error messages for different failure scenarios |
| Navigation | Mobile menu z-index (z-[60]) may conflict with other fixed elements | Low | Review and standardize z-index values across components |
| Layout | AnnouncementBar appears above navbar on scroll - may need z-index adjustment | Low | Verify z-index layering is correct |

## Accessibility Findings

| Issue | Severity | Location | Recommendation |
|-------|----------|----------|----------------|
| Missing ARIA labels on some icon-only buttons | Medium | Navbar, Widgets | Add aria-label to icon buttons |
| "Watch Factory Tour" button has no accessible name | Medium | Hero | Add aria-label or convert to proper button |
| Search input in overlay lacks proper labeling | Medium | SearchOverlay | Add aria-label or associated label |
| Color contrast in dark mode footer links | Low | Footer | Verify #B59021 (brass-600) meets WCAG AA on dark backgrounds |

## Design Inconsistencies

1. **Stat Numbers**: Different pages show inconsistent numbers (30+ vs 34+ years, 500+ vs 500+ clients)
2. **Color Usage**: Mix of `brass-500`, `brass-600`, and `amber-500` for similar accents
3. **Spacing**: Some sections use inconsistent padding (py-20 vs py-24)
4. **Button Styles**: Mix of `btn-primary`, `btn-outline`, and inline button styles

## Recommended Updates Priority

### High Priority
1. Implement search functionality
2. Fix or remove non-functional "Watch Factory Tour" button
3. Add missing Tailwind animation utilities

### Medium Priority
4. Standardize statistics across all pages
5. Fix copyright year to be dynamic
6. Add proper ARIA labels to interactive elements

### Low Priority
7. Improve focus visibility
8. Add skeleton loaders for products
9. Review and standardize z-index values
10. Consolidate button and color usage

## Testing Notes
- Application runs successfully at http://localhost:5173
- Dark mode toggle works correctly
- Language switcher is present
- Mobile responsive menu functions properly
- All major routes are accessible (/, /about, /products, /contact, /careers, etc.)
