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
    setSubmitted(true);
    setError(null);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwsOkTYBSdMw9SUuZYA10H2ecYTNIuixnOHfWn71lYZ7uBbw5mgVVc63QrSH3fWmHbI/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        throw new Error("Fel vid API-anrop. Kontrollera API-URL och Google Apps Script-behörigheter.");
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Fel vid API-anrop:", error);
      setError("Det gick inte att skicka bokningen. Försök igen senare.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "90%", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Stella och Isabels Bokningssida</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input type="text" name="name" placeholder="Ditt namn" onChange={handleChange} required style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }} />
          <select name="service" onChange={handleChange} required style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}>
            <option value="">Välj tjänst</option>
            <option value="Hundpromenad">Hundpromenad</option>
            <option value="Barnpassning">Barnpassning</option>
          </select>
          <input type="text" name="location" placeholder="Adress eller område" onChange={handleChange} required style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }} />
          <label style={{ fontSize: "16px", fontWeight: "bold" }}>Välj datum:</label>
          <div style={{ position: "relative" }}>
            <input type="date" name="date" onChange={handleChange} required placeholder="Välj ett datum" style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }} />
            <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "#888" }}>📅</span>
          </div>
          <label style={{ fontSize: "16px", fontWeight: "bold" }}>Välj tid:</label>
          <div style={{ position: "relative" }}>
            <input type="time" name="time" onChange={handleChange} required placeholder="Välj en tid" style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }} />
            <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "#888" }}>⏰</span>
          </div>
          <input type="text" name="contact" placeholder="Telefonnummer eller e-post" onChange={handleChange} required style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }} />
          <button type="submit" style={{ padding: "14px", fontSize: "18px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "center" }}>Boka</button>
        </form>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid red", borderRadius: "8px", backgroundColor: "#ffcccc" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Fel vid bokning!</h2>
          <p style={{ fontSize: "16px" }}>{error}</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Bokning skickad!</h2>
          <p style={{ fontSize: "16px" }}>Tack, {booking.name}! Stella kommer att kontakta dig så fort vi har möjlighet.</p>
          <p style={{ fontSize: "16px" }}>Plats: {booking.location}</p>
        </div>
      )}
    </div>
  );
}
