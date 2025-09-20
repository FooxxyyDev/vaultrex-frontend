import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">Vaultrex</h1>
        <p className="text-xl mb-8 text-center max-w-lg">
          Hantera lager, tjänster och QR-scanning i ett futuristiskt dashboard.
        </p>
        <button className="px-8 py-3 bg-white text-purple-700 rounded-full font-semibold shadow-lg hover:scale-105 transition">
          Logga in
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20">
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-2">Inventory</h2>
          <p>Hantera och håll koll på ditt lager</p>
        </div>
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-2">Services</h2>
          <p>Hantera dina tjänster och abonnemang</p>
        </div>
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-2">QR-Scan</h2>
          <p>Snabb scanning med din kamera</p>
        </div>
      </div>
    </div>
  );
}

export default App;
