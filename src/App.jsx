import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      loadData(data.user.id);
    } else {
      alert('Fel inloggning');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const loadData = async (userId) => {
    const inv = await fetch(`${API_URL}/inventory/${userId}`).then(r=>r.json());
    const serv = await fetch(`${API_URL}/services/${userId}`).then(r=>r.json());
    setInventory(inv);
    setServices(serv);
  };

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      loadData(parsed.id);
    }
  }, []);

  if (!user) {
    return (
      <div className="landing">
        <header>
          <h1>Vaultrex</h1>
          <nav>
            <a href="#services">Tjänster</a>
            <a href="#faq">FAQ</a>
            <button onClick={() => setShowLogin(!showLogin)}>Logga in</button>
          </nav>
        </header>

        <section className="hero">
          <h2>Välkommen till Vaultrex</h2>
          <p>Smart inventering & tjänstehantering</p>
        </section>

        <section id="services">
          <h3>Våra Tjänster</h3>
          <ul>
            <li>Inventeringssystem</li>
            <li>Automatisk beställning</li>
            <li>QR-skanning</li>
          </ul>
        </section>

        <section id="faq">
          <h3>FAQ</h3>
          <p><b>Hur fungerar tjänsten?</b> Du loggar in och hanterar dina produkter och tjänster.</p>
          <p><b>Kan jag testa gratis?</b> Ja, kontakta oss.</p>
        </section>

        {showLogin && (
          <div className="login-modal">
            <div className="login-box">
              <h3>Logga in</h3>
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
          </div>
        )}
      </div>
    );
  }

  // Dashboard
  return (
    <div className="dashboard">
      <header>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logga ut</button>
      </header>
      <section>
        <h3>Dina produkter</h3>
        <ul>
          {inventory.map(item => (
            <li key={item.id}>{item.name} ({item.quantity})</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Dina tjänster</h3>
        <ul>
          {services.map(s => (
            <li key={s.id}>{s.name} - {s.status}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
