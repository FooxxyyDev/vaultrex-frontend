import React, { useEffect, useState } from "react";
import "./App.css"; // CSS för layout och styling

export default function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, category: "" });

  // Hämta items från backend när sidan laddas
  useEffect(() => {
    fetch("https://vaultrex-backend.onrender.com/api/items")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Fel vid hämtning:", err));
  }, []);

  // Lägg till nytt item
  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || newItem.quantity <= 0 || !newItem.category) return;

    try {
      const res = await fetch("https://vaultrex-backend.onrender.com/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
      const added = await res.json();
      setItems([...items, added]); // Lägg till direkt i listan
      setNewItem({ name: "", quantity: 0, category: "" }); // nollställ formulär
    } catch (err) {
      console.error("Fel vid tillägg:", err);
    }
  };

  return (
    <div className="container">
      <h1>Vaultrex Inventory</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>No items yet</td>
            </tr>
          ) : (
            items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.category}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>Add New Item</h2>
      <form onSubmit={addItem} className="item-form">
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
