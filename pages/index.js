import { useState } from "react";
import { FaUser, FaDog, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaPhone } from "react-icons/fa";

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

    // Kontrollera att alla fält är ifyllda
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-center text-2xl font-bold mb-6">Stella och Isabels Bokning</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex items-center border p-3 rounded-lg bg-gray-100">
              <FaUser className="text-gray-600 mr-3" />
              <input
                type="text"
                name="name"
                placeholder="Ditt namn"
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-lg"
              />
            </div>
            <div className="flex items-center border p-3 rounded-lg bg-gray-100">
              <FaDog className="text-gray-600 mr-3" />
              <select
                name="service"
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-lg"
              >
                <option value="">Välj tjänst</option>
                <option value="Hundpromenad">Hundpromenad</option>
                <option value="Barnpassning">Barnpassning</option>
              </select>
            </div>
            <div className="flex items-center border p-3 rounded-lg bg-gray-100">
              <FaMapMarkerAlt className="text-gray-600 mr-3" />
              <input
                type="text"
                name="location"
                placeholder="Adress eller område"
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-lg"
              />
            </div>
            <div className="flex items-center border p-3 rounded-lg bg-gray-100">
              <FaCalendarAlt className="text-gray-600 mr-3" />
              <input
                type="date"
                name="date"
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-lg"
              />
            </div>
            <div className="flex items-center border p-3 rounded-lg bg-gray-100">
              <FaClock className="text-gray-600 mr-3" />
              <input
                type="time"
                name="time"
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-lg"
              />
            </div>
            <div className="flex items-center border p-3 rounded-lg bg-gray-100">
              <FaPhone className="text-gray-600 mr-3" />
              <input
                type="text"
                name="contact"
                placeholder="Telefonnummer eller e-post"
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-lg"
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-3 rounded-lg w-full text-lg font-semibold hover:bg-blue-600 transition"
            >
              {loading ? "Skickar..." : "Boka"}
            </button>
          </form>
        ) : (
          <div className="text-center p-4 border border-green-500 bg-green-100 rounded">
            <h2 className="font-bold text-green-700">Bokning skickad!</h2>
            <p>Tack, {booking.name}! Stella och Isabel kommer att kontakta dig med en bekräftelse.</p>
          </div>
        )}
      </div>
    </div>
  );
}
