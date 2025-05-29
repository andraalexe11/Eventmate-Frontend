import { useEffect, useState } from "react";
import { getEvents } from "../api";
import {joinEvent, leaveEvent, getEventsForUser} from "../api";
import { Link } from "react-router-dom";
import "./Events.css";
import EventCard from "./EventCard"; // Asigură-te că ai importat corect EventCard
  function EventsSection() {
    
    const [events, setEvents] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        const data = await getEvents();
        // Mapăm datele de la backend în formatul așteptat de EventCard
        const formattedEvents = data.map(event => ({
          title: event.name,  // "name" din backend -> "title" în frontend
          location: event.location,
          date: event.dateTime, // "dateTime" din backend -> "date" în frontend
          maxParticipants: event.max_attendants, // "max_attendants" -> "maxParticipants"
          organiser: event.organiser,// Adăugăm organizatorul
          description: event.description, // Adăugăm descrierea
        }));
        setEvents(formattedEvents);

      };
      fetchData();
    }, []);

    return (
      <section className="events-section">
        <h2>Tendințe în socializare</h2>
        {events.length > 0 ? (
        events.slice(0, 3).map((event, index) => <EventCard key={index} {...event} />)
      ) : (
        <p>Nu există evenimente disponibile.</p>
      )}
      <Link to="/events">Vezi toate evenimentele </Link>

      </section>
    );
  }

  export default EventsSection;