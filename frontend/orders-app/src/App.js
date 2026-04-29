import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async () => {
    if (!customerName || !product) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, product, quantity }),
      });
      setCustomerName("");
      setProduct("");
      setQuantity(1);
      fetchOrders();
    } catch (err) {
      console.error("Failed to create order:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Orders</h1>

      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h2>Add Order</h2>
        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="Product"
          value={product}
          onChange={e => setProduct(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(parseInt(e.target.value))}
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: "10px 24px", background: "#0070f3", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          {loading ? "Saving..." : "Add Order"}
        </button>
      </div>

      <h2>Order List</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0070f3", color: "white" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Customer</th>
              <th style={{ padding: 8, textAlign: "left" }}>Product</th>
              <th style={{ padding: 8, textAlign: "left" }}>Qty</th>
              <th style={{ padding: 8, textAlign: "left" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{order.customerName}</td>
                <td style={{ padding: 8 }}>{order.product}</td>
                <td style={{ padding: 8 }}>{order.quantity}</td>
                <td style={{ padding: 8 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;