export declare enum Action {
    MOVE = "move"
}
export declare type Message = {
    action: Action;
    payload: any;
};
export declare type User = {
    username: string;
};