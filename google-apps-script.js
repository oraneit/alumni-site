// Google Apps Script code for handling alumni form submissions with photo upload
// Deploy this as a web app with "Execute as: Me" and "Who has access: Anyone"

function doPost(e) {
  try {
    // Get the form data
    const formData = e.parameter;
    const fileBlob = e.parameters.photo && e.parameters.photo[0] ? 
      Utilities.newBlob(
        Utilities.base64Decode(e.parameters.photo[0].split(',')[1]), 
        e.parameters.photo[0].split(';')[0].split(':')[1],
        `${formData.first_name}_${formData.last_name}_${Date.now()}.jpg`
      ) : null;

    // Get or create the Alumni folder in Google Drive
    const alumniFolder = getOrCreateAlumniFolder();
    
    // Save photo to Google Drive if provided
    let photoUrl = '';
    if (fileBlob && fileBlob.getSize() > 0) {
      const photoFile = alumniFolder.createFile(fileBlob);
      photoFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      photoUrl = photoFile.getDownloadUrl();
    }

    // Get or create the spreadsheet
    const sheet = getOrCreateSpreadsheet();
    
    // Prepare row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      formData.first_name || '',
      formData.last_name || '',
      formData.email || '',
      formData.whatsapp || '',
      formData.graduating_year || '',
      formData.country || '',
      formData.city || '',
      formData.profession || '',
      formData.instagram || '',
      formData.facebook || '',
      formData.linkedin || '',
      formData.snapchat || '',
      formData.anything_else || '',
      photoUrl,
      formData.user_agent || ''
    ];

    // Add row to spreadsheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        message: 'Registration successful!',
        photoSaved: !!photoUrl
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');

  } catch (error) {
    console.error('Error processing form:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function doGet(e) {
  // Handle GET requests for listing alumni (for directory)
  try {
    console.log('doGet called with parameters:', e.parameter);
    
    const action = e.parameter.action || e.parameter.list;
    console.log('Action detected:', action);
    
    if (action === '1' || action === 'alumni') {
      const sheet = getOrCreateSpreadsheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length === 0) {
        console.log('No data found in spreadsheet');
        return ContentService
          .createTextOutput(JSON.stringify({
            ok: true,
            rows: [],
            message: 'No data found'
          }))
          .setMimeType(ContentService.MimeType.JSON)
          .setHeader('Access-Control-Allow-Origin', '*')
          .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          .setHeader('Access-Control-Allow-Headers', 'Content-Type');
      }
      
      const headers = data[0];
      const rows = data.slice(1);
      console.log('Found', rows.length, 'rows of data');
      
      const alumni = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          const key = header.toLowerCase().replace(/\s+/g, '_');
          obj[key] = row[index] || '';
        });
        return obj;
      }).filter(alumni => {
        // Filter out empty rows
        return alumni.first_name || alumni.last_name || alumni.email;
      });

      console.log('Returning', alumni.length, 'alumni profiles');

      return ContentService
        .createTextOutput(JSON.stringify({
          ok: true,
          rows: alumni,
          count: alumni.length,
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*')
        .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    // Handle callback parameter for JSONP
    const callback = e.parameter.callback;
    const response = {
      ok: false,
      error: 'Invalid action. Use ?list=1 to get alumni directory.'
    };

    const jsonResponse = callback ? 
      `${callback}(${JSON.stringify(response)})` : 
      JSON.stringify(response);

    return ContentService
      .createTextOutput(jsonResponse)
      .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');

  } catch (error) {
    console.error('doGet error:', error);
    
    const callback = e.parameter.callback;
    const response = {
      ok: false,
      error: error.toString(),
      stack: error.stack
    };

    const jsonResponse = callback ? 
      `${callback}(${JSON.stringify(response)})` : 
      JSON.stringify(response);

    return ContentService
      .createTextOutput(jsonResponse)
      .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function getOrCreateAlumniFolder() {
  const folderName = 'Orane Alumni Photos';
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

function getOrCreateSpreadsheet() {
  const sheetName = 'Orane Alumni Database';
  const files = DriveApp.getFilesByName(sheetName);
  
  let spreadsheet;
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(sheetName);
  }
  
  const sheet = spreadsheet.getActiveSheet();
  
  // Set up headers if this is a new sheet
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'First Name',
      'Last Name', 
      'Email',
      'WhatsApp',
      'Graduating Year',
      'Country',
      'City',
      'Profession',
      'Instagram',
      'Facebook',
      'LinkedIn',
      'Snapchat',
      'Additional Info',
      'Photo URL',
      'User Agent'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  
  return sheet;
}

// Handle OPTIONS requests for CORS
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}