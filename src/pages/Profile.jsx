import React, {useState, useEffect} from "react";
import './Profile.css';
import axios from "axios";
import { getEventsForUser, getEventsForOrganiser, getUserByName , leaveEvent, cancelEvent} from "../api";

function Profile() {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [age, setAge] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    "https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnRvb258ZW58MHx8MHx8fDA%3D"
  );

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
        setUsername(decoded.preferred_username); 
      }
      if (decoded && decoded.email) {
        setEmail(decoded.email); 
      }
      
      
    }
    const fetchUserDetails = async () => {
    try{
      const userdetails= await getUserByName(username);
      if (userdetails) {
        setAge(userdetails.age);
      } else {
        console.error("Detaliile utilizator nu au fost găsite.");
      }
    }
    catch (error) {
      console.error("Eroare la preluarea detaliilor utilizatorului:", error);
    }
    };
    if (username) {
    fetchUserDetails();
    }
  }, [username]);

 


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

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!username) return;
      try {
        const jevents = await getEventsForUser(username);
        setJoinedEvents(jevents);
        console.log("Evenimente la care particip:", jevents);
        const cevents = await getEventsForOrganiser(username);
        setCreatedEvents(cevents);
      } catch (error) {
        console.error("Eroare la preluarea evenimentelor:", error);
      }
    };
    fetchUserEvents();
  }, [username]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleLeaveEvent = async (title) => {
    try {
          console.log("Retragere din eveniment:", title);
          console.log("Username:", username);
          await leaveEvent(title, username);
      
          alert("Te-ai retras de la acest eveniment.");
        } catch (error) {
          console.error("Eroare la retragerea din eveniment:", error);
          alert(error.response?.data || "A apărut o eroare, încearcă din nou.");
        }
  };
const handleCancelEvent = (title) => {
  if (window.confirm("Sigur doriți să anulați acest eveniment?")) {
    try{
      
      const response = cancelEvent(title);
      if (!response) {
        alert("A apărut o eroare la anularea evenimentului.");
        return;
      }
      alert("Evenimentul a fost anulat cu succes.");
       // Redirecționează utilizatorul înapoi la homepage
    }
    catch (err) {
      console.error("Eroare la anularea evenimentului:", err);
      alert("A apărut o eroare la anularea evenimentului.");
    }
  }
};  
  const user = {
    username: username,
    email: email,
    age: age,
    profilePicture: profilePicture,
    joinedEvents: joinedEvents,
    createdEvents: createdEvents
  };

  return (
    <div className="profile-container">
      <div className="main-profile-container">
        <div className="profile-header">
          <div className="profile-picture-container">
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              className="profile-picture-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-picture-upload">
              <img
                className="profile-picture"
                src={user.profilePicture}
                alt="Profile"
              />
            </label>
          </div>
          
          <div className="profile-info">
            <h2 className="section-title">Informații personale</h2>
            
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">@{user.username || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Vârstă:</span>
              <span className="info-value">{user.age || '-'}</span>
          </div>
        </div>
      </div>
      </div>

      <div className="events-section joined-events">
        <h2>
          <span className="icon">🎟️</span>
          Evenimente la care particip
        </h2>
        {joinedEvents.length > 0 ? (
          <table className="events-table">
            <thead>
              <tr>
                <th>Nume Eveniment</th>
                <th>Locație</th>
                <th>Dată</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {joinedEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.location}</td>
                  <td>{formatDateTime(event.dateTime)}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={() => window.location.href = `/events/by-title/${encodeURIComponent(event.name)}`}
                    >
                      Detalii
                    </button>
                    
                     <button
                      className="table-button"
                      onClick={() => handleLeaveEvent(event.name)}
                      >Retrage-te</button
                    >
                  </td>

                  
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-events-message">
            Nu participi la niciun eveniment momentan.
            <br />
            <button
              className="table-button"
              onClick={() => window.location.href = '/events'}
              >Vezi Evenimente</button>

          </div>
        )}
      </div>

      <div className="events-section created-events">
        <h2>
          <span className="icon">📌</span>
          Evenimente create
        </h2>
        {createdEvents.length > 0 ? (
          <table className="events-table">
            <thead>
              <tr>
                <th>Nume Eveniment</th>
                <th>Locație</th>
                <th>Dată</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {createdEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.location}</td>
                  <td>{formatDateTime(event.dateTime)}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={() => window.location.href = `/events/by-title/${encodeURIComponent(event.name)}`}
                    >
                      Detalii
                    </button>
                    <button
                      onClick={() => handleCancelEvent(event.name)}
                      className="table-button"
                      
                      >Anulează Eveniment</button
                    >
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-events-message">
            Nu ai creat niciun eveniment momentan. 
            <br />
            <button
              className="table-button"
              onClick={() => window.location.href = '/createevent'}
              >Creează Eveniment </button>
          </div>
        )}
      </div>
    </div>
    
  );
}

export default Profile;