# TitliAI Admin Dashboard Setup Guide

## Overview

The TitliAI Admin Dashboard is a comprehensive admin panel that provides secure access to all Firestore data including users, enrollments, payments, and workshops. It features a beautiful, responsive design that matches the TitliAI brand and includes password protection for security.

## Features

- 🔐 **Secure Access**: Password-protected admin access
- 📊 **Analytics Dashboard**: Overview of key metrics
- 👥 **User Management**: View all user data and statistics
- 🎓 **Enrollment Tracking**: Monitor workshop enrollments and progress
- 💰 **Payment Management**: Track all payment transactions
- 📚 **Workshop Management**: View workshop details and status
- 🔍 **Search & Filter**: Advanced search and filtering capabilities
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Brand Consistent**: Matches TitliAI design patterns

## Setup Instructions

### 1. Firebase Configuration

Before using the admin dashboard, you need to configure Firebase:

#### For the React Admin Page (`/admin` route):
The React admin page uses the existing Firebase configuration from `src/config/firebase.ts`.

#### For the Standalone HTML Admin Page (`admin.html`):
Update the Firebase configuration in `admin.html`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 2. Admin Password

The default admin password is: `titliAI2024!`

**Important**: Change this password in production by updating:
- `src/components/AdminPage.tsx` (line with `ADMIN_PASSWORD`)
- `admin.html` (line with `ADMIN_PASSWORD`)

### 3. Deployment

#### Option 1: React Admin Page (Recommended)
The admin page is integrated into the main React app and accessible at `/admin`:
- Includes navbar/footer for consistency
- Uses existing Firebase configuration
- Fully integrated with the app's routing

#### Option 2: Standalone HTML Admin Page
The standalone `admin.html` file can be deployed separately:
- No dependencies on the main React app
- Can be hosted on any static hosting service
- Direct access via URL (e.g., `titliAI.com/admin.html`)

## Usage

### Accessing the Admin Dashboard

1. **React Admin Page**: Navigate to `https://yourdomain.com/admin`
2. **Standalone HTML**: Navigate to `https://yourdomain.com/admin.html`

### Login

1. Enter the admin password: `titliAI2024!`
2. Click "Access Admin Dashboard"
3. The session will be maintained until you logout or close the browser

### Dashboard Features

#### 📊 Analytics Tab
- Total Users count
- Total Enrollments count
- Total Revenue calculation
- Active Workshops count

#### 👥 Users Tab
- User profiles with avatars
- Email addresses
- Geographic location data
- User statistics (enrollments, completed workshops, total spent)
- Join dates

#### 🎓 Enrollments Tab
- Enrollment IDs
- User and workshop references
- Enrollment status
- Progress tracking with visual progress bars
- Payment information
- Enrollment dates

#### 💰 Payments Tab
- Payment IDs
- User and workshop references
- Payment amounts (with currency conversion support)
- Payment status
- Payment method
- Transaction dates

#### 📚 Workshops Tab
- Workshop titles and slugs
- Difficulty levels (beginner, foundation, advanced)
- Pricing information
- Workshop status
- Duration
- Creation dates

### Search and Filter

- **Search**: Search across all fields in the current tab
- **Status Filter**: Filter by status (active, completed, pending, failed, cancelled, draft)

### Data Refresh

- Click the "🔄 Refresh" button to reload all data from Firestore
- Data is automatically sorted by date (newest first)

## Security Considerations

### Production Deployment

1. **Change Default Password**: Update the admin password in both files
2. **Environment Variables**: Consider using environment variables for the password
3. **IP Restrictions**: Consider implementing IP-based access restrictions
4. **HTTPS**: Always use HTTPS in production
5. **Firebase Security Rules**: Ensure Firestore security rules are properly configured

### Firebase Security Rules

Ensure your Firestore security rules allow admin access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin access (you may want to add additional conditions)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"Failed to load data" Error**
   - Check Firebase configuration
   - Verify Firestore security rules
   - Ensure collections exist in Firestore

2. **Authentication Issues**
   - Clear browser session storage
   - Check if password is correct
   - Verify Firebase Auth is properly configured

3. **Data Not Loading**
   - Check browser console for errors
   - Verify Firestore collections have data
   - Check network connectivity

### Debug Mode

To enable debug logging, add this to the browser console:
```javascript
localStorage.setItem('adminDebug', 'true');
```

## Customization

### Styling
The admin dashboard uses Tailwind CSS and can be customized by:
- Modifying the CSS classes in the components
- Updating the color scheme in the Tailwind config
- Adding custom CSS for specific elements

### Adding New Features
To add new features:
1. Update the tab navigation
2. Add new data loading functions
3. Create new table rendering functions
4. Update the analytics calculations

### Data Export
To add data export functionality:
1. Add export buttons to each tab
2. Implement CSV/Excel export functions
3. Add date range filters for exports

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify Firebase configuration
3. Test with a simple Firestore query
4. Check network connectivity and CORS settings

## Version History

- **v1.0.0**: Initial release with basic admin functionality
- Features: User management, enrollment tracking, payment monitoring, workshop management
- Security: Password protection, session management
- UI: Responsive design, search/filter capabilities
