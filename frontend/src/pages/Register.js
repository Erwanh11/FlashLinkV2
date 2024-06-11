import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Assurez-vous d'importer le fichier CSS

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5010/api/users/register', { name, email, password });
      if (response && response.data) {
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      } else {
        console.error('No response data');
      }
    } catch (error) {
      setError('Error: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>FlashLink</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
