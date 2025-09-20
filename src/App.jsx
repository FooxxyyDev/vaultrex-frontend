import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([
    { id: 1, name: "Artikel A", quantity: 10 },
    { id: 2, name: "Artikel B", quantity: 5 }
  ]);
  const [scanResult, setScanResult] = useState("");

  const handleLogin = (email, password) => {
    // Hardkodad admin login
    if(email === "admin@vaultrex.se" && password === "Leary30!") {
      setUser({ email });
    } else {
      alert("Fel e-post eller lösenord!");
    }
  };

  const handleLogout = () => setUser(null);

  const handleScan = (result) => {
    if(result) {
      setScanResult(result.text || result);
      // Simulera att decrementa artikeln
      setInventory((prev) =>
        prev.map((item) =>
          item.id === 1 ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Vaultrex Inventory</h1>
          {user && <button onClick={handleLogout} className="logout-btn">Logga ut</button>}
        </header>

        <nav className="nav">
          <Link to="/">Startsida</Link>
          {user && <Link to="/inventory">Inventory</Link>}
          {user && <Link to="/scanner">QR Scanner</Link>}
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home">
              {!user ? (
                <LoginForm onLogin={handleLogin} />
              ) : (
                <div>
                  <h2>Välkommen, {user.email}</h2>
                  <p>Välj flik för att se inventarie eller scanna QR-koder.</p>
                </div>
              )}
            </div>
          }/>

          <Route path="/inventory" element={
            user ? (
              <Inventory inventory={inventory} />
            ) : <Navigate to="/" />
          }/>

          <Route path="/scanner" element={
            user ? (
              <QRScanner scanResult={scanResult} onScan={handleScan} />
            ) : <Navigate to="/" />
          }/>
        </Routes>
      </div>
    </Router>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={submit} className="login-form">
      <h2>Logga in</h2>
      <input type="email" placeholder="E-post" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Lösenord" value={password} onChange={(e)=>setPassword(e.target.value)} required />
      <button type="submit">Logga in</button>
    </form>
  );
}

function Inventory({ inventory }) {
  return (
    <div className="inventory">
      <h2>Inventarie</h2>
      <table>
        <thead>
          <tr>
            <th>Namn</th>
            <th>Antal</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QRScanner({ scanResult, onScan }) {
  return (
    <div className="scanner">
      <h2>QR Scanner</h2>
      <Scanner
        onDecode={onScan}
        onError={(err) => console.error(err)}
      />
      <p>Senaste scan: {scanResult}</p>
    </div>
  );
}

export default App;
