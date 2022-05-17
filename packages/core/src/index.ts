import { initAuth } from './namespaces/authNamespace';
import { initWorld } from './namespaces/worldNamespace';
import { initEncounter } from './namespaces/encounterNamespace';
import { runWorld } from './engine/world-engine';

initAuth();
initWorld();
initEncounter();
runWorld();
