pages/
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Stellas Bokningssida</h1>
      {!submitted ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input name="name" placeholder="Ditt namn" onChange={handleChange} required />
              <select
                name="service"
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Välj tjänst</option>
                <option value="Hundpromenad">Hundpromenad</option>
                <option value="Barnpassning">Barnpassning</option>
              </select>
              <Input type="date" name="date" onChange={handleChange} required />
              <Input type="time" name="time" onChange={handleChange} required />
              <Input name="contact" placeholder="Kontaktuppgifter" onChange={handleChange} required />
              <Button type="submit" className="w-full">Boka</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 text-center">
            <h2 className="text-lg font-bold">Bokning skickad!</h2>
            <p>Tack, {booking.name}! Stella kommer att kontakta dig.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
