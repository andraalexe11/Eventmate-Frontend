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
import Slider from "./components/Slider";
import cinemaIMG from './images/cinema.jpg';
import karaokeIMG from './images/karaoke.jpg';
import friendsIMG from './images/friends.jpg';
import meetingIMG from './images/meeting.jpg';
import EventDetails from "./pages/EventDetails";

const sliderData = [
  {
    image: cinemaIMG,
    title: "Nou în oraș? Găsește-ți prietenii potriviți!",
    text: "Descoperă evenimente și oameni care împărtășesc aceleași pasiuni. Creează amintiri, nu doar planuri!"
  },
  {
    image: karaokeIMG,
    title: "Ieșiri faine = oameni fericiți",
    text: "Vrei o seară relaxată cu câțiva prieteni sau o petrecere epică? Cu EventMate, găsești mereu evenimentul perfect."
  },
  {
    image: friendsIMG,
    title: "Viața e prea scurtă ca să stai acasă",
    text: "Găsește oameni cu aceleași interese sau creează-ți propriul eveniment. Cine știe? Poate organizezi chiar tu următoarea ieșire memorabilă."
  },
  {
    image: meetingIMG,
    title: "Ce mai aștepți? Intră în gașca noastră!",
    text: "Fă-ți cont gratuit și descoperă cât de simplu e să creezi evenimente care rămân în mintea oamenilor."
  },
  
];
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<><HeroSection /><Slider slides={sliderData} /><EventsSection /> </>}/>
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/by-title/:eventName" element={<EventDetails />} />

      </Routes>
    </Router>
  );
}

export default App
