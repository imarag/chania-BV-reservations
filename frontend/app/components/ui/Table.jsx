export default function Table({ rows = [] }) {
  if (rows.length === 0) {
    return (
      <table className="min-w-full border-collapse border border-gray-200">
        <tbody>
          <tr>
            <td className="text-center py-4">No data available</td>
          </tr>
        </tbody>
      </table>
    );
  }

  // Get columns from the first row's keys
  const columns = Object.keys(rows[0]);
  const tableClass = "table min-w-full border-collapse border border-gray-200";
  const columnClass = "px-4 py-2 text-left font-semibold";

  return (
    <table className={tableClass}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th className={columnClass} key={index}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td key={colIndex}>{row[col] || "-"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
