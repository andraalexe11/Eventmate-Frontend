import { useEffect, useState } from "react";
import {joinEvent, leaveEvent, getEventsForUser} from "../api";

function EventCard({ title, location, date, maxParticipants, organiser }) {
  const [isJoined, setIsJoined] = useState(false);
  const [participant, setParticipant] = useState('');
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
    } catch (error) {
      console.error("Eroare la decodificarea token-ului:", error);
      return null;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
       const decoded = decodeToken(token); // Extragem informațiile din token
       if (decoded && decoded.preferred_username) {
        setParticipant(decoded.preferred_username); // Salvăm username-ul
      }

      
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


  return (
      <div className="event-card">
        <h3>{title}</h3>
        <p>📍 Locație: {location}</p>
        <p>📅 Dată și oră: {formatDateTime(date)}</p>
        <p>👥 Participanți maximi: {maxParticipants}</p>
        <p>👤 Organizator: {organiser}</p>
        {isJoined ? (
        <>
          <p className="joined-message">✔️ Ești înscris la acest eveniment!</p>
          <button onClick={handleLeave}>Leave</button>
        </>
      ) : (
        <button onClick={handleJoin}>Join</button>
      )}

    </div>
  );
}

export default EventCard;