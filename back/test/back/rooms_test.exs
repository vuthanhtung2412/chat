defmodule Back.RoomsTest do
  use Back.DataCase

  alias Back.Rooms

  describe "rooms" do
    alias Back.Rooms.Room

    import Back.RoomsFixtures

    @invalid_attrs %{name: nil}

    test "list_rooms/0 returns all rooms" do
      room = room_fixture()
      assert Rooms.list_rooms() == [room]
    end

    test "get_room!/1 returns the room with given id" do
      room = room_fixture()
      assert Rooms.get_room!(room.id) == room
    end

    test "create_room/1 with valid data creates a room" do
      valid_attrs = %{name: "some name"}

      assert {:ok, %Room{} = room} = Rooms.create_room(valid_attrs)
      assert room.name == "some name"
    end

    test "create_room/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Rooms.create_room(@invalid_attrs)
    end

    test "update_room/2 with valid data updates the room" do
      room = room_fixture()
      update_attrs = %{name: "some updated name"}

      assert {:ok, %Room{} = room} = Rooms.update_room(room, update_attrs)
      assert room.name == "some updated name"
    end

    test "update_room/2 with invalid data returns error changeset" do
      room = room_fixture()
      assert {:error, %Ecto.Changeset{}} = Rooms.update_room(room, @invalid_attrs)
      assert room == Rooms.get_room!(room.id)
    end

    test "delete_room/1 deletes the room" do
      room = room_fixture()
      assert {:ok, %Room{}} = Rooms.delete_room(room)
      assert_raise Ecto.NoResultsError, fn -> Rooms.get_room!(room.id) end
    end

    test "change_room/1 returns a room changeset" do
      room = room_fixture()
      assert %Ecto.Changeset{} = Rooms.change_room(room)
    end
  end

  describe "messages" do
    alias Back.Rooms.Message

    import Back.RoomsFixtures

    @invalid_attrs %{content: nil, user_id: nil, room_id: nil}

    test "list_messages/0 returns all messages" do
      message = message_fixture()
      assert Rooms.list_messages() == [message]
    end

    test "get_message!/1 returns the message with given id" do
      message = message_fixture()
      assert Rooms.get_message!(message.id) == message
    end

    test "create_message/1 with valid data creates a message" do
      valid_attrs = %{content: "some content", user_id: "some user_id", room_id: "some room_id"}

      assert {:ok, %Message{} = message} = Rooms.create_message(valid_attrs)
      assert message.content == "some content"
      assert message.user_id == "some user_id"
      assert message.room_id == "some room_id"
    end

    test "create_message/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Rooms.create_message(@invalid_attrs)
    end

    test "update_message/2 with valid data updates the message" do
      message = message_fixture()
      update_attrs = %{content: "some updated content", user_id: "some updated user_id", room_id: "some updated room_id"}

      assert {:ok, %Message{} = message} = Rooms.update_message(message, update_attrs)
      assert message.content == "some updated content"
      assert message.user_id == "some updated user_id"
      assert message.room_id == "some updated room_id"
    end

    test "update_message/2 with invalid data returns error changeset" do
      message = message_fixture()
      assert {:error, %Ecto.Changeset{}} = Rooms.update_message(message, @invalid_attrs)
      assert message == Rooms.get_message!(message.id)
    end

    test "delete_message/1 deletes the message" do
      message = message_fixture()
      assert {:ok, %Message{}} = Rooms.delete_message(message)
      assert_raise Ecto.NoResultsError, fn -> Rooms.get_message!(message.id) end
    end

    test "change_message/1 returns a message changeset" do
      message = message_fixture()
      assert %Ecto.Changeset{} = Rooms.change_message(message)
    end
  end
end
