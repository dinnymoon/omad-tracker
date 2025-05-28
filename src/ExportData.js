import { saveAs } from 'file-saver';

export default function ExportData({ entries, user }) {
  const exportToCSV = () => {
    if (!entries || entries.length === 0) {
      alert("Không có dữ liệu để xuất.");
      return;
    }

    const header = "Ngày,Cân nặng (kg),Ghi chú";
    const rows = entries.map(e => {
      const date = new Date(e.date).toLocaleDateString("vi-VN");
      const time = new Date(e.date).toLocaleTimeString("vi-VN");
      return `${date} ${time},${e.weight},${e.note || ""}`;
    });
    const csvContent = [header, ...rows].join("\n");

    // Thêm BOM để Excel đọc đúng UTF-8
    const csvWithBOM = '\uFEFF' + csvContent;

    // Tạo tên file theo cấu trúc yêu cầu
    const username = user?.displayName?.replace(/\s+/g, "_") || user?.email?.split("@")[0] || "user";
    const now = new Date();
    const datePart = now.toLocaleDateString("en-CA"); // yyyy-mm-dd
    const timePart = now.toTimeString().split(" ")[0].replace(/:/g, ""); // hhmmss
    const timestamp = `${datePart}_${timePart}`;
    const filename = `${username}_OMAD_history_${timestamp}.csv`;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <button onClick={exportToCSV} style={{ padding: "10px 20px", cursor: "pointer" }}>
        📤 Xuất dữ liệu ra CSV
      </button>
    </div>
  );
}
