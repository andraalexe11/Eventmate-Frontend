import { useEffect, useState } from "react";
import { getEvents } from "../api";
import EventCard from "../components/EventCard"; // Asigură-te că ai importat corect EventCard
import "../components/Events.css"; // Asigură-te că ai importat stilurile pentru evenimente

  function Events() {
    
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Toate");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    useEffect(() => {
      const fetchData = async () => {
        const data = await getEvents();
        // Mapăm datele de la backend în formatul așteptat de EventCard
        const formattedEvents = data.map(event => ({
          title: event.name,  // "name" din backend -> "title" în frontend
          location: event.location,
          date: event.dateTime ? new Date(event.dateTime) : null, // "dateTime" din backend -> "date" în frontend
          maxParticipants: event.max_attendants, // "max_attendants" -> "maxParticipants"
          organiser: event.organiser,
          description: event.description, // Adăugăm descrierea
          category: event.category, // Adăugăm categoria
        }));
        setEvents(formattedEvents);
        const uniqueCategories = [...new Set(data.map(event => event.category))];
      setCategories(["Toate", ...uniqueCategories]);
    };
      
      fetchData();
    }, []);
    const filteredEvents = events.filter(event => {
    // Filtrare după search query
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrare după categorie
    const matchesCategory = 
      selectedCategory === "Toate" || 
      event.category === selectedCategory;
    
    const matchesDate = (
      (!startDate || event.date >= new Date(startDate)) && 
      (!endDate || event.date <= new Date(endDate))
    );
    
    return matchesSearch && matchesCategory && matchesDate;
  });

    return (
      
      <section className="events" style={{ paddingTop: "80px" }}>
      <div className="options-container">
        <input
          type="text"
          id="search"
          placeholder="Caută după titlu sau locație..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filters-container">
  <div className="category-filter">
    <label htmlFor="category"><strong>Categorie:</strong></label>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="category-filter"
    >
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
  </div>

  <div className="date-filters">
    <label>
      De la:
      <input 
        type="date" 
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </label>
    <label>
      Până la:
      <input 
        type="date" 
        value={endDate}
        min={startDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </label>
  </div>
</div>
      </div>

      
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <EventCard key={index} {...event} date={event.date ? event.date.toISOString() : ''}/>
        ))
      ) : (
        <p>Nu există evenimente disponibile.</p>
      )}
    </section>
    );
  }

  export default Events;