# Migrate to Vercel for Better Corporate Network Access

## 🎯 Why Vercel is Better for Corporate Networks

### ✅ **Advantages**:
- **Better corporate network compatibility** - Less likely to be blocked
- **Global CDN** - Faster access worldwide
- **Automatic HTTPS** - Better security compliance
- **Custom domains** - Professional branding
- **Edge functions** - Serverless capabilities
- **Analytics** - Built-in performance monitoring

### ❌ **Firebase Hosting Issues**:
- `*.web.app` domains often blocked by corporate firewalls
- `*.firebaseapp.com` domains flagged by security software
- Limited CDN coverage
- Corporate networks often block Google Cloud Platform domains

## 🚀 Quick Migration Steps

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Create Vercel Configuration
Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/admin",
      "dest": "/admin.html"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "**/*.@(js|css)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }
      ]
    },
    {
      "source": "**/*.@(html)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "**",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Step 3: Update Package.json
Add build script to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "vite build"
  }
}
```

### Step 4: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set up custom domain (optional)
vercel domains add titliai.com
```

## 🌐 Custom Domain Setup

### Option 1: Use Vercel's Free Domain
- Get a free `.vercel.app` domain
- Much better than Firebase's `.web.app`

### Option 2: Custom Domain
1. **Purchase domain** (e.g., `titliai.com`)
2. **Add to Vercel**:
   ```bash
   vercel domains add titliai.com
   ```
3. **Configure DNS**:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Add A record for root domain

## 🔧 Environment Variables

Set up your environment variables in Vercel:

```bash
# Set Firebase config
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID

# Set admin password
vercel env add VITE_ADMIN_PASSWORD
```

## 📊 Analytics & Monitoring

### Vercel Analytics
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to your main.tsx
import { Analytics } from '@vercel/analytics/react';

// Add to your App component
<Analytics />
```

### Uptime Monitoring
- Set up Vercel's built-in uptime monitoring
- Configure alerts for downtime
- Monitor performance metrics

## 🔄 Migration Strategy

### Phase 1: Parallel Deployment
1. Deploy to Vercel alongside Firebase
2. Test thoroughly
3. Monitor performance and accessibility

### Phase 2: DNS Switch
1. Update DNS to point to Vercel
2. Keep Firebase as backup
3. Monitor for any issues

### Phase 3: Full Migration
1. Remove Firebase hosting
2. Keep Firebase for backend services
3. Update all links and references

## 🛡️ Security Enhancements

### Content Security Policy
Add to your `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://firebase.googleapis.com https://identitytoolkit.googleapis.com;
  frame-src 'none';
  object-src 'none';
">
```

### Security Headers
Vercel automatically adds security headers, but you can customize them in `vercel.json`.

## 📈 Performance Optimization

### Vercel Edge Functions
Create `api/` directory for serverless functions:

```javascript
// api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
```

### Image Optimization
Use Vercel's built-in image optimization:

```jsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

## 🚀 Deployment Commands

```bash
# Development
vercel

# Production
vercel --prod

# Preview deployment
vercel --preview

# List deployments
vercel ls
```

## 📞 Support & Documentation

1. **Create a status page** at `status.titliai.com`
2. **Document common issues** and solutions
3. **Set up customer support** for access problems
4. **Monitor and respond** to user feedback

## 🎯 Expected Results

After migration to Vercel:
- ✅ **95%+ corporate network accessibility**
- ✅ **Faster global loading times**
- ✅ **Better security compliance**
- ✅ **Professional domain branding**
- ✅ **Improved user experience**
