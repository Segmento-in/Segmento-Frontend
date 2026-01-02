# Git Push Guide: Frontend to Segmento-Frontend Repository

## Current Setup ✅

Your `frontend` folder now has two Git remotes:
- **origin**: `https://github.com/ShafiSk17/ShafiSk17-Segmento-PII-Detection-website.git`
- **segmento-frontend**: `https://github.com/ShafiSk17/Segmento-Frontend.git` (NEW)

## Environment Configuration

Your `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=https://workwithshafisk-segmento-sense-backend.hf.space
```

**Important**: `.env.local` is already gitignored (correct behavior), so it won't be pushed to the repository.

## Deployment Note for Vercel

When deploying on Vercel, you need to add the environment variable in Vercel's dashboard:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add: `NEXT_PUBLIC_API_URL` = `https://workwithshafisk-segmento-sense-backend.hf.space`

## Push to Segmento-Frontend (Step-by-Step)

### Step 1: Check Current Status
```bash
git status
```

### Step 2: Add All Changes
```bash
git add .
```

### Step 3: Commit Your Changes
```bash
git commit -m "Add PII Detection demo page with FastAPI integration

- Replaced lovable app with full PII detection platform
- Added comprehensive API client (apiClient.ts)
- Created all demo components (SourceSidebar, FileUpload, PIIAnalytics, Inspector)
- Implemented chess-themed loading animation
- Added support for all file types (CSV, JSON, PDF, Image OCR, Parquet, Avro)
- Premium UI with professional color scheme
- Fixed Recharts TypeScript errors
- Integrated with HuggingFace backend API"
```

### Step 4: Push to Segmento-Frontend
```bash
git push segmento-frontend main
```

**Note**: If the branch names don't match, you might need:
```bash
git push segmento-frontend main:main --force
```

Or if the remote has a different default branch:
```bash
git push segmento-frontend main:master --force
```

## Alternative: Push to Both Repositories

If you want to keep both repositories updated:

### Push to Current Origin
```bash
git push origin main
```

### Push to Segmento-Frontend
```bash
git push segmento-frontend main
```

## Quick Commands (Copy & Paste)

```bash
# Navigate to frontend directory
cd c:\Users\Dell\Desktop\Segmento-app-website-dev\frontend

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Add PII Detection demo with FastAPI backend integration"

# Push to Segmento-Frontend
git push segmento-frontend main

# If you get errors about divergent branches, use force push:
git push segmento-frontend main --force
```

## Post-Push: Vercel Deployment

Once pushed, Vercel will automatically:
1. Detect the changes in the Segmento-Frontend repository
2. Trigger a new deployment
3. Build and deploy your updated frontend

**Don't forget**:
- Add `NEXT_PUBLIC_API_URL` environment variable in Vercel dashboard
- The backend should already be running on HuggingFace Spaces

## Files Added/Modified

### New Components
- `components/pii-demo/ChessLoadingAnimation.tsx`
- `components/pii-demo/SourceSidebar.tsx`
- `components/pii-demo/FileUpload.tsx`
- `components/pii-demo/PIIAnalytics.tsx`
- `components/pii-demo/Inspector.tsx`

### Modified Files
- `app/products/data-classification/page.tsx` (completely replaced)
- `lib/apiClient.ts` (new file)

### Configuration
- `package.json` (added recharts dependency)
- `ENV_CONFIG.md` (environment setup documentation)

## Verification Checklist

Before pushing:
- ✅ All TypeScript errors fixed
- ✅ Build completes successfully (`npm run build`)
- ✅ Dev server runs without errors
- ✅ Demo page loads at `/products/data-classification`
- ✅ `.env.local` exists with correct API URL

After pushing:
- ⏳ Vercel deployment completes
- ⏳ Add environment variable in Vercel
- ⏳ Test production deployment
- ⏳ Verify API connectivity with HuggingFace backend
