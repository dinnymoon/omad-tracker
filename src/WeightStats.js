export default function WeightStats({ entries }) {
  if (!entries || entries.length === 0) return null;

  const weights = entries.map(e => e.weight);
  const total = weights.reduce((a, b) => a + b, 0);
  const avg = (total / weights.length).toFixed(2);
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const start = weights[0];
  const end = weights[weights.length - 1];
  const diff = (end - start).toFixed(2);

  return (
    <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
      <h3>📈 Thống kê tổng quan</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li>
            <strong>Số ngày nhập:</strong>{" "}
            {
            new Set(entries.map(e => new Date(e.date).toLocaleDateString("en-CA")))
            .size
            }
           </li>
        <li><strong>Trung bình:</strong> {avg} kg</li>
        <li><strong>Cao nhất:</strong> {max} kg</li>
        <li><strong>Thấp nhất:</strong> {min} kg</li>
        <li><strong>Thay đổi từ ngày đầu đến cuối:</strong> {diff} kg</li>
      </ul>
    </div>
  );
}
