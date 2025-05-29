import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    const authFlag = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(!!token && authFlag);
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
    setIsMenuOpen(false);
    console.log("User has logged out.");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <div className="fixed-background"></div>
    <header className="header">
      
      <h1>
  <Link to="/" className="site-title">EventMate</Link>
</h1>
      
      <button className="hamburger-btn" onClick={toggleMenu}>
        ☰
      </button>
      
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>×</button>
        
        <nav className="nav-links">
          <Link to="/" onClick={toggleMenu}>Acasă</Link>
          {isAuthenticated ?(
          <Link to="/createevent" onClick={toggleMenu}>Creează Eveniment</Link>
                            ) : null}
          <Link to="/events" onClick={toggleMenu}>Evenimente Active</Link>
          {isAuthenticated ?(
          <Link to="/profile" onClick={toggleMenu}>Profil</Link>
                            ) : null}
          {isAuthenticated ? (
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu}>Autentificare</Link>
              <Link to="/signup" onClick={toggleMenu}>Înregistrare</Link>
            </>
          )}
        </nav>
      </div>
      
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </header>
    </>
  );
}

export default Header;