import * as React from "react";
import {MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet'
import {LeafletMouseEvent, LocationEvent} from "leaflet";
import {useAuth} from "../utils/auth";
import 'leaflet/dist/leaflet.css';

const flyOptions = {
  animate: true,
  easeLinearity: 1.0,
  duration: 1,
  noMoveStart: true
};

export function WorldPage() {
  console.log('WorldPage');
  const auth = useAuth();

  console.log(auth.user);

  return <>
    <MapContainer center={[0, 0]} zoom={18} scrollWheelZoom={false} dragging={false} keyboard={false}>
      <TileLayer
        url="https://api.mapbox.com/styles/v1/devlysh/cl10ns92r000814pon7kefjjt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2bHlzaCIsImEiOiJjanB5Y3dzeGgwMDA0NDhwa3M5eGtlOXBqIn0.0t-lPs1RNPM85YTIyLLbzA"
      />
      <Map/>
    </MapContainer>
  </>;
}

function Map() {
  const map = useMap();
  map.locate();

  useMapEvents({
    click(event: LeafletMouseEvent) {
      map.flyTo(event.latlng, map.getZoom(), flyOptions);
    },
    locationfound(event: LocationEvent) {
      map.flyTo(event.latlng, map.getZoom(), flyOptions);
    }
  });
  return null;
}
