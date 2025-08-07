# Brand Images Placeholder

This directory contains the brand images for ReservApp.

## Required Images:

1. **reservapp-logo.png** - Main logo for the application
   - Recommended size: 400x120px (or maintain aspect ratio)
   - Format: PNG with transparency
   - Usage: Headers, auth pages, admin panel

2. **mobile-mockup.png** - Mobile application mockup
   - Recommended size: 600x800px or higher
   - Format: PNG with transparency preferred
   - Usage: Landing page mobile section

## Implementation:

- Logo component automatically falls back to text if image fails to load
- Mobile mockup has SVG fallback if image fails to load
- Images are optimized using Next.js Image component for performance

## To Update:

Replace these placeholder files with your actual brand images:
- Drop `reservapp-logo.png` in this directory
- Drop `mobile-mockup.png` in this directory

The application will automatically use the new images once they're in place.