import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5010/api/users/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/tasks');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>FlashLink</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Connexion</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
