export type OverpassElement = { type: string; id: number };

export type WayOverpassElement = {
  bounds: any;
  nodes: number[];
  geometry: { lat: number; lon: number }[];
} & OverpassElement;

export type PlainBuildingNode = {
  x: number;
  y: number;
};
