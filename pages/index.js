import { useState, useEffect } from "react";

// ✅ Update this to your NEW Google Apps Script URL after redeploying
const GOOGLE_SCRIPT_URL = "YOUR_NEW_GOOGLE_SCRIPT_URL_HERE"; 

export default function StellaBookingApp() {
  const [booking, setBooking] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
    location: "",
    contact: "",
  });

  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // ✅ Fetch available time slots from Google Script
  useEffect(() => {
    fetch(GOOGLE_SCRIPT_URL)
      .then(response => response.json())
      .then(data => {
        setAvailability(data);

        // ✅ Find available dates (days with time slots)
        const dates = Object.keys(data).filter(day => data[day].length > 0);
        setAvailableDates(dates);
      })
      .catch(() => setError("Kunde inte ladda tillgängliga tider."));
  }, []);

  // ✅ Update available time slots when a date is selected
  const handleDateChange = (e) => {
    const selectedDay = new Date(e.target.value).toLocaleString("en-US", { weekday: "long" }).toLowerCase();
    setBooking({ ...booking, date: e.target.value });

    // Show available time slots for selected day
    setAvailableTimes(availability[selectedDay] || []);
  };

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(null);
    setError(null);
    setLoading(true);

    // Validate all fields are filled
    for (const key in booking) {
      if (!booking[key]) {
        setError("Vänligen fyll i alla fält innan du bokar.");
        setLoading(false);
        return;
      }
    }

    try {
      const formData = new URLSearchParams();
      Object.entries(booking).forEach(([key, value]) => formData.append(key, value));

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      // ✅ Detect Redirect Issues (Prevents Google Apps Script Redirect Problem)
      if (response.redirected) {
        throw new Error("Redirect detected. Check your Google Apps Script deployment.");
      }

      const responseData = await response.json(); // ✅ Read JSON properly

      if (!response.ok) {
        throw new Error("Fel vid API-anrop. Kontrollera API-URL och Google Apps Script-behörigheter.");
      }

      setSubmitted(responseData); // ✅ Store confirmation details
    } catch (error) {
      setError("Det gick inte att skicka bokningen. Kontrollera API-URL och försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Stella och Isabels Bokning
      </h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>Ditt namn:</label>
          <input type="text" name="name" placeholder="Ditt namn" onChange={handleChange} required />

          <label>Välj tjänst:</label>
          <select name="service" onChange={handleChange} required>
            <option value="">Välj tjänst</option>
            <option value="Hundpromenad">Hundpassning</option>
            <option value="Barnpassning">Barnpassning</option>
          </select>

          <label>Adress eller område:</label>
          <input type="text" name="location" placeholder="Adress eller område" onChange={handleChange} required />

          <label>Välj datum:</label>
          <input type="date" name="date" onChange={handleDateChange} required />

          <label>Välj tid:</label>
          <select name="time" onChange={handleChange} required>
            <option value="">Välj en tid</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>

          <label>Telefonnummer eller e-post:</label>
          <input type="text" name="contact" placeholder="Telefonnummer eller e-post" onChange={handleChange} required />

          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Skickar..." : "Boka"}
          </button>
        </form>
      ) : (
        // ✅ Show Detailed Confirmation Instead of Just "Bokning skickad!"
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid green", borderRadius: "5px", backgroundColor: "#d4edda" }}>
          <h2 style={{ color: "#155724" }}>Bokning bekräftad!</h2>
          <p><strong>Namn:</strong> {submitted.name}</p>
          <p><strong>Tjänst:</strong> {submitted.service}</p>
          <p><strong>Datum:</strong> {submitted.date}</p>
          <p><strong>Tid:</strong> {submitted.time}</p>
          <p><strong>Plats:</strong> {submitted.location}</p>
          <p><strong>Kontakt:</strong> {submitted.contact}</p>
          <button onClick={() => setSubmitted(null)} style={{ padding: "10px", marginTop: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Boka en ny tid
          </button>
        </div>
      )}
    </div>
  );
}
