"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_COORDINATES = exports.NogEvent = exports.NogNamespace = exports.NogPage = void 0;
var NogPage;
(function (NogPage) {
    NogPage["ROOT"] = "";
    NogPage["CHARACTER"] = "character";
    NogPage["WORLD"] = "world";
    NogPage["ENCOUNTER"] = "encounter";
})(NogPage = exports.NogPage || (exports.NogPage = {}));
var NogNamespace;
(function (NogNamespace) {
    NogNamespace["AUTH"] = "auth";
    NogNamespace["WORLD"] = "world";
    NogNamespace["ENCOUNTER"] = "encounter";
})(NogNamespace = exports.NogNamespace || (exports.NogNamespace = {}));
var NogEvent;
(function (NogEvent) {
    NogEvent["CONNECTION"] = "connection";
    NogEvent["CONNECT"] = "connect";
    NogEvent["CONNECTED"] = "connected";
    NogEvent["DISCONNECT"] = "disconnect";
    NogEvent["REDIRECT"] = "redirect";
    NogEvent["ENCOUNTERS_IN_SIGHT"] = "encounters-in-sight";
    NogEvent["CHARACTERS_IN_SIGHT"] = "characters-in-sight";
    NogEvent["CREATE_CHARACTER"] = "create-character";
    NogEvent["INIT_CHARACTER_AT_WORLD"] = "create-character-at-world";
    NogEvent["DESTROY_CHARACTER_AT_WORLD"] = "destroy-character-at-world";
    NogEvent["MOVE_CHARACTER_AT_WORLD"] = "move-character-at-world";
    NogEvent["INIT_ENCOUNTER"] = "init-encounter";
    NogEvent["EXIT_ENCOUNTER"] = "exit-encounter";
    NogEvent["DESTROY_ENCOUNTER"] = "destroy-encounter";
    NogEvent["INIT_NPC"] = "init-npc";
})(NogEvent = exports.NogEvent || (exports.NogEvent = {}));
exports.DEFAULT_COORDINATES = {
    lat: 46.47705630400258,
    lng: 30.730369681615272
};
