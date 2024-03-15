import { startGame } from './lib/world-engine';
import { listen } from './lib/io';
import { initGameNamespace } from './lib/game-namespace';

const gameNamespace = initGameNamespace();
const timer = startGame(gameNamespace);

gameNamespace.on('stop-game', (secret: string) => {
  if (secret === process.env.STOP_GAME_SECRET) {
    clearInterval(timer as NodeJS.Timeout);
  }
});

listen();
