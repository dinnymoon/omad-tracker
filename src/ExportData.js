import { saveAs } from 'file-saver';

export default function ExportData({ entries }) {
  const exportToCSV = () => {
    if (!entries || entries.length === 0) {
      alert("Không có dữ liệu để xuất.");
      return;
    }

    const header = "Ngày, Cân nặng (kg), Ghi chú";
    const rows = entries.map(e => `${e.date}, ${e.weight}, ${e.note || ""}`);
    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "omad-weight-log.csv");
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <button onClick={exportToCSV} style={{ padding: "10px 20px", cursor: "pointer" }}>
        📤 Xuất dữ liệu ra CSV
      </button>
    </div>
  );
}
