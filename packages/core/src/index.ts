import { initAuth } from './namespaces/auth-namespace';
import { initWorld } from './namespaces/world-namespace';
import { initEncounter } from './namespaces/encounter-namespace';
import { runWorld } from './engine/world-engine';
import { listen } from './io';

initAuth();
initWorld();
initEncounter();
runWorld();
listen();
