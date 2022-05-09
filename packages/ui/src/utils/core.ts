import { Action, Message } from '@newordergame/common';

const CORE_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:5000'
    : 'wss://core.newordergame.com';

function core() {
  let wsc: WebSocket | null = null;
  console.log('Init core');

  function connect() {
    if (!wsc) {
      const socket = new WebSocket(CORE_URL);
      socket.addEventListener('open', onOpen);
      socket.addEventListener('close', onClose);
      socket.addEventListener('error', onError);
      socket.addEventListener('message', onMessage);
      wsc = socket;
    }
  }

  function onOpen(event: Event) {
    console.log(`Socket is open.`, event);
  }

  function onClose(event: Event) {
    wsc = null;
    console.log(
      `Socket is closed. Reconnect will be attempted in 1 second. ${event}`
    );
    setTimeout(connect, 1000);
  }

  function onError(error: any) {
    wsc = null;
    console.error(
      `Socket encountered error: ${JSON.stringify(error)}. Closing socket`
    );
  }

  function onMessage(event: MessageEvent) {
    console.log(event);
  }

  function send(message: Message) {
    if (wsc) {
      wsc.send(JSON.stringify(message));
    } else {
      throw new Error('Tried to send message without WebSocket');
    }
  }

  function subscribe(action: Action, callback: Function) {
    if (wsc) {
      wsc.addEventListener('message', (event: MessageEvent) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (error) {
          console.error(
            `Error during parse message with ${action} action`,
            error
          );
        }
        if (data.action === action) {
          callback(data);
        }
      });
    } else {
      throw new Error('Tried to subscribe without WebSocket');
    }
  }

  return {
    connect,
    send,
    subscribe
  };
}

export default core();
