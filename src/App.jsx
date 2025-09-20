import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Inventory from "./Inventory";
import Services from "./Services";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (email, password) => {
    if (email === "admin@vaultrex.se" && password === "Leary30!") {
      setUser({ email });
    } else {
      alert("Fel email eller lösenord");
    }
  };

  const handleLogout = () => setUser(null);

  return (
    <div className="app-container">
      <header>
        <h1>Vaultrex Inventory</h1>
        {user ? (
          <button onClick={handleLogout}>Logga ut</button>
        ) : (
          <Link to="/login">Logga in</Link>
        )}
        <nav>
          <Link to="/">Startsida</Link>
          {user && <Link to="/inventory">Inventory</Link>}
          {user && <Link to="/services">Tjänster</Link>}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<div>Välkommen till Vaultrex! Här kan du se våra tjänster.</div>} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {user && <Route path="/inventory" element={<Inventory />} />}
          {user && <Route path="/services" element={<Services />} />}
        </Routes>
      </main>
    </div>
  );
}

export default App;
