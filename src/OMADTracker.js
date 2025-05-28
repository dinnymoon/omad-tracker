import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function OMADTracker() {
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");

  // Load data from localStorage when app loads
  useEffect(() => {
    const stored = localStorage.getItem("omad-entries");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage when entries change
  useEffect(() => {
    localStorage.setItem("omad-entries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!weight) return;
    const date = new Date().toLocaleDateString();
    setEntries([...entries, { date, weight: parseFloat(weight), note }]);
    setWeight("");
    setNote("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>OMAD Weight Loss Tracker</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Hôm nay bạn nặng bao nhiêu? (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Ví dụ: 74.8"
          style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "15px" }}
        />

        <label>Ghi chú hôm nay (nếu có)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ví dụ: Đói nhiều, ngủ ngon, tập thể dục nhẹ..."
          style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "15px" }}
        />

        <button onClick={addEntry} style={{ padding: "10px 20px", cursor: "pointer" }}>Thêm bản ghi</button>
      </div>

      {entries.length > 0 && (
        <div>
          <h2>Biểu đồ cân nặng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={entries} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
