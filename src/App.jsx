import React, { useState } from "react";
import "./App.css";
import logo from "./logo.png"; // lägg din logga i src/ som logo.png

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="App">
      {/* HEADER */}
      <header className="site-header">
        <div className="logo-wrapper">
          <img src={logo} alt="Vaultrex Logo" className="logo" />
          <h1 className="site-title">Vaultrex</h1>
        </div>
        <nav className="nav-links">
          <a href="#services">Tjänster</a>
          <a href="#faq">FAQ</a>
          <button className="login-btn" onClick={() => setShowLogin(!showLogin)}>
            Logga in
          </button>
        </nav>
      </header>

      {/* LANDING */}
      <section className="hero">
        <div className="hero-content">
          <h1>Välkommen till Vaultrex</h1>
          <p>
            Smarta lösningar för lagerhantering och tjänster. Automatisera
            beställningar och hantera allt enkelt online.
          </p>
          <a href="#services" className="cta-btn">
            Våra tjänster
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <h2>Våra tjänster</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Bas</h3>
            <p>
              Hantera ditt lager smidigt med grundfunktioner för inventering och
              scanning.
            </p>
          </div>
          <div className="service-card">
            <h3>Extra</h3>
            <p>
              Få automatiska beställningar, avancerad statistik och premium
              support.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <h2>Vanliga frågor</h2>
        <div className="faq-item">
          <h4>Hur fungerar systemet?</h4>
          <p>
            Vaultrex automatiserar din lagerhantering och kopplas till dina
            befintliga system.
          </p>
        </div>
        <div className="faq-item">
          <h4>Kan jag prova gratis?</h4>
          <p>Ja, du kan prova vårt baspaket gratis i 14 dagar.</p>
        </div>
      </section>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Logga in</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Skicka login request här
                alert("Login skickat");
              }}
            >
              <label>
                Email
                <input type="email" placeholder="Din email" required />
              </label>
              <label>
                Lösenord
                <input type="password" placeholder="Lösenord" required />
              </label>
              <button type="submit">Logga in</button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Vaultrex AB</p>
      </footer>
    </div>
  );
}
