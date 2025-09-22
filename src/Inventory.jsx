import React, { useEffect, useState, Suspense } from "react";
import { getRole, canConsume } from "./auth";
const LazyQrScanner = React.lazy(() =>
  import("@yudiel/react-qr-scanner").then((m) => ({ default: m.QrScanner }))
);

export default function Inventory() {
  const [scanResult, setScanResult] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [lastAction, setLastAction] = useState("");
  const [role] = useState(getRole());

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      {isClient ? (
        <Suspense fallback={<div>Loading scanner…</div>}>
          <LazyQrScanner
            onDecode={(result) => {
              if (result) {
                setScanResult(result);
                if (!canConsume(role)) {
                  setLastAction("Behörighet saknas för att konsumera.");
                  return;
                }
                import("./store").then(({ consumeByCode }) => {
                  const out = consumeByCode(String(result).trim(), 1);
                  if (out?.product) {
                    setLastAction(`Konsumerade 1 st av ${out.product.name}. Nytt saldo: ${out.product.onHand}`);
                  } else if (out?.error) {
                    setLastAction(`Fel: ${out.error}`);
                  }
                });
              }
            }}
            onError={(error) => {
              if (error) console.error(error);
            }}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        </Suspense>
      ) : (
        <div>Preparing camera…</div>
      )}
      <p>Senast skannade: {scanResult}</p>
      {lastAction && <p>{lastAction}</p>}
    </div>
  );
}

