import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css'; 

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifică dacă parolele introduse coincid
    if (password !== confirmPassword) {
      alert("Parolele nu se potrivesc!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          age,
          gender,
        }),
      });
      
      const contentType = response.headers.get('Content-Type');

      if (!response.ok) {
       

      const errorMessage =
        contentType && contentType.includes('application/json')
          ? (await response.json()).message
          : await response.text(); // Obține mesaj de eroare din răspunsul text
      throw new Error(errorMessage || 'A apărut o eroare la înscriere');
    }

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log('User created:', data);
    alert('Cont creat cu succes! ');
//de aici
const response2 = await fetch('http://localhost:8080/realms/eventmate/protocol/openid-connect/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'password',
    client_id: 'eventmate-client',
    username,
    password,
  }),
});

if (!response2.ok) {
  throw new Error('Login failed');
}

const data2 = await response2.json();
console.log(data2);

localStorage.setItem('access_token', data2.access_token);

navigate('/');
//pana aici
    //alert('Cont creat cu succes! Te poți autentifica acum.');
    //navigate('/login'); // Navighează către pagina de login după succes
  } catch (error) {
    console.error('Sign up error:', error);
    alert(error.message);
  }


  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Vârstă"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="" disabled hidden>Selectează Genul</option>
          <option value="FEMALE">Femeie</option>
          <option value="MALE">Bărbat</option>
        </select>
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmă Parola"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Creează Cont</button>
      </form>
    </div>
  );
};

export default SignUpForm;