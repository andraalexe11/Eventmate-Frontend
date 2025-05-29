import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css'; 

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/realms/eventmate/protocol/openid-connect/token', {
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

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data);

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('isAuthenticated', true);

      navigate('/'); // sau unde vrei să duci utilizatorul după login
    } catch (error) {
      console.error('Login error', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <h2 >Autentificare</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Intră în cont</button>
      </form>
    </div>
  );
}

export default LoginForm;
