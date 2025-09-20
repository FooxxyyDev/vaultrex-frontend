// Lägg till states högst upp:
const [services, setServices] = useState([]);
const availableServices = ["Bas", "Extra", "Premium"];

// Hämta tjänster
const fetchServices = async () => {
  const res = await fetch(`https://vaultrex-backend.onrender.com/services/${user.id}`);
  const data = await res.json();
  setServices(data);
};

// Prenumerera på tjänst
const subscribeService = async (name) => {
  const res = await fetch(`https://vaultrex-backend.onrender.com/services/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, serviceName: name }),
  });
  const data = await res.json();
  fetchServices();
};

// Lägg till flik i navbar:
{user && <button onClick={() => {setActiveTab("services"); fetchServices();}} className={activeTab === "services" ? "active" : ""}>Mina Tjänster</button>}

// Lägg till sektion för tjänster i main:
{activeTab === "services" && user && (
  <section className="services">
    <h2>Mina Tjänster</h2>
    <ul>
      {availableServices.map((service) => {
        const subscribed = services.find(s => s.name === service && s.status === "active");
        return (
          <li key={service}>
            <span>{service}</span>
            {subscribed ? (
              <button disabled>Abonnerad</button>
            ) : (
              <button onClick={() => subscribeService(service)}>Abonnera</button>
            )}
          </li>
        );
      })}
    </ul>
  </section>
)}
