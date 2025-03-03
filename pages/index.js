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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-center text-xl font-bold mb-4">Stella och Isabels Bokning</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Ditt namn"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <select
            name="service"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Välj tjänst</option>
            <option value="Hundpromenad">Hundpromenad</option>
            <option value="Barnpassning">Barnpassning</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Adress eller område"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="date"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="time"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="contact"
            placeholder="Telefonnummer eller e-post"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Skickar..." : "Boka"}
          </button>
        </form>
      ) : error ? (
        <div className="text-center p-4 border border-red-500 bg-red-100 rounded">
          <h2 className="font-bold text-red-700">Fel vid bokning!</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="text-center p-4 border border-green-500 bg-green-100 rounded">
          <h2 className="font-bold text-green-700">Bokning skickad!</h2>
          <p>Tack, {booking.name}! Stella och Isabel kommer att kontakta dig med en bekräftelse.</p>
        </div>
      )}
    </div>
  );
}
