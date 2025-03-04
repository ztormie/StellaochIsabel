import { useState, useEffect } from "react";

const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE"; // Replace with your actual script URL

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

  // Fetch available hours from Google Sheets
  useEffect(() => {
    fetch(GOOGLE_SCRIPT_URL)
      .then(response => response.json())
      .then(data => setAvailability(data))
      .catch(() => setError("Kunde inte ladda tillgängliga tider."));
  }, []);

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  // Function to check if selected date & time are available
  const isTimeAvailable = () => {
    if (!availability) return false;

    const day = new Date(booking.date).toLocaleString("en-US", { weekday: "long" }).toLowerCase();
    const [hour] = booking.time.split(":").map(Number);

    return (
      hour >= parseInt(availability[day]?.start.split(":")[0]) &&
      hour < parseInt(availability[day]?.end.split(":")[0])
    );
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

    // Validate selected time
    if (!isTimeAvailable()) {
      setError("Den valda tiden är inte tillgänglig. Vänligen välj en annan tid.");
      setLoading(false);
      return;
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
          <input type="text" name="name" placeholder="Ditt namn" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          
          <label>Välj tjänst:</label>
          <select name="service" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <option value="">Välj tjänst</option>
            <option value="Hundpromenad">Hundpassning</option>
            <option value="Barnpassning">Barnpassning</option>
          </select>
          
          <label>Adress eller område:</label>
          <input type="text" name="location" placeholder="Adress eller område" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          
          <label>Välj datum:</label>
          <input type="date" name="date" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          
          <label>Välj tid:</label>
          <input type="time" name="time" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />

          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
          
          <label>Telefonnummer eller e-post:</label>
          <input type="text" name="contact" placeholder="Telefonnummer eller e-post" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          
          <button type="submit" disabled={loading} style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "Skickar..." : "Boka"}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid #28a745", borderRadius: "5px", backgroundColor: "#d4edda" }}>
          <h2 style={{ color: "#155724" }}>Bokning skickad!</h2>
          <p>Tack, {booking.name}! Vi kommer att kontakta dig snarast med en bekräftelse.</p>
        </div>
      )}
    </div>
  );
}
