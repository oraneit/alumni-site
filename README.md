# Orane Alumni Network

A modern, responsive website for the Orane International Alumni Network.

## Features

- **Alumni Registration**: Form with photo upload, social links, and profile details
- **Alumni Directory**: Searchable directory with filtering by year, country, and profession
- **Success Stories**: Alumni spotlight carousel
- **Live Updates**: RSS feed integration for latest workshops and opportunities
- **Mobile Responsive**: Optimized for all device sizes

## Structure

- `index.html` - Main landing page with registration form
- `directory.html` - Alumni directory with search and filters
- `assets/` - Stylesheets and JavaScript files
- `images/` - Alumni photos and assets
- `netlify/functions/` - Serverless functions for data fetching
- `scripts/` - Build scripts for feed generation

## Configuration

### Google Apps Script Endpoint
The form submissions are handled by Google Apps Script. The endpoint is configured in `index.html`.

### App Store Links
To enable app download section in `index.html`, uncomment the app-links section and update the URLs.

### Environment Variables
- `SITE_BASE_URL` - Used by feed generation script

## Development

1. Clone the repository
2. Open `index.html` in a browser or serve with a local server
3. For Netlify functions, use `netlify dev`

## Deployment

The site is configured for Netlify deployment with:
- Automatic builds
- Serverless functions
- Form handling via Google Apps Script

## Files Overview

- **Main Pages**: `index.html`, `directory.html`, `privacy.html`, `thanks.html`
- **Data**: `content.json`, `updates.json`, `feed.json`, `assets/data/alumni.json`
- **Scripts**: `updates.js`, `updates-fetch.js`, `scripts/gen_feed.py`
- **Functions**: `netlify/functions/learnworlds-updates.js`

## Bug Fixes Applied

- Removed missing image references
- Commented out incomplete app store section
- Fixed empty endpoint configurations
- Removed development console.log statements
- Cleaned up duplicate/backup files