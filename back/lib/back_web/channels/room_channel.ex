defmodule BackWeb.RoomChannel do
  alias Back.Repo
  alias Back.Rooms.Room
  use BackWeb, :channel

  # Usage : {"topic": "room:1", "event": "phx_join","payload": {}, "ref": "1"}
  # ref: "1" is a unique identifier to match response to a reuqest
  @impl true
  def join("room:" <> room_id, _payload, socket) do
    case Repo.get(Room, room_id) do
      nil -> {:error, %{reason: "room not found"}}
      _room -> {:ok, socket}
    end
  end

  # Usage : {"topic": "room:1", "event": "new_msg","payload":{"message": "Hello everyone!"},"ref": "2asdf"}
  def handle_in("new_msg", %{"message" => message}, socket) do
    alias Back.Rooms.Message
    alias Back.Rooms.RoomMessage

    case %Message{}
         |> Message.changeset(%{
           content: message,
           user_id: socket.assigns.user_id,
           room_id: String.split(socket.topic, ":") |> List.last()
         })
         |> Repo.insert() do
      {:ok, created_message} ->
        broadcast!(socket, "new_msg", %RoomMessage{
          content: created_message.content,
          userName: socket.assigns.user_name,
          insertedAt: created_message.inserted_at
        })

      {:error, _changeset} ->
        nil
    end

    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
