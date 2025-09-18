# Google Apps Script Setup for Photo Upload

## Problem
The current photo upload isn't saving to Google Drive because the Google Apps Script isn't properly configured to handle file uploads.

## Solution
Follow these steps to set up the Google Apps Script properly:

### Step 1: Create New Google Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`

### Step 2: Configure the Script
1. **Set Project Name**: Click "Untitled project" and rename to "Orane Alumni Form Handler"

2. **Enable Required APIs**:
   - Click on "Services" (+ icon) in the left sidebar
   - Add "Google Drive API" 
   - Add "Google Sheets API"

### Step 3: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Choose type: "Web app"
3. **Execute as**: "Me" (your Google account)
4. **Who has access**: "Anyone" 
5. Click "Deploy"
6. **Copy the Web App URL** - this is your new ENDPOINT

### Step 4: Update Frontend Code
Replace the ENDPOINT URL in `index.html` with your new Web App URL:

```javascript
const ENDPOINT = "YOUR_NEW_WEB_APP_URL_HERE";
```

### Step 5: Test the Setup
1. Submit a test form with a photo
2. Check that:
   - A "Orane Alumni Photos" folder is created in your Google Drive
   - Photos are saved in that folder
   - A "Orane Alumni Database" spreadsheet is created
   - Form data is recorded in the spreadsheet

## Key Features of the New Script

### Photo Handling
- ✅ Creates "Orane Alumni Photos" folder in Google Drive
- ✅ Saves uploaded photos with descriptive names
- ✅ Sets proper sharing permissions for photos
- ✅ Returns photo URL in response

### Data Storage
- ✅ Creates "Orane Alumni Database" spreadsheet
- ✅ Stores all form data including photo URLs
- ✅ Handles both GET (for directory) and POST (for submissions)

### Error Handling
- ✅ Proper CORS headers for web requests
- ✅ Detailed error messages
- ✅ Graceful handling of missing photos

### Security
- ✅ File size validation
- ✅ Proper file type handling
- ✅ Safe base64 encoding/decoding

## Troubleshooting

### If photos still don't upload:
1. Check Google Apps Script execution logs
2. Verify the Web App is deployed with correct permissions
3. Ensure Google Drive API is enabled
4. Test with smaller image files first

### If you get CORS errors:
1. Make sure the Web App is set to "Anyone" access
2. Redeploy the Web App after making changes
3. Clear browser cache and try again

### If the spreadsheet isn't created:
1. Check Google Sheets API is enabled
2. Verify script has permission to create files
3. Check the execution transcript in Apps Script

## File Structure After Setup
```
Google Drive/
├── Orane Alumni Photos/          # Photo uploads
│   ├── John_Doe_1640995200000.jpg
│   └── Jane_Smith_1640995300000.jpg
└── Orane Alumni Database         # Spreadsheet with all data
```

The new setup provides much better error handling, proper photo storage, and detailed feedback to users about their submission status.