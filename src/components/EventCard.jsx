import { use, useEffect, useState } from "react";
import {joinEvent, leaveEvent, getEventsForUser} from "../api";
import "./Events.css"; // Asigură-te că ai un fișier CSS pentru stilizare
import { useNavigate } from 'react-router-dom';

function EventCard({ title, location, date, maxParticipants, organiser, description }) {
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [participant, setParticipant] = useState('');
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeToken, setActiveToken] = useState(null);
  const formatDateTime = (isoString) => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(isoString).toLocaleString('ro-RO', options);
  };
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodifică partea utilă din token
      return payload;
      setActiveToken(true);
    } catch (error) {
      console.error("Eroare la decodificarea token-ului:", error);
      setActiveToken(false);
      return null;

    }
  };

 useEffect(() => {
  const eventDate = new Date(date);
  const currentDate = new Date();

  if (eventDate < currentDate) {
    setActiveEvent(false); // Eveniment trecut
  } else {
    setActiveEvent(true); // Eveniment viitor
  }
}, [date]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
       const decoded = decodeToken(token); // Extragem informațiile din token
       if (decoded && decoded.preferred_username) {
        setParticipant(decoded.preferred_username); // Salvăm username-ul
      }
      setActiveToken(true); // Setăm token-ul ca activ

      
    }
  }, []);
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!participant) return;
      try {
        const userEvents = await getEventsForUser(participant); // Preluăm evenimentele pentru utilizator
        const isAlreadyJoined = userEvents.some(
          (event) => event.name === title // Verificăm dacă utilizatorul este înscris
        );
        setIsJoined(isAlreadyJoined); // Setăm statusul
        if (isAlreadyJoined) {
          console.log("Utilizatorul este deja înscris la", title);
        }else{
          console.log("Utilizatorul nu este înscris la", title);
        }
      } catch (error) {
        console.error("Eroare la verificarea evenimentului:", error);
      }
    };

    fetchUserEvents();
  }, [participant, title]);

  const handleJoin = async () => {
    if (!participant) {
      alert("Trebuie să fii autentificat pentru a te alătura unui eveniment.");
      return;
    }
    try {
      await joinEvent(title, participant); 
      setIsJoined(true);
      alert("Te-ai alăturat cu succes evenimentului!");
    } catch (error) {

      alert(error.response?.data || "A apărut o eroare, încearcă din nou.");
    }
  };
  const handleLeave = async () => {
    try {
      await leaveEvent(title, participant);
      setIsJoined(false);
      alert("Te-ai retras de la acest eveniment.");
    } catch (error) {
      
      alert(error.response?.data || "A apărut o eroare, încearcă din nou.");
    }
  };

  const eventDetails = () => {
   
    navigate(`/events/by-title/${encodeURIComponent(title)}`);
  }


  return (
      <div className="event-card">
        <h3>{title}</h3>
        <p>📍 Locație: {location}</p>
        <p>📅 Dată și oră: {formatDateTime(date)}</p>
        <p>📝 Descriere: {description}</p>
        <p>👥 Participanți maximi: {maxParticipants}</p>
        <p>👤 Organizator: {organiser}</p>
        {activeEvent ? (
          isJoined ? (
        <>
          <p className="joined-message">✔️ Ești înscris la acest eveniment!</p>
          <button onClick={handleLeave}>Părăsește evenimentul</button>
        </>
      ) : (
        <button onClick={handleJoin}>Înscrie-te!</button>
      )
        ) : (
          <p className="event-status">Evenimentul a avut loc deja.</p>
        )}
        {        activeToken ? (
        <button onClick={eventDetails} id = "eventdetailsbtn"> Vezi Detalii</button>
        ) : (
          <p className="event-status">Autentifică-te pentru a vedea mai multe detalii</p>
        )}
        

        

    </div>
  );
}

export default EventCard;