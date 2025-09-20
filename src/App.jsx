import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1 });
  const [services, setServices] = useState([]);
  const availableServices = ["Bas", "Extra", "Premium"];

  const API_URL = "https://vaultrex-backend.onrender.com";

  // --- Auth ---
  const login = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.id) setUser(data);
    else alert("Fel användare/lösenord");
  };

  const logout = () => {
    setUser(null);
    setActiveTab("home");
  };

  // --- Inventory ---
  const fetchInventory = async () => {
    if (!user) return;
    const res = await fetch(`${API_URL}/inventory/${user.id}`);
    const data = await res.json();
    setInventory(data);
  };

  const addItem = async () => {
    if (!user) return;
    const res = await fetch(`${API_URL}/inventory/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, ...newItem }),
    });
    await res.json();
    setNewItem({ name: "", quantity: 1 });
    fetchInventory();
  };

  // --- Services ---
  const fetchServices = async () => {
    if (!user) return;
    const res = await fetch(`${API_URL}/services/${user.id}`);
    const data = await res.json();
    setServices(data);
  };

  const subscribeService = async (name) => {
    if (!user) return;
    await fetch(`${API_URL}/services/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, serviceName: name }),
    });
    fetchServices();
  };

  useEffect(() => {
    if (user) {
      fetchInventory();
      fetchServices();
    }
  }, [user]);

  // --- Render ---
  return (
    <div className="app">
      <header>
        <h1>Vaultrex Dashboard</h1>
        <nav>
          <button onClick={() => setActiveTab("home")} className={activeTab==="home"?"active":""}>Startsida</button>
          {user && <button onClick={()=>setActiveTab("inventory")} className={activeTab==="inventory"?"active":""}>Inventarie</button>}
          {user && <button onClick={()=>{setActiveTab("services"); fetchServices();}} className={activeTab==="services"?"active":""}>Mina Tjänster</button>}
          {!user ? <button onClick={()=>setActiveTab("login")} className={activeTab==="login"?"active":""}>Login</button> : <button onClick={logout}>Logga ut</button>}
        </nav>
      </header>

      <main>
        {activeTab === "home" && (
          <section className="home">
            <h2>Välkommen till Vaultrex</h2>
            <p>Företaget som gör din inventariehantering enkel och smart.</p>
          </section>
        )}

        {activeTab === "login" && !user && (
          <section className="login">
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button onClick={login}>Logga in</button>
          </section>
        )}

        {activeTab === "inventory" && user && (
          <section className="inventory">
            <h2>Inventarie</h2>
            <div className="add-item">
              <input type="text" placeholder="Item name" value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})}/>
              <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={e=>setNewItem({...newItem,quantity:e.target.value})}/>
              <button onClick={addItem}>Lägg till</button>
            </div>
            <ul>
              {inventory.map(item=>(
                <li key={item.id}>{item.name} - {item.quantity}</li>
              ))}
            </ul>
          </section>
        )}

        {activeTab === "services" && user && (
          <section className="services">
            <h2>Mina Tjänster</h2>
            <ul>
              {availableServices.map(service=>{
                const subscribed = services.find(s=>s.name===service && s.status==="active");
                return (
                  <li key={service}>
                    <span>{service}</span>
                    {subscribed ? <button disabled>Abonnerad</button> : <button onClick={()=>subscribeService(service)}>Abonnera</button>}
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
