import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function ExtendedStats({ entries }) {
  if (!entries || entries.length === 0) return null;

  const parseDate = (entry) => new Date(entry.date);

  const filterByInterval = (start, end) => {
    const filtered = entries.filter(e => {
      const d = parseDate(e);
      return isWithinInterval(d, { start, end });
    });
    return filtered;
  };

  const countUniqueDays = (list) => {
    const daySet = new Set(list.map(e => new Date(e.date).toLocaleDateString("en-CA")));
    return daySet.size;
  };

  const calculateStats = (list) => {
    if (list.length === 0) return null;
    const weights = list.map(e => e.weight);
    const avg = (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(2);
    const max = Math.max(...weights);
    const min = Math.min(...weights);
    const count = countUniqueDays(list);
    return { avg, max, min, count };
  };

  const now = new Date();

  const weekStats = calculateStats(filterByInterval(startOfWeek(now), endOfWeek(now)));
  const monthStats = calculateStats(filterByInterval(startOfMonth(now), endOfMonth(now)));

  return (
    <div style={{ background: "#eef", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
      <h3>📊 Thống kê theo thời gian</h3>
      {weekStats ? (
        <div style={{ marginBottom: "10px" }}>
          <strong>Tuần này ({weekStats.count} ngày):</strong><br />
          Trung bình: {weekStats.avg} kg, Cao nhất: {weekStats.max} kg, Thấp nhất: {weekStats.min} kg
        </div>
      ) : (
        <p>Không có dữ liệu tuần này</p>
      )}

      {monthStats ? (
        <div>
          <strong>Tháng này ({monthStats.count} ngày):</strong><br />
          Trung bình: {monthStats.avg} kg, Cao nhất: {monthStats.max} kg, Thấp nhất: {monthStats.min} kg
        </div>
      ) : (
        <p>Không có dữ liệu tháng này</p>
      )}
    </div>
  );
}
