import { useState } from "react";

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

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);

    try {
      // ✅ Convert booking object to URL-encoded format
      const formData = new URLSearchParams();
      Object.entries(booking).forEach(([key, value]) => formData.append(key, value));

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwsOkTYBSdMw9SUuZYA10H2ecYTNIuixnOHfWn71lYZ7uBbw5mgVVc63QrSH3fWmHbI/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // ✅ Prevents CORS issues
          },
          body: formData.toString(), // ✅ Correct format for Google Apps Script
        }
      );

      if (!response.ok) {
        throw new Error("Fel vid API-anrop. Kontrollera API-URL och Google Apps Script-behörigheter.");
      }

      const result = await response.json();
      console.log("Response from API:", result);
      setSubmitted(true);
    } catch (error) {
      console.error("Fel vid API-anrop:", error);
      setError("Det gick inte att skicka bokningen. Kontrollera API-URL och försök igen senare.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "90%", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Stella och Isabels Bokningssida
      </h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input type="text" name="name" placeholder="Ditt namn" onChange={handleChange} required />
          <select name="service" onChange={handleChange} required>
            <option value="">Välj tjänst</option>
            <option value="Hundpromenad">Hundpromenad</option>
            <option value="Barnpassning">Barnpassning</option>
          </select>
          <input type="text" name="location" placeholder="Adress eller område" onChange={handleChange} required />
          <label>Välj datum:</label>
          <input type="date" name="date" onChange={handleChange} required />
          <label>Välj tid:</label>
          <input type="time" name="time" onChange={handleChange} required />
          <input type="text" name="contact" placeholder="Telefonnummer eller e-post" onChange={handleChange} required />
          <button type="submit">Boka</button>
        </form>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid red", borderRadius: "8px", backgroundColor: "#ffcccc" }}>
          <h2>Fel vid bokning!</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h2>Bokning skickad!</h2>
          <p>Tack, {booking.name}! Stella och Isabel kommer att kontakta dig så fort vi har möjlighet med en bekräftelse på bokningen.</p>
  
        </div>
      )}
    </div>
  );
}
