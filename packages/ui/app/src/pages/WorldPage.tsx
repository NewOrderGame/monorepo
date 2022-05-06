import * as React from "react";
import {MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet'
import {LeafletMouseEvent} from "leaflet";
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
    <MapContainer center={[46.4768564, 30.7278205]} zoom={18} scrollWheelZoom={false} dragging={false} keyboard={false}
                  zoomControl={false}>
      <TileLayer
        url="https://api.mapbox.com/styles/v1/devlysh/cl10ns92r000814pon7kefjjt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2bHlzaCIsImEiOiJjanB5Y3dzeGgwMDA0NDhwa3M5eGtlOXBqIn0.0t-lPs1RNPM85YTIyLLbzA"
      />
      <Map/>
    </MapContainer>
    <img className="character" src="character.png"/>
    <svg width="100%" height="100%" className="fog-of-war" viewBox="0 0 100% 100%">
      <defs>
        <filter id="blur" x="-20%" y="-20%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10"/>
        </filter>
      </defs>
      <mask id="mask">
        <rect fill="white" width="100%" height="100%"/>
        <circle fill="black" cx="50%" cy="50%" r="400px" stroke-width="2" filter="url(#blur)"/>
      </mask>
      <rect mask="url(#mask)" fill="rgba(0,0,0,0.5)" width="100%" height="100%"/>
    </svg>
  </>;
}

function Map() {
  const map = useMap();

  useMapEvents({
    click(event: LeafletMouseEvent) {
      map.flyTo(event.latlng, map.getZoom(), flyOptions);
    }
  });
  return null;
}
