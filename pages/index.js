// Google Apps Script: doGet
function doGet() {
  try {
    const availabilitySheet = SpreadsheetApp.openById(AVAILABILITY_SHEET_ID).getSheetByName("availability");
    const bookingsSheet = SpreadsheetApp.openById(BOOKINGS_SHEET_ID).getActiveSheet();

    if (!availabilitySheet) throw new Error("Sheet 'availability' not found!");
    if (!bookingsSheet) throw new Error("Sheet 'bookings' not found!");

    const bookedSlots = extractBookedSlots(bookingsSheet);
    const availability = generateAvailability(SCHEDULE, bookedSlots);

    return sendCorsResponse(availability);
  } catch (error) {
    return sendCorsResponse({ error: "Ett fel uppstod: " + error.message });
  }
}

// Google Apps Script: doPost
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return sendCorsResponse({ error: "Ingen data mottagen eller felaktig förfrågan." });
    }

    const params = parseFormData(e.postData.contents);
    const bookingsSheet = SpreadsheetApp.openById(BOOKINGS_SHEET_ID).getActiveSheet();

    bookingsSheet.appendRow([
      params.name || "Okänd",
      params.service || "Ej specificerad",
      params.date || "Ej angivet",
      params.time || "Ej angivet",
      params.contact || "Ej angivet",
      params.location || "Ej angivet",
      new Date().toLocaleString(),
    ]);

    return sendCorsResponse({ message: "Bokning bekräftad!", ...params });
  } catch (error) {
    return sendCorsResponse({ error: "Ett fel uppstod: " + error.message });
  }
}

// Extract booked slots from bookings data
function extractBookedSlots(bookingsSheet) {
  const bookingsData = bookingsSheet.getDataRange().getValues();
  const bookedSlots = {};

  for (let i = 1; i < bookingsData.length; i++) { 
    const date = new Date(bookingsData[i][2]); 
    const time = bookingsData[i][3]; 
    const day = date.toLocaleString("en-US", { weekday: "long" }).toLowerCase();

    if (!bookedSlots[day]) bookedSlots[day] = [];
    bookedSlots[day].push(time);
  }

  return bookedSlots;
}

// Generate availability
function generateAvailability(schedule, bookedSlots) {
  const availability = {};

  for (const day in schedule) {
    const [startTime, endTime] = schedule[day];
    const allSlots = generateTimeSlots(startTime, endTime);
    availability[day] = allSlots.filter(slot => !bookedSlots[day] || !bookedSlots[day].includes(slot));
  }

  return availability;
}

// Generate 1-hour time slots
function generateTimeSlots(startTime, endTime) {
  const slots = [];
  let start = parseTime(startTime);
  const end = parseTime(endTime);

  while (start < end) {
    slots.push(formatTime(start));
    start.setMinutes(start.getMinutes() + 60); 
  }
  
  return slots;
}

// Convert "HH:MM" string to Date object
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Format Date object to "HH:MM"
function formatTime(date) {
  return date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
}

// Parse form data
function parseFormData(data) {
  return Object.fromEntries(data.split("&").map(pair => {
    const [key, value] = pair.split("=");
    return [decodeURIComponent(key), decodeURIComponent(value)];
  }));
}

// Send CORS response
function sendCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
