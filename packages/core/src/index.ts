import { startGame } from './engine/world-engine';
import { listen } from './lib/utils/io';
import { initGameNamespace } from './namespaces/game-namespace';

const gameNamespace = initGameNamespace();
const timer = startGame(gameNamespace);

gameNamespace.on('stop-game', (secret: string) => {
  if (secret === process.env.STOP_GAME_SECRET) {
    clearInterval(timer);
  }
});

listen();
