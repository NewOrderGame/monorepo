export enum Action {
  MOVE = 'move'
}

export type Message = {
  action: Action;
  payload: any;
};
