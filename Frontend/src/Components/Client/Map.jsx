import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icon issue
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const defaultProps = {
  center: [27.3736871, 87.2070184], // Your custom center
  zoom: 25
};

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41], // Default Leaflet size
  iconAnchor: [12, 41]
});

export default function SimpleMap() {
  return (
    <MapContainer center={defaultProps.center} zoom={defaultProps.zoom} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={defaultProps.center} icon={customIcon}>
        <Popup>कारागार कार्यालय संखुवासभा</Popup>
      </Marker>
    </MapContainer>
  );
}
