# Chat App with Elixir and Phoenix

## How to start

```bash
brew isntall mise
cd start
mise trust
mise install
mix deps.get
cd ..
mprocs
```

## Features

- [x] rooms that can joined and left
- [ ] Frontend with vite deployed to github pages
- [x] Real-time updates using Phoenix Channels
- [ ] Deployed on local machine using Docker/Traefik/Ngrok
- [x] Load old messages

## DB schema

```ts
type User = {
  id: string;
  name: string;
};

type Room = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  content: string;
  userId: string;
  roomId: string;
};

type RoomMessage = {
  content: string;
  username: string;
  insertedAt: Date;
};
```
