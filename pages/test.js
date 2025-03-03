import { useState } from "react";

export default function StellaBookingApp() {
  const [booking, setBooking] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Bokning skickad!</h2>
          <p style={{ fontSize: "16px" }}>Tack, {booking.name}! Stella kommer att kontakta dig.</p>
        </div>
      )}
    </div>
  );
}
