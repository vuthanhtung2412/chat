GET http://localhost:4000/chat/api/users
GET http://localhost:4000/chat/api/404
GET http://localhost:4000/chat/api/users/name/user1
GET http://localhost:4000/chat/api/users/name/first%20user
GET http://localhost:4000/chat/api/rooms
GET http://localhost:4000/chat/api/messages
GET http://localhost:4000/chat/api/rooms/1/messages

POST http://localhost:4000/chat/api/users
Content-Type: application/json
{ 
  "user" : {
    "name": "first user"
  }
}

POST http://localhost:4000/chat/api/users
Content-Type: application/json
{ 
  "user" : {
    "name": "second user"
  }
}

POST http://localhost:4000/chat/api/users
Content-Type: application/json
{ 
  "user" : {
    "name": "user2"
  }
}

POST http://localhost:4000/chat/api/rooms
Content-Type: application/json
{ 
  "room" : {
    "name": "second room"
  }
}

POST http://localhost:4000/chat/api/messages
Content-Type: application/json
{ 
  "message" : {
    "content": "first message",
    "user_id": 1,
    "room_id": 1
  }
}
