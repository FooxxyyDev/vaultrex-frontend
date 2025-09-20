import { useState } from "react";
import "./App.css";

const API_URL = "https://vaultrex-backend.onrender.com"; // byt till din backend URL

function App() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([
    { name: "Bas Tjänst", status: "Tillgänglig" },
    { name: "Extra Tjänst 1", status: "Tillgänglig" },
    { name: "Extra Tjänst 2", status: "Tillgänglig" },
  ]);

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data && data.id) {
        setUser(data);
        setTab("services");
        fetchInventory(data.id);
      } else {
        alert("Felaktig inloggning!");
      }
    } catch (err) {
      alert("Fel vid inloggning!");
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setTab("home");
  };

  const fetchInventory = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/inventory/${userId}`);
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Vaultrex Inventory</h1>
        <nav>
          <button onClick={() => setTab("home")} className={tab === "home" ? "active" : ""}>Startsida</button>
          {user && (
            <>
              <button onClick={() => setTab("services")} className={tab === "services" ? "active" : ""}>Mina Tjänster</button>
              <button onClick={() => setTab("inventory")} className={tab === "inventory" ? "active" : ""}>Inventory</button>
              <button onClick={logout}>Logga ut</button>
            </>
          )}
          {!user && <button onClick={() => setTab("login")} className={tab === "login" ? "active" : ""}>Login</button>}
        </nav>
      </header>

      <main>
        {tab === "home" && (
          <section className="home">
            <h2>Välkommen till Vaultrex</h2>
            <p>Vi hanterar ditt lager och dina tjänster på ett smart och futuristiskt sätt.</p>
          </section>
        )}

        {tab === "login" && !user && (
          <section className="login">
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Lösenord" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Logga in</button>
          </section>
        )}

        {tab === "services" && user && (
          <section className="services">
            <h2>Mina Tjänster</h2>
            <ul>
              {services.map((s, idx) => (
                <li key={idx}>
                  {s.name} - {s.status}
                  <button onClick={() => alert(`Abonnerar på ${s.name}`)}>Abonnera</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "inventory" && user && (
          <section className="inventory">
            <h2>Inventory</h2>
            <ul>
              {inventory.map((i) => (
                <li key={i.id}>{i.name} - {i.quantity}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
