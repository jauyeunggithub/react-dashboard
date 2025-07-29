import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapWidget = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch("https://ipinfo.io/json?token=YOUR_API_TOKEN")
      .then((response) => response.json())
      .then((data) => {
        const [lat, lng] = data.loc.split(",");
        setLocation([parseFloat(lat), parseFloat(lng)]);
      });
  }, []);

  return (
    <div className="widget">
      <div className="widget-title">Map Widget</div>
      {location ? (
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={location}>
            <Popup>Your location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapWidget;
