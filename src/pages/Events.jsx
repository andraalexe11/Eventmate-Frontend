import { useEffect, useState } from "react";
import { getEvents } from "../api";
import EventCard from "../components/EventCard"; // Asigură-te că ai importat corect EventCard
import "../components/Events.css"; // Asigură-te că ai importat stilurile pentru evenimente

  function Events() {
    
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
      const fetchData = async () => {
        const data = await getEvents();
        // Mapăm datele de la backend în formatul așteptat de EventCard
        const formattedEvents = data.map(event => ({
          title: event.name,  // "name" din backend -> "title" în frontend
          location: event.location,
          date: event.dateTime, // "dateTime" din backend -> "date" în frontend
          maxParticipants: event.max_attendants, // "max_attendants" -> "maxParticipants"
          organiser: event.organiser,
          description: event.description, // Adăugăm descrierea
        }));
        setEvents(formattedEvents);
      };
      fetchData();
    }, []);

    return (
      
      <section className="events" style={{ paddingTop: "80px" }}>
        
        <input
        type="text"
        id = "search"
        placeholder="Caută după titlu sau locație..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        
        />
        {events.length > 0 ? (
events
.filter((event) =>
  event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  event.location.toLowerCase().includes(searchQuery.toLowerCase())
)
.map((event, index) => <EventCard key={index} {...event} />)      ) : (
        <p>Nu există evenimente disponibile.</p>
      )}
      </section>
    );
  }

  export default Events;