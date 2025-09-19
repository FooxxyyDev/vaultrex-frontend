import React, { useEffect, useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, category: "" });

  // Fetcha items från backend när sidan laddas
  useEffect(() => {
    fetch("https://vaultrex-backend.onrender.com/api/items")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Fel vid hämtning:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Vaultrex Inventory</h1>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} – {item.quantity} – {item.category}
          </li>
        ))}
      </ul>

      <h2>Add new item</h2>
      <form onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("https://vaultrex-backend.onrender.com/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem)
        });
        const added = await res.json();
        setItems([...items, added]); // Lägg till direkt i listan
        setNewItem({ name: "", quantity: 0, category: "" }); // nollställ formulär
      }}>
        <input
          placeholder="Name"
          value={newItem.name}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          required
        />
        <input
          placeholder="Category"
          value={newItem.category}
          onChange={e => setNewItem({ ...newItem, category: e.target.value })}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
