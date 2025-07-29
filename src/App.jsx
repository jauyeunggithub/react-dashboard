import React from "react";
import ChartsWidget from "./components/ChartsWidget";
import FormWidget from "./components/FormWidget";
import MapWidget from "./components/MapWidget";
import TableWidget from "./components/TableWidget";
import "./App.css";

const App = () => {
  return (
    <div className="dashboard">
      <ChartsWidget />
      <FormWidget />
      <MapWidget />
      <TableWidget />
    </div>
  );
};

export default App;
