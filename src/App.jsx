import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const login = async () => {
    const res = await fetch("https://vaultrex-backend.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setMessage("");
    } else {
      setMessage(data.message || "Fel inloggning");
    }
  };

  if (user) {
    return (
      <div className="dashboard">
        <h1>Välkommen {user.email}</h1>
        <p>Här kan du se dina tjänster och börja abonnera.</p>
        {/* Här kan vi senare lägga till inventory + abonnemang */}
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      {message && <p className="error">{message}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={login}>Logga in</button>
    </div>
  );
}
