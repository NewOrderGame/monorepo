import { Namespace, Socket } from 'socket.io';

export const getFakeSocket = () => {
  const emit = jest.fn();
  const data = {};
  return {
    emit,
    data
  } as unknown as Socket;
}

export const getFakeNamespace = () => {
  const emit = jest.fn();

  const to = jest.fn(() => ({
    emit
  }));

  return {
    to
  } as unknown as Namespace;
}
