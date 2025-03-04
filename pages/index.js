import { useState, useEffect } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7sS7EJadXz3kcoJelUG0R_z7kPOXZHINqlpUb_hiwWe5ksy6WEXDCAVeF3Wwg5kSa/exec"; 

export default function StellaBookingApp() {
  const [booking, setBooking] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
    location: "",
    contact: "",
  });

  const [submitted, setSubmitted] = useState(false);
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
    if (availability[selectedDay]) {
      setAvailableTimes(availability[selectedDay]);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
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

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwsOkTYBSdMw9SUuZYA10H2ecYTNIuixnOHfWn71lYZ7uBbw5mgVVc63QrSH3fWmHbI/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        throw new Error("Fel vid API-anrop. Kontrollera API-URL och Google Apps Script-behörigheter.");
      }

      setSubmitted(true);
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

          <label>Välj datum:</label>
          <input type="date" name="date" onChange={handleDateChange} required />

          <label>Välj tid:</label>
          <select name="time" onChange={handleChange} required>
            <option value="">Välj en tid</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>

          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Skickar..." : "Boka"}
          </button>
        </form>
      ) : (
        <p>Bokning skickad!</p>
      )}
    </div>
  );
}
