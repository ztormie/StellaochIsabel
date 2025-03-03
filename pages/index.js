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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);
    setLoading(true);

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
          <input type="text" name="name" placeholder="Ditt namn" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          <select name="service" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <option value="">Välj tjänst</option>
            <option value="Hundpromenad">Hundpromenad</option>
            <option value="Barnpassning">Barnpassning</option>
          </select>
          <input type="text" name="location" placeholder="Adress eller område" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          <input type="date" name="date" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          <input type="time" name="time" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          <input type="text" name="contact" placeholder="Telefonnummer eller e-post" onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
          <button type="submit" disabled={loading} style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "Skickar..." : "Boka"}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "1px solid #28a745", borderRadius: "5px", backgroundColor: "#d4edda" }}>
          <h2 style={{ color: "#155724" }}>Bokning skickad!</h2>
          <p>Tack, {booking.name}! Stella och Isabel kommer att kontakta dig med en bekräftelse.</p>
        </div>
      )}
    </div>
  );
}
