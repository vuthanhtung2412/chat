export type User = {
  id: number;
  name: string;
};

export type Room = {
  id: number;
  name: string;
};

export type Message = {
  id: number;
  content: string;
  userId: string;
  roomId: string;
};

export type RoomMessage = {
  content: string;
  username: string;
  insertedAt: Date;
};
