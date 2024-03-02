import { IWSMessage } from "./models";

export function convertMessageSend(data: IWSMessage): string {
  return JSON.stringify(data);
}

export function convertMessageRecieve(data: any): IWSMessage {
  return JSON.parse(data.toString());
}
