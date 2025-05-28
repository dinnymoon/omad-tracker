// OMADTracker.js (React + Tailwind CSS)
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function OMADTracker() {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "weights"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEntries(data);
      });
    }
  }, [user]);

  const addEntry = async () => {
    if (!weight) return;
    try {
      await addDoc(collection(db, "weights"), {
        weight: parseFloat(weight),
        note,
        timestamp: new Date(),
        uid: user.uid
      });
      setWeight("");
      setNote("");
    } catch (error) {
      console.error("Lỗi khi thêm dữ liệu:", error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "weights", id));
    } catch (error) {
      console.error("Xoá thất bại:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      {!user ? (
        <p className="text-center text-gray-600">Vui lòng đăng nhập để sử dụng</p>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
              )}
              <div>
                <p className="text-gray-700 font-medium">
                  {user.displayName || "Người dùng"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="text-red-600 hover:underline text-sm"
            >
              Đăng xuất
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            OMAD Weight Loss Tracker
          </h1>

          <div className="mb-6 bg-white shadow-md rounded-xl p-4">
            <label className="block mb-2 font-medium">Cân nặng hôm nay (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Ví dụ: 74.8"
            />
            <label className="block mb-2 font-medium">Ghi chú (nếu có)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Ngủ ngon, đói nhiều, tập thể dục..."
            />
            <button
              onClick={addEntry}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Thêm bản ghi
            </button>
          </div>

          {entries.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Biểu đồ cân nặng</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={entries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={(entry) =>
                      format(new Date(entry.timestamp?.seconds * 1000), "dd/MM")
                    }
                  />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>

              <ul className="mt-6 space-y-3">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="bg-gray-100 p-3 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <strong>
                        {format(
                          new Date(entry.timestamp?.seconds * 1000),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </strong>
                      <div>
                        {entry.weight} kg – {entry.note || "Không ghi chú"}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-800"
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
