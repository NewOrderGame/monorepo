"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorWithLogout = exports.DEFAULT_COORDINATES = void 0;
exports.DEFAULT_COORDINATES = {
    lat: 46.47705630400258,
    lng: 30.730369681615272
};
function errorWithLogout(message, socket) {
    var error = new Error(message);
    socket.emit('logout');
    socket.disconnect();
    console.error(error);
    return Error();
}
exports.errorWithLogout = errorWithLogout;
