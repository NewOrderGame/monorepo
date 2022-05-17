import { MapContainer, TileLayer } from 'react-leaflet';
import { MAPBOX_URL } from '../utils/constants';
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
      scrollWheelZoom={false}
      dragging={false}
      keyboard={false}
      zoomControl={false}
      touchZoom={false}
      boxZoom={false}
      doubleClickZoom={false}
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
