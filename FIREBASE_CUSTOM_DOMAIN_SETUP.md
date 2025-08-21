# Firebase Custom Domain Setup Guide

## 🎯 Why Custom Domain?
- Avoid corporate firewall blocks on `*.web.app` domains
- More professional appearance
- Better branding and trust
- Higher accessibility from corporate networks

## 🔧 Step-by-Step Setup

### Step 1: Purchase a Domain
Recommended domains:
- `titliai.com`
- `mumeeai.com`
- `titliai.in`
- `mumeeai.in`

### Step 2: Configure Firebase Hosting

1. **Go to Firebase Console**:
   - Navigate to your project: `mumee-ai`
   - Go to Hosting section

2. **Add Custom Domain**:
   - Click "Add custom domain"
   - Enter your domain (e.g., `titliai.com`)
   - Follow the verification steps

3. **Configure DNS Records**:
   - Add A record pointing to Firebase IPs
   - Add CNAME record for www subdomain
   - Wait for DNS propagation (24-48 hours)

### Step 3: Update Your Application

1. **Update Firebase Configuration**:
   ```json
   // firebase.json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "/admin",
           "destination": "/admin.html"
         },
         {
           "source": "**",
           "destination": "/index.html"
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
             }
           ]
         }
       ]
     }
   }
   ```

2. **Deploy to Custom Domain**:
   ```bash
   npm run build
   firebase deploy
   ```

## 🌐 Alternative Hosting Options

### Option 1: Vercel (Recommended)
- Better corporate network compatibility
- Automatic HTTPS
- Global CDN
- Easy custom domain setup

### Option 2: Netlify
- Good corporate network access
- Custom domain support
- Built-in analytics

### Option 3: AWS Amplify
- Enterprise-grade hosting
- Excellent corporate network compatibility
- Advanced security features

## 🔒 Security Headers for Corporate Networks

Add these headers to improve compatibility:

```json
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
```

## 📊 Monitoring & Analytics

1. **Set up Google Analytics** to track access issues
2. **Monitor error rates** from different networks
3. **Use uptime monitoring** services
4. **Track user feedback** about access problems

## 🚀 Deployment Commands

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy

# Deploy to Vercel (alternative)
vercel --prod
```

## 📞 Support Strategy

1. **Create a status page** showing site availability
2. **Provide alternative access methods** (mobile app, API)
3. **Set up customer support** for access issues
4. **Document common solutions** for users
