# Elixir Chat App

- [ ] 1 room that can joined and left
- [ ] Frontend with vite deployed to github pages
- [ ] Real-time updates using Phoenix Channels
- [ ] Deployed on local machine using Docker/Traefik/Ngrok
- [ ] Load old messages

# DB schema

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
```
