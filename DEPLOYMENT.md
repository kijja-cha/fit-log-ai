# 🚀 Deployment Guide - Vercel

## Pre-deployment Checklist

### ✅ **Code Quality**

- [x] TypeScript compilation passes
- [x] ESLint and Prettier formatting
- [x] Production build successful
- [x] All console.log statements removed
- [x] Environment variables configured

### ✅ **Performance Optimizations**

- [x] Next.js 14 App Router with SSG
- [x] Image optimization configured
- [x] Bundle size optimized (321kB main bundle)
- [x] Firebase lazy loading implemented
- [x] Recharts for efficient charting

## 🔧 Environment Setup

### 1. Create Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 2. Firebase Configuration (Required)

**⚠️ All environment variables are required - no fallback values:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Build will fail if any variables are missing with clear error message.**

## 🚀 Vercel Deployment

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
# ... add all other env vars

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables in Vercel settings
4. Deploy automatically on push

## 📝 Vercel Configuration

The project includes `vercel.json` with optimized settings:

- Build command: `npm run build`
- Output directory: `.next`
- Singapore region (sin1) for SEO
- Function timeout: 10 seconds
- Framework: Next.js

## 🔍 Build Verification

Test local production build:

```bash
npm run build
npm start
```

Expected output:

- ✅ Build successful
- ✅ Static pages generated
- ✅ Bundle size under 400kB
- ✅ No TypeScript errors

## 🎯 Production Features

### Performance

- **Static Generation**: Pre-rendered pages for speed
- **Code Splitting**: Automatic by Next.js
- **Image Optimization**: Built-in Next.js feature
- **Bundle Size**: Optimized at 321kB

### Security

- **Environment Variables**: Sensitive data in env vars
- **Client-side Firebase**: Secure configuration
- **HTTPS**: Automatic with Vercel

### Monitoring

- **Error Boundaries**: React error handling
- **Toast Notifications**: User feedback
- **Loading States**: Better UX

## 🐛 Troubleshooting

### Common Issues

**Build fails with Firebase error:**

```bash
# Fix: Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Environment variables not working:**

- Ensure they start with `NEXT_PUBLIC_`
- Check Vercel dashboard settings  
- Redeploy after adding variables

**Build fails with "Missing required Firebase environment variables":**

```bash
# Check which variables are missing in error message
# Example error: Missing required Firebase environment variables: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID

# Set missing variables in Vercel dashboard or .env.local
# Then rebuild
npm run build
```

**Webpack bundle size warnings:**

- Already optimized with tree-shaking
- Firebase imports are lazy-loaded
- Charts library is code-split

## 📊 Performance Metrics

Expected Lighthouse scores:

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 100
- **SEO**: 95+

## 🔄 CI/CD Pipeline

Automatic deployment on:

- Push to `main` branch
- Pull request preview deployments
- Environment variable changes

## 📁 File Structure

```
fit-log-ai/
├── .vercel/              # Vercel configuration
├── .next/                # Next.js build output
├── src/
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   ├── services/         # API services
│   └── types/            # TypeScript types
├── vercel.json           # Vercel settings
├── .env.example          # Environment template
└── package.json          # Dependencies
```

---

**Happy Deploying! 🎉**

For support, check:

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
