import { startGame } from './engine/world-engine';
import { listen } from './lib/utils/io';
import { initGameNamespace } from './namespaces/game-namespace';

initGameNamespace();
startGame();
listen();
