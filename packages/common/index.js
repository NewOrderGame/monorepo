"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_COORDINATES = exports.NogEvent = exports.NogNamespace = exports.NogPage = void 0;
var NogPage;
(function (NogPage) {
    NogPage["ROOT"] = "";
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
    NogEvent["DISCONNECT"] = "disconnect";
    NogEvent["INIT"] = "init";
    NogEvent["DESTROY"] = "destroy";
    NogEvent["REDIRECT"] = "redirect";
    NogEvent["MOVE"] = "move";
    NogEvent["EXIT"] = "exit";
    NogEvent["ENCOUNTERS_IN_SIGHT"] = "encounters-in-sight";
    NogEvent["CHARACTERS_IN_SIGHT"] = "characters-in-sight";
})(NogEvent = exports.NogEvent || (exports.NogEvent = {}));
exports.DEFAULT_COORDINATES = {
    lat: 46.47705630400258,
    lng: 30.730369681615272
};
