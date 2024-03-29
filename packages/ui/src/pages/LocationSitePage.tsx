import {
  IndoorHexMap,
  Cell,
  NogEvent,
  CellElement,
  Hexagon,
  HexMap,
  CubicHex
} from '@newordergame/common';
import { Application, Sprite } from 'pixi.js';
import React, {
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
  RefObject
} from 'react';
import { Socket } from 'socket.io-client';
import { Content } from '../components/Content';
import { Connection, useConnection } from '../lib/connection';
import {
  BLACK_HEXAGON,
  BLACK_TRANSPARENT_HEXAGON,
  DARK_GREY_HEXAGON,
  HEXAGON_TEXTURE_HEIGHT,
  HEXAGON_TEXTURE_WIDTH,
  LIGHT_GREY_HEXAGON,
  WHITE_HEXAGON
} from '../lib/constants';
import logger from '../lib/utils/logger';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;

  canvas {
    width: 100%;
  }
`;

export const LocationSitePage = () => {
  logger.info('Location Site Page');
  const connection = useConnection();
  const containerRef = useRef<HTMLDivElement>(null);

  useEmitInitLocationSitePage(connection);
  useOnInitLocationSitePage(connection, containerRef);

  return (
    <Content>
      <CanvasContainer ref={containerRef}></CanvasContainer>
      <ExitButton gameSocket={connection.gameSocket} />
    </Content>
  );
};

const ExitButton = ({ gameSocket }: { gameSocket: Socket }) => {
  const handleClick = useCallback(() => {
    gameSocket.emit(NogEvent.EXIT_LOCATION_SITE);
  }, [gameSocket]);

  return <button onClick={handleClick}>Let me out!</button>;
};

const useEmitInitLocationSitePage = (connection: Connection) => {
  useEffect(() => {
    connection.gameSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE);
  }, [connection.gameSocket]);
};

const useOnInitLocationSitePage = (
  connection: Connection,
  containerRef: RefObject<HTMLDivElement>
) => {
  const pixiAppRef = useRef<Application | null>(null);
  const buildingRef = useRef<IndoorHexMap | null>(null);
  const startCellRef = useRef<Cell | null>(null);
  const pathRef = useRef<Cell[]>([]);
  const reachableRef = useRef<Cell[]>([]);

  const handleCellClick = useCallback(
    (hex: CubicHex) => {
      // /* FIND PATH */
      if (!buildingRef?.current) return;
      const axialHex = Hexagon.cubicToAxial(hex);

      if (startCellRef.current === null) {
        pathRef.current = [];

        const reachable = HexMap.findReachable(
          buildingRef.current,
          buildingRef.current.map[axialHex.x][axialHex.y],
          2
        );

        startCellRef.current = buildingRef.current.map[axialHex.x][axialHex.y];
        reachableRef.current = reachable;
      } else {
        const path = HexMap.findPath(
          buildingRef.current,
          startCellRef.current,
          buildingRef.current.map[axialHex.x][axialHex.y]
        );
        pathRef.current = path;
        startCellRef.current = null;
      }

      renderBuildingOnPixiStage(
        pixiAppRef.current!,
        buildingRef.current,
        handleCellClick,
        pathRef.current,
        reachableRef.current
      );

      // /* FIND REACHABLE */
      // if (!buildingRef?.current) return;
      // pathRef.current = [];
      // const startHex = Hexagon.cubicToAxial(hex);
      // const path = HexMap.findReachable(
      //   buildingRef.current,
      //   buildingRef.current.map[startHex.x][startHex.y],
      //   2
      // );
      // pathRef.current = path;
      // renderBuildingOnPixiStage(
      //   pixiAppRef.current!,
      //   buildingRef.current,
      //   handleCellClick,
      //   path
      // );
    },
    [buildingRef.current]
  );

  const handler = useCallback(
    initLocationSitePage(
      pixiAppRef,
      containerRef,
      handleCellClick,
      buildingRef,
      pathRef.current,
      reachableRef.current
    ),
    []
  );

  useEffect(() => {
    logger.info('Location Site Page init');

    connection.gameSocket.on(NogEvent.INIT_LOCATION_SITE_PAGE, handler);

    return () => {
      logger.info('Location Site Page destroy');
      connection.gameSocket.off(NogEvent.INIT_LOCATION_SITE_PAGE, handler);
    };
  }, [connection.gameSocket, containerRef]);
};

const initLocationSitePage =
  (
    pixiAppRef: MutableRefObject<Application | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>,
    handleCellClick: (hex: CubicHex) => void,
    buildingRef: MutableRefObject<IndoorHexMap | null>,
    path: Cell[],
    reachable: Cell[]
  ) =>
  (building: IndoorHexMap) => {
    buildingRef.current = building;
    createPixiApplication(pixiAppRef, building);
    renderBuildingOnPixiStage(
      pixiAppRef.current!,
      building,
      handleCellClick,
      path,
      reachable
    );
    containerRef.current?.appendChild(pixiAppRef.current!.view);
  };

const createPixiApplication = (
  pixiAppRef: MutableRefObject<Application | null>,
  building: IndoorHexMap
) => {
  if (pixiAppRef.current) return;

  const width =
    (building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_WIDTH -
    HEXAGON_TEXTURE_WIDTH / 2;
  const height =
    ((building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_HEIGHT) / 2;
  pixiAppRef.current = new Application({
    width,
    height,
    backgroundColor: 0x1099bb
  });
};

const renderBuildingOnPixiStage = (
  app: Application,
  building: IndoorHexMap,
  handleCellClick: (hex: CubicHex) => void,
  path: Cell[],
  reachable: Cell[]
) => {
  app.stage.removeChildren();
  for (let x = 0; x <= building.maxX; x++) {
    for (let y = 0; y <= building.maxY; y++) {
      const cell = building.map[x][y];
      const hexagon = createHexagonSprite(
        cell,
        building,
        x,
        y,
        handleCellClick,
        path,
        reachable
      );
      app.stage.addChild(hexagon);
    }
  }
};

const createHexagonSprite = (
  cell: Cell,
  building: IndoorHexMap,
  x: number,
  y: number,
  handleCellClick: (hex: CubicHex) => void,
  path: Cell[],
  reachable: Cell[]
) => {
  const hexagon = new Sprite(determineSprite(cell, path, reachable));
  hexagon.x = (building.maxY - y + x) * HEXAGON_TEXTURE_WIDTH;
  hexagon.y = ((x + y) * HEXAGON_TEXTURE_HEIGHT) / 2;
  hexagon.interactive = true;
  hexagon.buttonMode = true;
  hexagon.scale.set(HEXAGON_TEXTURE_WIDTH / 100, HEXAGON_TEXTURE_HEIGHT / 100);
  hexagon.on('pointerdown', () => {
    logger.trace({ hexagon, x, y }, 'Hexagon pointer down');
    handleCellClick(new Hexagon(x, y).toCubic());
  });
  return hexagon;
};

const determineSprite = (cell: Cell, path: Cell[], reachable: Cell[]) => {
  for (const hex of path) {
    if (Hexagon.cubicEqual(hex, cell)) {
      return LIGHT_GREY_HEXAGON;
    }
  }
  for (const hex of reachable) {
    if (Hexagon.cubicEqual(hex, cell)) {
      return DARK_GREY_HEXAGON;
    }
  }
  if (cell.element === CellElement.WALL) {
    return BLACK_HEXAGON;
  } else if (cell.element === CellElement.FLOOR) {
    return WHITE_HEXAGON;
  } else if (cell.element === CellElement.ROCK) {
    return BLACK_HEXAGON;
  } else {
    return BLACK_TRANSPARENT_HEXAGON;
  }
};
