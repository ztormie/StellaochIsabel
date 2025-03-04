import { useState, useEffect } from "react";

// ✅ Use the correct API URL (Stella och Isabel script)
const API_URL = "https://script.google.com/macros/s/AKfycbwsOkTYBSdMw9SUuZYA10H2ecYTNIuixnOHfWn71lYZ7uBbw5mgVVc63QrSH3fWmHbI/exec";

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
  const [availability, setAvailability] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // ✅ Fetch available time slots from Google Apps Script on load
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched availability data:", data);
        setAvailability(data);
        setAvailableDates(Object.keys(data).filter(day => data[day].length > 0));
      })
      .catch(error => {
        console.error("API Fetch Error:", error);
        setError("Kunde inte ladda tillgängliga tider.");
      });
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  // ✅ Update available time slots when a date is selected
  const handleDateChange = (e) => {
    const selectedDay = new Date(e.target.value)
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    setBooking({ ...booking, date: e.target.value });
    setAvailableTimes(availability[selectedDay] || []);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);
    setLoading(true);

    if (Object.values(booking).some(field => !field.trim())) {
      setError("Vänligen fyll i alla fält innan du bokar.");
      setLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams(booking);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error("Fel vid API-anrop.");

      const responseData = await response.json();
      setSubmitted(responseData);
      setBooking({
        name: "",
        service: "",
        date: "",
        time: "",
        location: "",
        contact: "",
      });
    } catch (error) {
      setError("Det gick inte att skicka bokningen. Försök igen senare.");
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

          <button type="submit" disabled={loading} style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Skickar..." : "Boka"}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid green", borderRadius: "5px", backgroundColor: "#d4edda" }}>
          <h2 style={{ color: "#155724" }}>Bokning bekräftad!</h2>
          <p><strong>Namn:</strong> {submitted.name}</p>
          <p><strong>Tjänst:</strong> {submitted.service}</p>
          <p><strong>Datum:</strong> {submitted.date}</p>
          <p><strong>Tid:</strong> {submitted.time}</p>
          <p><strong>Plats:</strong> {submitted.location}</p>
          <p><strong>Kontakt:</strong> {submitted.contact}</p>
          <button onClick={() => setSubmitted(null)} style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
            Boka en ny tid
          </button>
        </div>
      )}
    </div>
  );
}
