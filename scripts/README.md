# Firestore to Excel Export Script

This script allows you to export Firestore collections to Excel format for easy analysis and management.

## Setup

### 1. Install Dependencies
```bash
cd scripts
npm install
```

### 2. Get Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Rename it to `firebase-service-account.json`
7. Place it in the `mumee-ai` root directory (not in scripts folder)

## Usage

### Export All Collections
```bash
npm run export
```
This will export:
- users
- enrollments  
- payments
- workshops

### Export Specific Collection
```bash
# Export users only
npm run export-users

# Export enrollments only
npm run export-enrollments

# Export payments only
npm run export-payments

# Export workshops only
npm run export-workshops
```

### Direct Node Commands
```bash
# Export all collections
node export-firestore-to-excel.js

# Export specific collection
node export-firestore-to-excel.js users
node export-firestore-to-excel.js enrollments
node export-firestore-to-excel.js payments
node export-firestore-to-excel.js workshops
```

## Output

Excel files will be created in the `exports/` folder:
- `users-export.xlsx`
- `enrollments-export.xlsx`
- `payments-export.xlsx`
- `workshops-export.xlsx`

## Features

- ✅ **Flattens nested objects** for Excel compatibility
- ✅ **Handles Firestore Timestamps** (converts to ISO strings)
- ✅ **Includes Document IDs** for reference
- ✅ **Error handling** for missing collections
- ✅ **Progress logging** during export

## Data Format

The exported Excel files will contain:
- **Document ID** - The Firestore document ID
- **All fields** from the document (flattened)
- **Nested objects** as dot-notation (e.g., `profile.firstName`)
- **Timestamps** as ISO strings

## Example Output Structure

### Users Export
| Document ID | uid | displayName | email | createdAt | updatedAt | profile.firstName | profile.lastName | ... |
|-------------|-----|-------------|-------|-----------|-----------|------------------|------------------|-----|
| FaCJShKawyLGIvubhisO1608JEt2 | FaCJShKawyLGIvubhisO1608JEt2 | John Doe | john@example.com | 2024-01-15T10:30:00.000Z | 2024-01-15T10:30:00.000Z | John | Doe | ... |

### Enrollments Export
| Document ID | userId | workshopId | status | enrolledAt | payment.amount | payment.currency | ... |
|-------------|--------|------------|--------|------------|----------------|------------------|-----|
| enroll_123 | FaCJShKawyLGIvubhisO1608JEt2 | advanced-workshop | active | 2024-01-15T10:30:00.000Z | 5999 | INR | ... |

## Troubleshooting

### Error: "Cannot find module 'firebase-service-account.json'"
- Make sure the service account JSON file is in the `mumee-ai` root directory
- Check that the file name is exactly `firebase-service-account.json`

### Error: "Permission denied"
- Make sure your Firebase service account has read access to Firestore
- Check that the service account key is valid

### Error: "Collection not found"
- The script will skip collections that don't exist
- Check your Firestore console to see available collections

## Security Note

⚠️ **Important**: The `firebase-service-account.json` file contains sensitive credentials. 
- Never commit this file to version control
- Add it to your `.gitignore` file
- Keep it secure and don't share it publicly 