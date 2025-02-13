import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css'; // Importing CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
     try {
          fetch(`${import.meta.env.VITE_APP_URL}/auth/login`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email,password})
          }).then((res)=>{
            return res.json()
          }).then((data)=>{
            console.log("data",data)
            localStorage.setItem("token",data.token)
            alert('Login successful!');
            navigate('/udhari');
          })
     } catch (error) {
        
     }
  };

  // console.log("VITE_APP_URL",import.meta.env.VITE_APP_URL)

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
