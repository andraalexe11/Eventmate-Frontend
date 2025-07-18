import axios from "axios";

const API_URL = "http://localhost:8081/api/events"; 
const token = localStorage.getItem("access_token");
console.log("Token:", token); // Verificăm dacă token-ul este corect
export const joinEvent = async (title, participant) => {
  const token = localStorage.getItem("access_token");
  try{
  const response = await axios.post(
    `http://localhost:8081/participation/join`,
    null, // Body gol (sau poți trimite un obiect JSON, dar nu este cazul aici)
    {
      params: { // Aici trecem `title` și `organiser` ca parametri în query
        title: title,
        participant: participant,
      },
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT pentru protecție
      },
    }
  );
  return response.data; // Returnăm răspunsul din backend
  }catch (error) { 
    if (error.response && error.response.data) {
      // Dacă backend-ul a trimis un mesaj de eroare (ex: "Event is full!")
      throw new Error(error.response.data);
    } else {
      // Eroare generică
      throw new Error("A apărut o eroare în timpul cererii de participare.");
    }
  }
};

export const getEventByName = async (name) => {
  console.log("Preluare eveniment cu numele:", name); // Log pentru debugging
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`http://localhost:8081/api/events/findbyname`, {
      params: { name: name },
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT pentru protecție
      },
    });
    return response.data; // Returnăm datele evenimentului
  } catch (error) {
    console.error("Eroare la preluarea evenimentului:", error);
    return null; // Returnăm null în caz de eroare
  }
}

export const getEventsForOrganiser = async (organiser) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`http://localhost:8081/api/events/findbyorganiser`, {
    
      params: { 
        organiser: organiser,
      },
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT pentru protecție
      },
    });
    return response.data || []; // Returnăm datele evenimentului pentru utilizator
  } catch (error) {
    console.error("Eroare la preluarea evenimentului pentru organizator:", error);
    return []; // Returnăm null în caz de eroare
  }
}


export const getEventsForUser = async (username) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`http://localhost:8081/participation/my-events`, {
    
      params: { // Aici trecem `username` ca parametru în query
        username: username,
      },
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT pentru protecție
      },
    });
    return response.data || []; // Returnăm datele evenimentului pentru utilizator
  } catch (error) {
    console.error("Eroare la preluarea evenimentului pentru utilizator:", error);
    return []; // Returnăm null în caz de eroare
  }
}

export const leaveEvent = async (title, username) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(
      `http://localhost:8081/participation/leave`, // Trimitem titlul evenimentului și username-ul
      {
        params: { // Aici trecem `title` și `username` ca parametri în query
          title: title,
          username: username,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Eroare la părăsirea evenimentului:", error);
    throw error;
  }
};


export const getEvents = async () => {
  try {
    const response = await axios.get(API_URL);  // Fără token, pentru acces public
    return response.data;
  } catch (error) {
    console.error("Eroare la preluarea evenimentelor:", error);
    return [];
  }
};


export const updateEvent = async (eventName, updatedEventData) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.put(`http://localhost:8081/api/events/update`, 
      updatedEventData,
      {
      params: { name: eventName },
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT pentru protecție
      },
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la actualizarea evenimentului:", error);
    throw error;
  }
}

 export const cancelEvent = async (eventName) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.delete(`http://localhost:8081/api/events/delete`, {
      params: { name: eventName },
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT pentru protecție
      },
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la anularea evenimentului:", error);
    throw error;
  }
}

export const getUserByName = async (username) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`http://localhost:8081/api/user/getByName`, {
      params: { name: username },
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT pentru protecție
      },
    });
    return response.data; // Returnăm datele utilizatorului
  } catch (error) {
    console.error("Eroare la preluarea utilizatorului:", error);
    return null; // Returnăm null în caz de eroare
  }
}