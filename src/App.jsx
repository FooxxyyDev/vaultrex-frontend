import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Enkel demo-login
    if (email === "admin@vaultrex.se" && password === "Leary30!") {
      setUser({ email });
    } else {
      alert("Fel användare eller lösenord!");
    }
  };

  const handleLogout = () => setUser(null);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          {!user && <button className="login-btn" onClick={() => document.getElementById("login-form").classList.toggle("show")}>Login</button>}
          {user && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
        </nav>

        <div id="login-form" className="login-form">
          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Logga in</button>
          </form>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>Välkommen till Vaultrex</h1>
      <p>Vi hjälper dig med inventering och tjänster på ett futuristiskt sätt.</p>
      <div className="services">
        <h2>Mina tjänster</h2>
        <ul>
          <li>Inventariehantering</li>
          <li>Automatiska abonnemang</li>
          <li>QR-scanning (framtida funktion)</li>
        </ul>
      </div>
      <div className="faq">
        <h2>Vanliga frågor</h2>
        <p>Här kan vi ha Q&A om tjänsterna.</p>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Här kan du se och hantera dina tjänster och inventarie.</p>
      <div className="inventory">
        <h2>Inventarie</h2>
        <p>(Data från backend kommer visas här)</p>
      </div>
    </div>
  );
}

export default App;
