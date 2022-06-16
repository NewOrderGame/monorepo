import { NogEvent } from '@newordergame/common';
import { Namespace } from 'socket.io';
import { io } from '../lib/utils/io';
import logger from '../lib/utils/logger';
import { handleWorldConnection } from '../lib/world';

let worldNamespace: Namespace;

export const initWorld = () => {
  logger.info('Init World');
  worldNamespace = io.of('/world');
  worldNamespace.on(NogEvent.CONNECTION, handleWorldConnection(worldNamespace));
};

export const getWorld = (): Namespace => {
  return worldNamespace;
};
