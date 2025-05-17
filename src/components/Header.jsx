import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Importați fișierul CSS pentru stilizare
function Header() {
  const[isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("access_token"); // Vedem dacă există un token
    const authFlag = localStorage.getItem("isAuthenticated") === "true"; // Flag-ul adăugat
    setIsAuthenticated(!!token && authFlag); // Dacă există token și e logat, actualizăm starea
  };

  useEffect(() => {
    checkAuth(); 

    
    const handleStorageChange = () => {
      checkAuth(); 
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token"); 
    localStorage.setItem("isAuthenticated", "false"); 
    setIsAuthenticated(false);
    console.log("User has logged out.");
  };

const toggleMenu = () => {
    // Schimbă starea meniului între deschis și închis
    setIsMenuOpen(!isMenuOpen);
  };

    return (
      <header className="header">
        <h1>EventMate</h1>
        <nav>
          <Link to="/">Acasă</Link>
          <Link to="/createevent">Creează Eveniment</Link>
          <Link to="/events">Evenimente</Link>
          <Link to="/profile">Profil</Link>
          {isAuthenticated ? (    
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
          
        ) : (
          <div className="dropdown">
            <button className="dropbtn">Opțiuni de Autentificare</button>
            <div className="dropdown-content">
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        )}


        </nav>
      </header>
    );
  }
export default Header; 