import { convertMessageRecieve, convertMessageSend } from "./helpers";
import { For, Show, createSignal } from "solid-js";
import {
  ICreateNewRoomRequestPayload,
  IJoinedNewRoomResponsePayload,
  IWSMessageType,
  IUser,
  IMessage,
  INewMessagePayload,
  IJoinRoomRequestPayload,
} from "./models";
import toast, { Toaster } from "solid-toast";

function App() {
  const ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    ws.send(
      convertMessageSend({
        type: IWSMessageType.USER_INFO,
        data: { id: "1", name: "Nikola" } as IUser,
      })
    );

    ws.onmessage = ({ data }) => {
      const message = convertMessageRecieve(data);

      if (message.type === IWSMessageType.JOIN_ROOM) {
        setRoom({ id: (message.data as IJoinedNewRoomResponsePayload).roomId });
        toast(
          `Joined room with ID = ${
            (message.data as IJoinedNewRoomResponsePayload).roomId
          }`
        );
      }

      if (message.type === IWSMessageType.NEW_MESSAGE) {
        const data = message.data as IMessage;

        if (messages()) {
          setMessages((prevMessages) => [
            ...prevMessages!,
            { content: data.content, user: data.user },
          ]);
        } else {
          setMessages([{ content: data.content, user: data.user }]);
        }
      }
    };
  };

  const [messages, setMessages] = createSignal<IMessage[]>();
  const [newRoomIdInputValue, setNewRoomIdInputValue] = createSignal("");
  const [messageInputValue, setMessageInputValue] = createSignal("");
  const [joinRoomIdInputValue, setJoinRoomIdInputValue] = createSignal("");

  const [room, setRoom] = createSignal<{ id: string }>();

  const handleCreateNewRoom = () => {
    ws.send(
      convertMessageSend({
        type: IWSMessageType.CREATE_NEW_ROOM,
        data: { roomId: newRoomIdInputValue() } as ICreateNewRoomRequestPayload,
      })
    );
  };

  const handleJoinRoom = () => {
    ws.send(
      convertMessageSend({
        type: IWSMessageType.JOIN_ROOM,
        data: { roomId: joinRoomIdInputValue() } as IJoinRoomRequestPayload,
      })
    );
  };

  const handleSendMessage = (e: Event) => {
    e.preventDefault();
    ws.send(
      convertMessageSend({
        type: IWSMessageType.NEW_MESSAGE,
        data: {
          roomId: room()?.id,
          content: messageInputValue(),
        } as INewMessagePayload,
      })
    );
    setMessageInputValue("");
  };

  return (
    <>
      <div class='h-screen w-full'>
        <div class='flex p-6 gap-6'>
          <div class='border border-black'>
            <input
              value={newRoomIdInputValue()}
              onInput={(e) => {
                setNewRoomIdInputValue(e.target.value);
              }}
              class='border border-black p-2'
              placeholder='New room ID'
            />
            <button
              onClick={handleCreateNewRoom}
              class='border border-black p-2'
            >
              Create new room
            </button>
          </div>

          <div class='border border-black'>
            <input
              value={joinRoomIdInputValue()}
              onInput={(e) => {
                setJoinRoomIdInputValue(e.target.value);
              }}
              class='border border-black p-2'
              placeholder='Room ID'
            />
            <button
              onClick={handleJoinRoom}
              class='border border-black p-2 default'
            >
              Join room
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <Show when={room()} fallback='Join or create room to see messages'>
          <div>
            <p> Room - {room()!.id} </p>

            <form onSubmit={handleSendMessage}>
              <input
                class='fixed bottom-0 border border-black w-full p-2'
                placeholder='Type message...'
                name='content'
                value={messageInputValue()}
                onInput={(e) => {
                  setMessageInputValue(e.target.value);
                }}
              />
            </form>

            <For each={messages()}>
              {(message) => {
                return (
                  <p>
                    {message.user.name} - {message.content}
                  </p>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
      <Toaster />
    </>
  );
}

export default App;
