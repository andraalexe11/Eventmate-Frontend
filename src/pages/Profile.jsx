import React, {useState, useEffect} from "react";
import './Profile.css';
import axios from "axios";
function Profile() {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [editMode, setEditMode] = useState(false); // Stare pentru modul de editare
  const [newBio, setNewBio] = useState("");
  

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
      }, []);
      const handleEditToggle = () => {
        setEditMode(!editMode);
      };
      const handleSaveChanges = async () => {
        try {
          const token = localStorage.getItem("access_token");
    
          const response = await axios.put(
            `http://localhost:8080/admin/realms/eventmate/users/<user-id>`, // Endpoint API
            {
      
              attributes: {
                bio: newBio,  },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Token cu drepturi admin (obținut din Keycloak)
                "Content-Type": "application/json",
              },
            }
          );
    
          console.log("Profil actualizat cu succes:", response.data);
    
        
          setBio(newBio);
    
          // Ieșim din modul de editare
          setEditMode(false);
        } catch (error) {
          console.error("Eroare la actualizarea profilului:", error);
          alert("A apărut o eroare la actualizarea profilului.");
        }
      };
    

  const user = {
    name: username,
    username: username,
    email: email,
    bio: '',
    profilePicture: 'https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnRvb258ZW58MHx8MHx8fDA%3D',
    joinedEvents: [],
    createdevents: []
  };

  return (
    <div className="profile-container">
      <div className="main-profile-container">
      <div className="profile-header">
        <img className="profile-picture" src={user.profilePicture} alt="Profile" />
        <div className="profile-info">
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-username">@{user.username}</p>
                <p className="profile-email">{user.email}</p>
              
          
          </div>
        </div>

        <div className="profile-bio">
          <h2>Biografie</h2>
          {editMode ? (
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Scrie ceva despre tine..."
            />
          ) : (
            <p>{user.bio}</p>
          )}
        </div>

        <button className="edit-button" onClick={editMode ? handleSaveChanges : handleEditToggle}>
          {editMode ? "Salvează Modificările" : "Editează Biografia"}
        </button>

      </div>
      <div className="joined-events">
      <h2>Evenimente la care particip:</h2>
        <table width={1150} align="center">
          <thead>
            <tr>
              <th>Nume Eveniment</th>
              <th>Locație</th>
              <th>Dată</th>
            </tr>
          </thead>
          <tbody>
            {user.joinedEvents.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.location}</td>
                <td>{event.date}</td>
              </tr>
            ))}
             {user.createdevents.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.location}</td>
                <td>{event.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="created-events">
      <h2>Evenimente create:</h2>
        <table width={1150} align="center">
          <thead>
            <tr>
              <th>Nume Eveniment</th>
              <th>Locație</th>
              <th>Dată</th>
            </tr>
          </thead>
          <tbody>
            {user.createdevents.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.location}</td>
                <td>{event.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
  }
  
  export default Profile;