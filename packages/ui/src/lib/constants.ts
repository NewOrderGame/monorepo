import { Texture } from 'pixi.js';

export const MAPBOX_URL =
  'https://api.mapbox.com/styles/v1/devlysh/cl10ns92r000814pon7kefjjt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2bHlzaCIsImEiOiJjanB5Y3dzeGgwMDA0NDhwa3M5eGtlOXBqIn0.0t-lPs1RNPM85YTIyLLbzA';

export const HEXAGON_TEXTURE_WIDTH = 30;
export const HEXAGON_TEXTURE_HEIGHT = 30;

export const BLACK_HEXAGON: Texture = Texture.from('hexagon-black.png');
export const WHITE_HEXAGON: Texture = Texture.from('hexagon-white.png');
export const BLACK_TRANSPARENT_HEXAGON: Texture = Texture.from('hexagon-black-transparent.png');
