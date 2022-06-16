import { initAuth } from './namespaces/auth-namespace';
import { initWorld } from './namespaces/world-namespace';
import { initEncounter } from './namespaces/encounter-namespace';
import { startWorld } from './engine/world-engine';
import { listen } from './lib/utils/io';

initAuth();
initWorld();
initEncounter();
startWorld();
listen();
