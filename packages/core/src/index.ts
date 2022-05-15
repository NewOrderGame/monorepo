import { initAuth } from './namespaces/auth';
import { initWorld } from './namespaces/world';
import { initEncounter } from './namespaces/encounter';
import { runWorld } from './engine/worldEngine';

initAuth();
initWorld();
initEncounter();
runWorld();
