import React, { useState } from "react";
import "./App.css";
import logo from ".logo.png"; // loggan du laddade upp – se till att den ligger i src/assets

function App() {
  const [page, setPage] = useState("landing"); // landing, login, dashboard
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [services, setServices] = useState([]);

  const API_URL = "https://vaultrex-backend.onrender.com"; // din backend

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Felaktig e-post eller lösenord");
        return;
      }

      const data = await res.json();
      // hämta tjänster
      const servicesRes = await fetch(`${API_URL}/services/${data.user.id}`);
      const servicesData = await servicesRes.json();
      setServices(servicesData);
      setPage("dashboard");
    } catch (err) {
      console.error(err);
      alert("Ett fel uppstod vid inloggning");
    }
  };

  return (
    <>
      {/* Header med logga */}
      <header>
        <img src={logo} alt="Vaultrex Logo" />
      </header>

      {/* Landing Page */}
      {page === "landing" && (
        <div className="landing-page">
          <h1>Välkommen till Vaultrex</h1>
          <p>
            Smidig hantering av inventarier och tjänster. Logga in för att få
            full kontroll på ditt konto.
          </p>
          <button onClick={() => setPage("login")}>Logga in</button>
        </div>
      )}

      {/* Login Page */}
      {page === "login" && (
        <div className="login-container">
          <div className="login-box">
            <h2>Logga in</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="E-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Logga in</button>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {page === "dashboard" && (
        <div className="dashboard">
          <h2>Dina tjänster</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <h3>{service.name}</h3>
                <p>Status: {service.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
