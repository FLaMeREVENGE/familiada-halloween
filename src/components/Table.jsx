"use client";
import "./Table.css";

export default function Table({ 
  headers = [],
  rows = [],
  variant = "default",
  className = ""
}) {
  return (
    <div className={`table-container table-${variant} ${className}`}>
      <table className="table">
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="table-header">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="table-cell">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
