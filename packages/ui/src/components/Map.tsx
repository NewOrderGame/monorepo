import { MapContainer, TileLayer } from 'react-leaflet';
import { MAPBOX_URL } from '../lib/constants';
import { WorldMapEngine } from './WorldMapEngine';
import * as React from 'react';
import { LatLng } from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

export function MapWrapper({ firstCoordinates }: { firstCoordinates: LatLng }) {
  return (
    <MapContainer
      center={firstCoordinates}
      zoom={18}
      zoomControl={false}
      boxZoom={false}
      touchZoom={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      dragging={false}
      keyboard={false}
    >
      <TileLayer url={MAPBOX_URL} />
      <WorldMapEngine />
    </MapContainer>
  );
}

export const Map = styled(MapWrapper)`
  width: 100%;
  height: 100%;
`;
