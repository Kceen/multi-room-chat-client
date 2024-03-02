export interface IWSMessage {
  type: IWSMessageType;
  data?: any;
}

export interface IUser {
  id: string;
  name: string;
}

export interface IMessage {
  user: IUser;
  content: string;
}

export interface INewMessagePayload {
  content: string;
  roomId: string;
}

export interface ICreateNewRoomRequestPayload {
  roomId: string;
}

export interface IJoinRoomRequestPayload {
  roomId: string;
}

export interface IJoinedNewRoomResponsePayload {
  roomId: string;
}

export enum IWSMessageType {
  NEW_MESSAGE = "NEW_MESSAGE",
  CREATE_NEW_ROOM = "CREATE_NEW_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  USER_INFO = "USER_INFO",
}
