
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetails.css';
import { getEventByName, leaveEvent, updateEvent, cancelEvent} from '../api';

function EventDetails() {
  const { eventName } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(); 
  const [isEditing, setIsEditing] = useState(false);
const [editedEvent, setEditedEvent] = useState(null);
  
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
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload;
    } catch (error) {
      console.error("Eroare la decodificarea token-ului:", error);
      return null;
    }
  };
  useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const decoded = decodeToken(token); 
        if (decoded && decoded.preferred_username) {
          setCurrentUser(decoded.preferred_username); 
        }
      }
    }, []);

   
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log(eventName);
        const response = await getEventByName(eventName);
        console.log("Răspuns de la server:", response); // Log pentru debugging
        if (!response) {
          throw new Error("Evenimentul nu a fost găsit");
        }
        setEvent(response);
        setParticipants(response.participants || []);
         
        setLoading(false);
      } catch (err) {
        setError(err.response?.message || err.message);
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventName, currentUser]);

  const handleRemoveParticipant = (participant) => {
    if (window.confirm("Sigur doriți să eliminați acest participant?")) {
      const response = leaveEvent(eventName, participant);
      if (response) {
        setParticipants(prev => prev.filter(p => p.user !== participant));
        alert("Participantul a fost eliminat cu succes.");
      } else {
        alert("A apărut o eroare la eliminarea participantului.");
      }
    }
  }; 

const handleEditClick = () => {
  setEditedEvent({ ...event }); // clonăm datele existente
  setIsEditing(true);
};

const handleCancelEdit = () => {
  setIsEditing(false);
  setEditedEvent(null);
};

const handleSaveEdit = async () => {
  try {
    const result = await updateEvent(event.name, editedEvent);
    setEvent(result); // actualizează local cu ce returnează backend-ul
    setIsEditing(false);
    setEditedEvent(null);
    alert("Evenimentul a fost actualizat!");
    if (event.name !== result.name) {
      navigate(`/events/by-title/${encodeURIComponent(result.name)}`);
    }
  } catch (err) {
    console.error("Eroare la salvare:", err);
    alert("A apărut o eroare la actualizare.");
  }
};

const handleCancelEvent = () => {
  if (window.confirm("Sigur doriți să anulați acest eveniment?")) {
    try{
      
      const response = cancelEvent(event.name);
      if (!response) {
        alert("A apărut o eroare la anularea evenimentului.");
        return;
      }
      alert("Evenimentul a fost anulat cu succes.");
      navigate('/'); // Redirecționează utilizatorul înapoi la homepage
    }
    catch (err) {
      console.error("Eroare la anularea evenimentului:", err);
      alert("A apărut o eroare la anularea evenimentului.");
    }
  }
};  
  


  if (loading) return <div className="loading">Se încarcă...</div>;
  if (error) return <div className="error">Eroare: {error}</div>;
  if (!event) return <div className="not-found">Evenimentul nu a fost găsit</div>;

  return (
    <div className="event-details-container">
      <div className="event-header">
        
        
        <div className="event-info">
          {isEditing ? (
            <div className="edit-name">
            <label htmlFor="edit-name">Nume Eveniment:</label>
            <input
              id="edit-name"
              type="text"
              value={editedEvent.name}
              onChange={(e) => setEditedEvent({ ...editedEvent, name: e.target.value })}
            />
            </div>
          ) : (
            <h1>{event.name}</h1>
          )}
         
          <div className="event-meta">
            {isEditing ? (
              <div className="edit-date-time">
              <label htmlFor="edit-date-time">Dată și Oră:</label>
              <input
                id="edit-date-time"
                type="datetime-local"
                value={new Date(editedEvent.dateTime).toISOString().slice(0, 16)}
                onChange={(e) => setEditedEvent({ ...editedEvent, dateTime: e.target.value })}
              />
              </div>
            ) : (
              <span className="event-date-time">
                <strong>📅 Dată și Oră: </strong> {formatDateTime(event.dateTime)}
              </span>
            )}
           

             
            {isEditing ? (
              <div className="edit-category">
                <label htmlFor="edit-category">Categorie:</label>
                <input
                  id="edit-category"
                  type="text"
                  value={editedEvent.category}
                  onChange={(e) => setEditedEvent({ ...editedEvent, category: e.target.value })}
                />
              </div>
            ) : (
              <span className="event-category-label">
                <strong>📂 Categorie: </strong> {event.category}
              </span>
            )}
          
          
            {isEditing ? (
              <div className="edit-location">
              <label htmlFor="edit-location">Locație:</label>
              <input id ="edit-location"
                type="text"
                value={editedEvent.location}
                onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
              />
              </div>
            ) : (
              <span className="event-location">
                <strong>📍Locație:</strong> {event.location}
              </span>
            )}
            { isEditing ? (
              <div className="edit-max-participants">
                <label htmlFor="edit-max-participants">Participanți maximi:</label>
                <input
                  id="edit-max-participants"
                  type="number"
                  value={editedEvent.max_attendants}
                  onChange={(e) => setEditedEvent({ ...editedEvent, max_attendants: e.target.value })}
                />
              </div>
            ) : (
            <span className="event-max-participants">
              <strong>👥 Participanți maximi: </strong> {event.max_attendants}
            </span>
            )}
            <span className="event-organizer">
              <strong>👤 Organizator: </strong> @{event.organiser}
            </span>
          </div>
        </div>
        </div>
        

      
      
        {isEditing ? (
          <div className="edit-description">
            <label htmlFor="edit-description">Descriere:</label>
            <textarea
              id="edit-description"
              value={editedEvent.description}
              onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
            />
          </div>
        ) : (
          <div className="event-description">

        <h2>📝 Despre eveniment</h2>
        <p>{event.description}</p>
      </div>
      )}
      
      <div className="participants-section">
        <h2>👥 Participanți ({participants.length})</h2>
        
        <table className="participants-table">
          <thead>
            <tr>
              <th>Nume</th>
              
              {isOrganizer && <th>Acțiuni</th>}
            </tr>
          </thead>
          <tbody>
            {/* Randul organizatorului */}
            <tr className="organizer-row">
              <td>Organizator @{event.organiser}</td>
              
              {isOrganizer && <td>-</td>}
            </tr>
            
            {/* Participanții */}
            {participants.map(participant => (
              <tr key = {participant}>
                <td>@{participant}</td>
                {/* <td>{participant.joinedAt}</td> */}
                {isOrganizer && (
                  <td>
                    <button 
                      onClick={() => handleRemoveParticipant(participant)}
                      className="remove-button"
                    >
                      Elimină
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {participants.length === 0 && (
          <div className="no-participants">
            Nu există participanți înscriși la acest eveniment.
          </div>
        )}
      </div>

      {isOrganizer && (
        <div className="organizer-actions">
          {isEditing ? (
            <>
              <button className="save-button" onClick={handleSaveEdit}>Salvează</button>
              <button className="cancel-button" onClick={handleCancelEdit}>Anulează</button>
            </>
          ) : (
            <button className="edit-event-button" onClick={handleEditClick}>Editează Eveniment</button>
          )}
                    <button className="cancel-event-button" onClick={handleCancelEvent}>Anulează Eveniment</button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;