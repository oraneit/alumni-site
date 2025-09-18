# Alumni Directory Troubleshooting Guide

## Issue: Directory not updating with new profiles

The directory.html page loads alumni profiles from Google Apps Script, but new submissions aren't appearing. Here's how to fix it:

## Step 1: Check Google Apps Script Deployment

1. **Open Google Apps Script Console**: https://script.google.com/
2. **Find your project**: Look for "Orane Alumni Database" or similar
3. **Check the script code**: Ensure it matches the updated `google-apps-script.js` file
4. **Redeploy the web app**:
   - Click "Deploy" → "New deployment"
   - Choose "Web app" as type
   - Set "Execute as": **Me (your email)**
   - Set "Who has access": **Anyone** (important!)
   - Click "Deploy"
   - **Copy the new Web App URL** - this might be different!

## Step 2: Update the Endpoint URL

If you got a new Web App URL, update it in both files:

**In directory.html:**
```javascript
const ENDPOINT = "YOUR_NEW_WEB_APP_URL_HERE";
```

**In index.html (form submission):**
```javascript
const ENDPOINT = "YOUR_NEW_WEB_APP_URL_HERE";
```

## Step 3: Test the Debug Page

1. Open `debug-directory.html` in your browser
2. Click "Test Endpoint" to see if the script responds
3. Check the browser console (F12) for any errors
4. If it fails, try "Test with Proxy"

## Step 4: Check Google Sheets Permissions

1. **Find your spreadsheet**: Look for "Orane Alumni Database" in Google Drive
2. **Check sharing settings**: 
   - Right-click → Share
   - Ensure the script owner has edit access
   - The sheet should be accessible to the script

## Step 5: Verify Data Structure

Open your Google Sheet and check:
- **Headers match**: First row should have: Timestamp, First Name, Last Name, Email, etc.
- **Data exists**: There should be actual form submissions below the headers
- **Photo URLs**: Check if the Photo URL column has valid Google Drive links

## Step 6: Clear Browser Cache

The directory might be cached:
1. **Hard refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache**: Browser settings → Clear browsing data
3. **Incognito mode**: Test in a private/incognito window

## Step 7: Check Console Logs

1. Open directory.html
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for error messages or success logs
5. The console should show: "Loaded X alumni profiles via [method]"

## Common Issues & Solutions

### "Load failed: Invalid response from server"
- **Cause**: Script not deployed properly or wrong permissions
- **Fix**: Redeploy with correct permissions (Step 1)

### "No profiles found"
- **Cause**: Empty spreadsheet or wrong sheet name
- **Fix**: Check if form submissions are actually saving to the sheet

### "CORS error" or "Access denied"
- **Cause**: Script permissions or sharing settings
- **Fix**: Ensure "Who has access" is set to "Anyone"

### Photos not showing
- **Cause**: Google Drive sharing permissions
- **Fix**: Photos should be shared with "Anyone with the link"

## Testing New Submissions

1. **Submit a test profile** through index.html
2. **Check Google Sheets** - new row should appear immediately
3. **Refresh directory.html** - new profile should appear
4. **Check browser console** for any errors

## Manual Verification Steps

1. **Google Apps Script Logs**:
   - In Apps Script editor, go to "Executions"
   - Check recent executions for errors

2. **Test the GET endpoint directly**:
   ```
   https://your-script-url/exec?list=1
   ```
   Should return JSON with alumni data

3. **Check spreadsheet data**:
   - Verify column headers match expected format
   - Ensure no empty rows at the top
   - Check for special characters in data

## If Still Not Working

1. **Create a new deployment**:
   - Delete old deployment
   - Create fresh deployment with new URL
   - Update both HTML files with new URL

2. **Check Google Account Permissions**:
   - Ensure you're logged into the correct Google account
   - Script owner must have access to both Drive and Sheets

3. **Test with minimal data**:
   - Add a simple test row manually to the sheet
   - See if it appears in the directory

## Success Indicators

✅ Debug page shows alumni data  
✅ Console logs show "Loaded X alumni profiles"  
✅ New form submissions appear in Google Sheets  
✅ Directory refreshes show new profiles  
✅ Photos display correctly (if uploaded)  

## Need Help?

If the issue persists:
1. Check the browser console for specific error messages
2. Verify the Google Apps Script execution logs
3. Ensure all permissions are correctly set
4. Try the debug page to isolate the issue