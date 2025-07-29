// src/components/TableWidget.jsx
import React, { useEffect, useState } from "react";

const TableWidget = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTableData(data);
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
        setTableData([]);
      });
  }, []);

  return (
    <div className="widget">
      <div className="widget-title">Table Widget</div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWidget;
