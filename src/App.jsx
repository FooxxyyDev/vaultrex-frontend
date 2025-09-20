import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">Vaultrex</div>
        <nav>
          <ul>
            <li><a href="#hero">Startsida</a></li>
            <li><a href="#services">Tjänster</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li>
              <button className="login-btn" onClick={() => setShowLogin(true)}>Logga in</button>
            </li>
          </ul>
        </nav>
      </header>

      <section id="hero" className="hero">
        <h1>Välkommen till Vaultrex</h1>
        <p>Smarta inventerings- & abonnemangstjänster för framtiden</p>
        <a href="#services" className="cta">Se våra tjänster</a>
      </section>

      <section id="services" className="services">
        <h2>Våra tjänster</h2>
        <div className="service-cards">
          <div className="card">
            <h3>Inventeringssystem</h3>
            <p>Håll koll på ditt lager automatiskt och smidigt.</p>
          </div>
          <div className="card">
            <h3>QR-Kod scanning</h3>
            <p>Skanna och uppdatera lager direkt med mobilen.</p>
          </div>
          <div className="card">
            <h3>Abonnemang</h3>
            <p>Koppla produkter till abonnemang för enkel hantering.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="faq">
        <h2>Vanliga frågor</h2>
        <div className="faq-item">
          <h4>Hur fungerar Vaultrex?</h4>
          <p>Vaultrex är en komplett plattform för lager och tjänster.</p>
        </div>
        <div className="faq-item">
          <h4>Kan jag skräddarsy abonnemang?</h4>
          <p>Ja, du kan konfigurera allt efter behov.</p>
        </div>
      </section>

      {showLogin && (
        <div className="login-modal">
          <div className="login-content">
            <span className="close" onClick={() => setShowLogin(false)}>&times;</span>
            <h2>Logga in</h2>
            <form>
              <input type="email" placeholder="E-post" required />
              <input type="password" placeholder="Lösenord" required />
              <button type="submit" className="login-submit">Logga in</button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 Vaultrex. Alla rättigheter reserverade.</p>
      </footer>
    </div>
  );
}
