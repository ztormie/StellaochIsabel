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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-center text-2xl font-bold mb-6">Stella och Isabels Bokning</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Ditt namn"
                onChange={handleChange}
                required
                className="border p-3 pl-12 rounded-lg w-full text-lg focus:outline-blue-500"
              />
            </div>
            <div className="relative">
              <FaDog className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <select
                name="service"
                onChange={handleChange}
                required
                className="border p-3 pl-12 rounded-lg w-full text-lg focus:outline-blue-500"
              >
                <option value="">Välj tjänst</option>
                <option value="Hundpromenad">Hundpromenad</option>
                <option value="Barnpassning">Barnpassning</option>
              </select>
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="location"
                placeholder="Adress eller område"
                onChange={handleChange}
                required
                className="border p-3 pl-12 rounded-lg w-full text-lg focus:outline-blue-500"
              />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="date"
                name="date"
                onChange={handleChange}
                required
                className="border p-3 pl-12 rounded-lg w-full text-lg focus:outline-blue-500"
              />
            </div>
            <div className="relative">
              <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="time"
                name="time"
                onChange={handleChange}
                required
                className="border p-3 pl-12 rounded-lg w-full text-lg focus:outline-blue-500"
              />
            </div>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="contact"
                placeholder="Telefonnummer eller e-post"
                onChange={handleChange}
                required
                className="border p-3 pl-12 rounded-lg w-full text-lg focus:outline-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white p-3 rounded-lg w-full text-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Skickar..." : "Boka"}
            </button>
          </form>
        ) : (
          <div className="text-center p-4 border border-green-500 bg-green-100 rounded-lg">
            <h2 className="font-bold text-green-700">Bokning skickad!</h2>
            <p>Tack, {booking.name}! Stella och Isabel kommer att kontakta dig med en bekräftelse.</p>
          </div>
        )}
      </div>
    </div>
  );
}
