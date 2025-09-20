import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QRScanner from "@yudiel/react-qr-scanner";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qrResult, setQrResult] = useState("");

  const handleLogin = () => {
    // Dummy login för demo: admin@vaultrex.se / Leary30!
    if (email === "admin@vaultrex.se" && password === "Leary30!") {
      setUser({ email });
    } else {
      alert("Fel email eller lösenord");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setQrResult("");
  };

  const handleScan = (result) => {
    if (result) setQrResult(result);
  };

  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/">Start</Link>
          {user ? (
            <>
              <Link to="/services">Mina Tjänster</Link>
              <button onClick={handleLogout}>Logga ut</button>
            </>
          ) : (
            <Link to="/login">Logga in</Link>
          )}
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="home">
                <h1>Välkommen till Vaultrex</h1>
                <p>Här kan du hantera inventarier och tjänster smidigt.</p>
              </div>
            }
          />

          <Route
            path="/login"
            element={
              !user && (
                <div className="login-box">
                  <h2>Logga in</h2>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={handleLogin}>Logga in</button>
                </div>
              )
            }
          />

          <Route
            path="/services"
            element={
              user && (
                <div className="services">
                  <h2>Mina Tjänster</h2>
                  <p>Scan QR-kod för att dra av artiklar:</p>
                  <QRScanner
                    onResult={(result) => handleScan(result)}
                    style={{ width: "300px", margin: "20px auto" }}
                  />
                  {qrResult && <p>Senast skannade: {qrResult}</p>}
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
