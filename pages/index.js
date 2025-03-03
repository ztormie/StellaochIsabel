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
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Stellas Bokningssida</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="text" name="name" placeholder="Ditt namn" onChange={handleChange} required />
          <select name="service" onChange={handleChange} required>
            <option value="">Välj tjänst</option>
            <option value="Hundpromenad">Hundpromenad</option>
            <option value="Barnpassning">Barnpassning</option>
          </select>
          <input type="date" name="date" onChange={handleChange} required />
          <input type="time" name="time" onChange={handleChange} required />
          <input type="text" name="contact" placeholder="Kontaktuppgifter" onChange={handleChange} required />
          <button type="submit">Boka</button>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h2>Bokning skickad!</h2>
          <p>Tack, {booking.name}! Stella kommer att kontakta dig.</p>
        </div>
      )}
    </div>
  );
}