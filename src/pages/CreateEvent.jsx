import { useState, useEffect } from 'react'
import axios from 'axios';
import "../components/Events.css"; // Asigură-te că ai un fișier CSS pentru stilizare
function CreateEvent() {
    const [eventDetails, setEventDetails] = useState({ title: "", description: "", location: "", date: "", maxParticipants: "", category: "" });
    const [errorMessage, setErrorMessage] = useState(null); // Pentru mesajele de eroare
    const [organiserUsername, setOrganiserUsername] = useState(""); 
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

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
      const fetchCategories = async () => {
        try {
          const response = await axios.get("http://localhost:8081/api/events");
          const uniqueCategories = [...new Set(response.data.map(event => event.category))];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error("Eroare la obținerea categoriilor:", error);
        }
      };

      fetchCategories();
    }, []);
  
    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
         const decoded = decodeToken(token); // Extragem informațiile din token
         if (decoded && decoded.preferred_username) {
          setOrganiserUsername(decoded.preferred_username); // Salvăm username-ul
        }
  
        
      }
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEventDetails(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        console.log("username", organiserUsername);
        const token = localStorage.getItem("access_token");
        
        if (!token) {
          setErrorMessage("Trebuie să te conectezi pentru a putea crea un eveniment."); // Setăm mesajul de eroare
          return;
        }
    
        const response = await axios.post("http://localhost:8081/api/events", {
          name: eventDetails.title,
          description: eventDetails.description,
          location: eventDetails.location,
          dateTime: eventDetails.date,
          max_attendants: eventDetails.maxParticipants,
          organiser: organiserUsername,
          category: eventDetails.category, // Adăugăm categoria dacă este necesară
        }
        , {
          headers: {
              Authorization: `Bearer ${token}` 
          },
      }
);
  
        console.log("Eveniment creat:", response.data);
        alert("Evenimentul a fost creat cu succes!");
        
        
        setEventDetails({
          title: "",
          location: "",
          date: "",
          maxParticipants: "",
          description: "",
          category: ""
        });
        setErrorMessage(null);

      } catch (error) {
        console.error("Eroare la crearea evenimentului:", error);
        alert("A apărut o eroare la crearea evenimentului.");
      }
    };
  
    
  
    return (
      <section className="create-event-section">
        <h2>Creează un Eveniment</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Afișăm mesajul de eroare */}

        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Titlu eveniment" value={eventDetails.title} onChange={handleInputChange} required />
          <div className="form-group">
        <select
          name="category"
          placeholder="Selectează o categorie"
          value={eventDetails.category}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "__new__") {
              setIsAddingNewCategory(true);
              setEventDetails(prev => ({ ...prev, category: newCategory }));
            } else {
              setIsAddingNewCategory(false);
              setEventDetails(prev => ({ ...prev, category: value }));
              setNewCategory(""); // resetăm categoria nouă
            }
          }}
          
        >
          <option value="">Selectează o categorie</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
          <option value="__new__">Adaugă categorie nouă</option>
        </select>
      </div>

      {/* Dacă s-a ales "Adaugă categorie nouă", afișăm input separat */}
      {isAddingNewCategory && (
        <input
          type="text"
          placeholder="Introdu categorie nouă"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            setEventDetails(prev => ({ ...prev, category: e.target.value }));
          }}
          required
        />
      )} 
            
          <input type="text" name="description" placeholder="Descriere eveniment" value={eventDetails.description}  onChange={handleInputChange} />
          <input type="text" name="location" placeholder="Locație" value={eventDetails.location} onChange={handleInputChange} required />
          <input type="datetime-local" name="date" value={eventDetails.date} onChange={handleInputChange} required />
          <input type="number" name="maxParticipants" placeholder="Număr maxim participanți" value={eventDetails.maxParticipants} onChange={handleInputChange} required />
          <button type="submit">Creează Eveniment</button>
        </form>
      </section>
    );
  }
  export default CreateEvent;