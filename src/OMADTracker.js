import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FirebaseAuth from "./FirebaseAuth";

export default function OMADTracker() {
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "entries"),
          where("uid", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setEntries(data);
      } else {
        setEntries([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addEntry = async () => {
    if (!weight || !user) return;
    const now = new Date();
    const timestamp = now.toLocaleString();
    const newEntry = {
      date: timestamp,
      weight: parseFloat(weight),
      note,
      uid: user.uid
    };

    try {
      const docRef = await addDoc(collection(db, "entries"), newEntry);
      setEntries([...entries, { id: docRef.id, ...newEntry }]);
    } catch (error) {
      console.error("🔥 Lỗi khi ghi Firestore:", error);
      alert("Không thể lưu dữ liệu vào Firebase! Xem lỗi trong F12 > Console.");
    }

    setWeight("");
    setNote("");
  };

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "entries", id));
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("🔥 Lỗi khi xoá Firestore:", error);
      alert("Không thể xoá dữ liệu! Xem lỗi trong F12 > Console.");
    }
  };

  return (
    <div>
      <FirebaseAuth />

      {!user ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Vui lòng đăng nhập để sử dụng trình theo dõi OMAD.
        </p>
      ) : (
        <div
          style={{
            padding: "20px",
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "Arial"
          }}
        >
          <h1 style={{ textAlign: "center" }}>OMAD Weight Loss Tracker</h1>

          <div style={{ marginBottom: "20px" }}>
            <label>Hôm nay bạn nặng bao nhiêu? (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ví dụ: 74.8"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                marginBottom: "15px"
              }}
            />

            <label>Ghi chú hôm nay (nếu có)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Đói nhiều, ngủ ngon, tập thể dục nhẹ..."
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                marginBottom: "15px"
              }}
            />

            <button
              onClick={addEntry}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Thêm bản ghi
            </button>
          </div>

          {entries.length > 0 && (
            <div>
              <h2>Biểu đồ cân nặng</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={entries}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>

              <h3 style={{ marginTop: "30px" }}>Danh sách bản ghi</h3>
              <ul>
                {entries.map((entry) => (
                  <li key={entry.id} style={{ margin: "10px 0" }}>
                    <strong>{entry.date}</strong>: {entry.weight} kg – {entry.note}
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      style={{
                        marginLeft: "10px",
                        color: "white",
                        backgroundColor: "red",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer"
                      }}
                    >
                      Xoá
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
