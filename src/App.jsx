import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/vaultrex-logo.png.png"; // loggan du laddade upp – se till att den ligger i src/assets
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Services from "./Services";
import Products from "./Products";
import Vendors from "./Vendors";
import PurchaseOrders from "./PurchaseOrders";
import { Roles, getRole, setRole } from "./auth";

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [role, setRoleState] = useState(getRole());

  const API_URL = "https://vaultrex-backend.onrender.com"; // din backend

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    // Restore user session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Fetch services for restored user
        fetch(`${API_URL}/services/${parsed.id}`)
          .then((r) => (r.ok ? r.json() : []))
          .then((data) => setServices(Array.isArray(data) ? data : []))
          .catch(() => {});
      } catch (_) {}
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const onChangeRole = (e) => {
    const r = e.target.value;
    setRole(r);
    setRoleState(r);
  };

  async function tryFetchJson(url, options) {
    const res = await fetch(url, options);
    let payload = null;
    try {
      payload = await res.json();
    } catch (_) {
      // ignore non-JSON
    }
    return { ok: res.ok, status: res.status, data: payload };
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      // Try /login then fallback to /api/login
      let loginResp = await tryFetchJson(`${API_URL}/login`, options);
      if (!loginResp.ok) {
        const fallback = await tryFetchJson(`${API_URL}/api/login`, options);
        if (fallback.ok) loginResp = fallback;
      }

      if (!loginResp.ok || !loginResp.data?.user) {
        const msg = loginResp.data?.error || loginResp.data?.message || "Felaktig e-post eller lösenord";
        setLoginError(msg);
        setIsLoggingIn(false);
        return;
      }

      const data = loginResp.data;
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Fetch services with fallback path
      let servicesResp = await tryFetchJson(`${API_URL}/services/${data.user.id}`, { method: "GET", headers: { Accept: "application/json" } });
      if (!servicesResp.ok) {
        const sfb = await tryFetchJson(`${API_URL}/api/services/${data.user.id}`, { method: "GET", headers: { Accept: "application/json" } });
        if (sfb.ok) servicesResp = sfb;
      }
      setServices(Array.isArray(servicesResp.data) ? servicesResp.data : []);
      setIsLoggingIn(false);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setLoginError("Ett fel uppstod vid inloggning");
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setServices([]);
    localStorage.removeItem("user");
    navigate("/");
  };

  function ProtectedRoute({ children }) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return (
    <>
      <header>
        <img src={logo} alt="Vaultrex Logo" />
      </header>

      <nav className="navbar">
        <Link to="/">Hem</Link>
        {!user && <a href="#services">Tjänster</a>}
        {!user && <a href="#pricing">Priser</a>}
        {!user && <a href="#faq">FAQ</a>}
        {!user && <Link to="/login">Logga in</Link>}
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <Link to="/inventory">Inventory</Link>}
        {user && <Link to="/products">Produkter</Link>}
        {user && <Link to="/vendors">Leverantörer</Link>}
        {user && <Link to="/pos">Inköpsorder</Link>}
        {user && <Link to="/services">Tjänster</Link>}
        <span style={{ flex: 1 }} />
        <button className="btn btn-outline" onClick={toggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        {user && (
          <select value={role} onChange={onChangeRole} style={{ marginLeft: 8 }}>
            <option value={Roles.Admin}>Admin</option>
            <option value={Roles.Buyer}>Buyer</option>
            <option value={Roles.Picker}>Picker</option>
            <option value={Roles.Viewer}>Viewer</option>
          </select>
        )}
        {user && (
          <button className="btn btn-outline" onClick={handleLogout} style={{ marginLeft: 8 }}>
            Logga ut
          </button>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="landing-page">
              <h1>Välkommen till Vaultrex</h1>
              <p>
                Smidig hantering av inventarier och tjänster. Logga in för att få
                full kontroll på ditt konto.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={() => navigate("/login")}>Logga in</button>
                <a className="btn btn-outline" href="#features">Läs mer</a>
              </div>

              <section id="services" style={{ marginTop: 80 }}>
                <h2 style={{ marginBottom: 12 }}>Tjänster</h2>
                <p style={{ margin: "0 auto 28px", maxWidth: 760 }}>
                  Basplattform för inventariehantering och tillägg för att växa med behov.
                </p>
                <div className="services-grid">
                  <div className="service-card"><h3>Bas</h3><p>Inventarielista, in/utloggning, enkel rapport.</p></div>
                  <div className="service-card"><h3>Addons</h3><p>QR‑skanning, avancerade rapporter, API‑åtkomst.</p></div>
                  <div className="service-card"><h3>All‑in‑One</h3><p>Alla funktioner, prioriterad support, onboarding.</p></div>
                </div>
              </section>

              <section id="pricing" style={{ marginTop: 80 }}>
                <h2 style={{ marginBottom: 12 }}>Priser</h2>
                <div className="services-grid">
                  <div className="service-card"><h3>Bas</h3><p>Från 0 kr/mån</p><button className="btn btn-primary" onClick={() => navigate("/login")}>Kom igång</button></div>
                  <div className="service-card"><h3>Addons</h3><p>Från 199 kr/mån</p><button className="btn btn-outline" onClick={() => navigate("/login")}>Välj Addons</button></div>
                  <div className="service-card"><h3>All‑in‑One</h3><p>Från 499 kr/mån</p><button className="btn btn-primary" onClick={() => navigate("/login")}>Starta All‑in‑One</button></div>
                </div>
              </section>

              <section id="faq" style={{ marginTop: 80, textAlign: "left", maxWidth: 760, marginInline: "auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: 12 }}>FAQ</h2>
                <details style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 10, marginBottom: 10 }}>
                  <summary>Hur fungerar QR‑skanningen?</summary>
                  <p>Öppna Inventory och rikta kameran mot koden. Objektet matchas automatiskt.</p>
                </details>
                <details style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 10, marginBottom: 10 }}>
                  <summary>Kan vi exportera rapporter?</summary>
                  <p>Ja, rapporter finns i Bas och utökas med Addons för avancerade filter.</p>
                </details>
                <details style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 10 }}>
                  <summary>Finns det support?</summary>
                  <p>All‑in‑One inkluderar prioriterad support och onboarding.</p>
                </details>
              </section>

              <section id="contact" style={{ marginTop: 80, maxWidth: 760, marginInline: "auto", textAlign: "left" }}>
                <h2>Kontakt</h2>
                <form onSubmit={(e) => { e.preventDefault(); alert("Tack! Vi hör av oss."); }}>
                  <div style={{ display: "grid", gap: 12 }}>
                    <input type="text" placeholder="Namn" required className="contact-input" />
                    <input type="email" placeholder="E‑post" required className="contact-input" />
                    <textarea placeholder="Meddelande" rows={4} required className="contact-input" />
                    <button className="btn btn-primary" type="submit">Skicka</button>
                  </div>
                </form>
              </section>
            </div>
          }
        />

        <Route
          path="/login"
          element={
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
                  <button type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? "Loggar in..." : "Logga in"}
                  </button>
                  {loginError && (
                    <p style={{ color: "#ff6b6b", marginTop: 8 }}>{loginError}</p>
                  )}
                </form>
              </div>
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <Vendors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <PurchaseOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services services={services} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
