import { MapContainer, TileLayer, useMap, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const courtBounds = [
  [35.513702, 23.979186], // SW
  [35.513985, 23.980005], // NE
];

function FitCourtsBounds({ bounds }) {
  const map = useMap();
  map.fitBounds(bounds, { maxZoom: 21 });
  return null;
}

export default function Schedule() {
  return (
    <div className="h-screen">
      <MapContainer
        center={[35.5138435, 23.979595]}
        zoom={22}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom="25"
          maxZoom="25"
        />
        <FitCourtsBounds bounds={courtBounds} />
        <Rectangle bounds={courtBounds} pathOptions={{ color: "blue" }} />
      </MapContainer>
    </div>
  );
}
