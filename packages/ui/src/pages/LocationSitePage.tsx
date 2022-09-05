import * as React from 'react';
import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { Content } from '../components/Content';
import logger from '../lib/utils/logger';
import { ConnectionContextType, useConnection } from '../lib/connection';
import { NogEvent } from '@newordergame/common';
import { Application, Point, Sprite } from 'pixi.js';
import { Building } from '../../../location-site/src/lib/building';
import {
  BLACK_HEXAGON,
  HEXAGON_TEXTURE_HEIGHT,
  HEXAGON_TEXTURE_WIDTH,
  WHITE_HEXAGON
} from '../lib/constants';

export const LocationSitePage = () => {
  logger.info('Location Site Page');
  const connection = useConnection();
  const containerRef = useRef<HTMLDivElement>(null);
  useOnInitLocationSitePage(connection, containerRef);
  useEmitInitLocationSitePage(connection);

  return (
    <Content>
      <div ref={containerRef}></div>
    </Content>
  );
};

const handleInitLocationSitePage =
  (
    pixiAppRef: MutableRefObject<Application | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>
  ) =>
  (building: Building) => {
    logger.info('Location Site Page building a building', { building });
    const width =
      (building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_WIDTH -
      HEXAGON_TEXTURE_WIDTH / 2;
    const height =
      ((building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_HEIGHT) / 2;

    if (!pixiAppRef.current) {
      pixiAppRef.current = new Application({
        width,
        height,
        backgroundColor: 0x1099bb
      });
    }

    for (let x = 0; x <= building.maxX; x++) {
      for (let y = 0; y <= building.maxY; y++) {
        const cell = building.map[x][y];
        let hexagon: Sprite;
        if (cell.isWall) {
          hexagon = new Sprite(BLACK_HEXAGON);
        } else {
          hexagon = new Sprite(WHITE_HEXAGON);
        }
        hexagon.x = (building.maxY - y + x) * HEXAGON_TEXTURE_WIDTH;
        hexagon.y = ((x + y) * HEXAGON_TEXTURE_HEIGHT) / 2;
        hexagon.interactive = true;
        hexagon.buttonMode = true;
        hexagon.scale = new Point(
          HEXAGON_TEXTURE_WIDTH / 100,
          HEXAGON_TEXTURE_HEIGHT / 100
        );
        hexagon.on('pointerdown', () =>
          logger.trace('Hexagon', { hexagon, x, y })
        );
        pixiAppRef.current.stage.addChild(hexagon);
      }
    }
    containerRef.current?.appendChild(pixiAppRef.current.view);
  };

const useEmitInitLocationSitePage = (connection: ConnectionContextType) => {
  useEffect(() => {
    connection.gameSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE);
  }, []);
};

const useOnInitLocationSitePage = (
  connection: ConnectionContextType,
  containerRef: RefObject<HTMLDivElement>
) => {
  const pixiAppRef = useRef<Application>(null);

  useEffect(() => {
    logger.info('Location Site Page init');

    connection.gameSocket.on(
      NogEvent.INIT_LOCATION_SITE_PAGE,
      handleInitLocationSitePage(pixiAppRef, containerRef)
    );

    return () => {
      logger.info('Location Site Page destroy');
      connection.gameSocket.off(NogEvent.INIT_LOCATION_SITE_PAGE);
    };
  }, []);
};
