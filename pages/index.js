function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return sendCorsResponse({ error: "Ingen data mottagen eller felaktig förfrågan." });
    }

    // ✅ Parse URL-encoded form data
    var params = parseFormData(e.postData.contents);

    // ✅ Use the correct Spreadsheet ID
    var sheet = SpreadsheetApp.openById("1ZqUxQm96Arh4q7j54UeZQtUUvJtmIKJkZtZvuNq9fDQ").getActiveSheet();

    sheet.appendRow([
      params.name || "Okänd",
      params.service || "Ej specificerad",
      params.date || "Ej angivet",
      params.time || "Ej angivet",
      params.contact || "Ej angivet",
      params.location || "Ej angivet",
      new Date().toLocaleString(),
    ]);

    return sendCorsResponse({ message: "Bokning sparad!" });
  } catch (error) {
    return sendCorsResponse({ error: "Ett fel uppstod: " + error.message });
  }
}

// ✅ Function to Handle GET Requests (For Browser Testing)
function doGet(e) {
  return sendCorsResponse({ message: "Google Apps Script API is working!" });
}

// ✅ Function to Parse URL-Encoded Form Data
function parseFormData(data) {
  var params = {};
  var pairs = data.split("&");
  pairs.forEach(function (pair) {
    var keyValue = pair.split("=");
    if (keyValue.length === 2) {
      params[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
    }
  });
  return params;
}

// ✅ Function to Handle CORS and Return JSON Response
function sendCorsResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  return output;
}
