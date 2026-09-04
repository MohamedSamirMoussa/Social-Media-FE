export const SocketEvents = {
  connect: "connect",
  disconnect: "disconnect",

  join_room: "join_room",
  leave_room: "leave_room",

  send_message: "send_message",
  stop_typing: "stop_typing",

  new_notification: "new_notification",

  friend_request: "friend_request",
} as const;
