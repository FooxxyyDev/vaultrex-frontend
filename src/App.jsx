import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/vaultrex-logo.png.png"; // loggan du laddade upp – se till att den ligger i src/assets
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Services from "./Services";

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [theme, setTheme] = useState("dark");

  const API_URL = "https://vaultrex-backend.onrender.com"; // din backend

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setLoginError("Felaktig e-post eller lösenord");
        setIsLoggingIn(false);
        return;
      }

      const data = await res.json();
      setUser(data.user);

      const servicesRes = await fetch(`${API_URL}/services/${data.user.id}`);
      const servicesData = await servicesRes.json();
      setServices(servicesData);
      setIsLoggingIn(false);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setLoginError("Ett fel uppstod vid inloggning");
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <header>
        <img src={logo} alt="Vaultrex Logo" />
      </header>

      <nav className="navbar">
        <Link to="/">Hem</Link>
        <Link to="/login">Logga in</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/services">Tjänster</Link>
        <span style={{ flex: 1 }} />
        <button className="btn btn-outline" onClick={toggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
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

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/services" element={<Services services={services} />} />
      </Routes>
    </>
  );
}

export default App;
