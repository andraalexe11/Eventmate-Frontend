import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import { Link } from "react-router-dom";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import EventsSection from "./components/EventSection";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import Events from "./pages/Events";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<><HeroSection /><EventsSection /></>}/>
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/events" element={<Events />} />

      </Routes>
    </Router>
  );
}

export default App
