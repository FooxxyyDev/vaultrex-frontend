import React from "react";

export default function Services({ services = [] }) {
  return (
    <div className="dashboard">
      <h2>Dina tjänster</h2>
      <div className="services-grid">
        {services.length === 0 && <p>Inga tjänster att visa ännu.</p>}
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>Status: {service.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

