import { useEffect, useState } from "react";
import { getEvents } from "../api";
import EventCard from "../components/EventCard"; // Asigură-te că ai importat corect EventCard

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
          organiser: event.organiser // Adăugăm organizatorul
        }));
        setEvents(formattedEvents);
      };
      fetchData();
    }, []);

    return (
        
      <section className="events" style={{ paddingTop: "80px" }}>
        <input
        type="text"
        placeholder="Caută după titlu sau locație..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
            backgroundColor: "#f9f9f9",
            color: "#333",  
            marginBottom: "1.5rem",
            padding: "0.75rem 1rem",
            width: "100%",
            maxWidth: "500px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"
          }}
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