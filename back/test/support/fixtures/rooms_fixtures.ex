defmodule Back.RoomsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Back.Rooms` context.
  """

  @doc """
  Generate a room.
  """
  def room_fixture(attrs \\ %{}) do
    {:ok, room} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> Back.Rooms.create_room()

    room
  end

  @doc """
  Generate a message.
  """
  def message_fixture(attrs \\ %{}) do
    {:ok, message} =
      attrs
      |> Enum.into(%{
        content: "some content",
        room_id: "some room_id",
        user_id: "some user_id"
      })
      |> Back.Rooms.create_message()

    message
  end
end
