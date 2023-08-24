import { MapContainer, TileLayer } from 'react-leaflet';
import { MAPBOX_URL } from '../lib/constants';
import { WorldMapEngine } from './WorldMapEngine';
import * as React from 'react';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import { WorldMenu } from './WorldMenu';
import { GeoCoordinates } from '@newordergame/common';

export const MapWrapper = ({
  firstCoordinates
}: {
  firstCoordinates: GeoCoordinates;
}) => {
  return (
    <>
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
        <WorldMenu />
      </MapContainer>
    </>
  );
};

export const World = styled(MapWrapper)`
  width: 100%;
  height: 100%;
`;
