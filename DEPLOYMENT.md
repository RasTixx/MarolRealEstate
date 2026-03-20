# Deployment Guide

This document explains how to deploy the Marolreal.sk application and fix the 404 routing issues.

## The Problem

Single-Page Applications (SPAs) like this React app handle routing on the client side. When you navigate to `/admin/login` directly in the browser, the web server looks for a file at that path and returns a 404 error because the file doesn't exist. The routing should be handled by React Router instead.

## Solutions by Hosting Platform

### Option 1: Vercel (Recommended)

If deploying to Vercel, the `vercel.json` file is already configured. Just run:

```bash
npm run build
vercel deploy
```

### Option 2: Netlify

If deploying to Netlify, the `public/_redirects` file is already configured. Just run:

```bash
npm run build
netlify deploy --prod
```

### Option 3: Apache Server

If using Apache, upload the `public/.htaccess` file to your server's root directory alongside the built files. Make sure:

1. `mod_rewrite` is enabled on your Apache server
2. `AllowOverride All` is set in your Apache configuration
3. The `.htaccess` file is in the same directory as `index.html`

Then build and upload:

```bash
npm run build
# Upload the contents of the 'dist' folder to your server
```

### Option 4: Nginx Server

If using Nginx, use the provided `nginx.conf` as a reference. Update your Nginx site configuration:

1. Copy the relevant sections from `nginx.conf` to your Nginx site config (usually in `/etc/nginx/sites-available/`)
2. Update the `root` path to point to your build directory
3. Test the configuration: `nginx -t`
4. Reload Nginx: `systemctl reload nginx`

Then build and upload:

```bash
npm run build
# Upload the contents of the 'dist' folder to your server root directory
```

### Option 5: Other Hosting Providers

For other providers, ensure they have SPA fallback configured. The key is to redirect all requests to `index.html` so React Router can handle the routing.

## Testing Locally

To test the production build locally:

```bash
npm run build
npm run preview
```

Then navigate to `http://localhost:4173/admin/login` to verify routing works correctly.

## Current Setup

Based on the domain `marolreal.sk` shown in your screenshot, you're likely using a traditional web server (Apache or Nginx). Follow the appropriate steps above based on your server type.

## Need Help?

If you're unsure which option applies to your setup, check with your hosting provider or server administrator to determine which web server you're using.
