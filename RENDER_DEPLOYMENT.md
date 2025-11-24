# Render Deployment Guide

## React 19 Peer Dependency Issue - RESOLVED ✅

### Problem
The application uses React 19.2.0, but `react-helmet-async@2.0.5` only supports React 16, 17, and 18. This causes npm installation to fail during deployment on Render.

### Solution
Created a `.npmrc` file with `legacy-peer-deps=true` to allow npm to bypass peer dependency conflicts.

## Deployment Steps

### 1. Ensure `.npmrc` is committed
The `.npmrc` file in the project root contains:
```
legacy-peer-deps=true
```

Make sure this file is committed to your repository:
```bash
git add .npmrc
git commit -m "Add .npmrc for React 19 compatibility"
git push
```

### 2. Render Configuration
Your Render service should use the default build command:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview` (or use a static site configuration)

The `.npmrc` file will automatically be used during `npm install` on Render.

### 3. Alternative: Manual Build Command (if needed)
If for some reason the `.npmrc` file doesn't work, you can override the build command in Render:
```bash
npm install --legacy-peer-deps && npm run build
```

## Why This Works
- The `--legacy-peer-deps` flag tells npm to use the legacy peer dependency resolution algorithm
- This allows packages with incompatible peer dependencies to be installed together
- `react-helmet-async` v2 works fine with React 19 at runtime; the peer dependency restriction is overly conservative

## Future Considerations
When `react-helmet-async` releases a version that officially supports React 19, you can:
1. Remove the `.npmrc` file
2. Update `react-helmet-async` to the newer version
3. Run `npm install` normally

## Verification
After deployment, verify that:
1. The build completes successfully on Render
2. The application loads correctly
3. SEO meta tags are working (check page source)
