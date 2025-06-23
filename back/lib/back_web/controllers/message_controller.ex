defmodule BackWeb.MessageController do
  use BackWeb, :controller

  alias Back.Rooms
  alias Back.Rooms.Message

  action_fallback BackWeb.FallbackController

  def index(conn, _params) do
    messages = Rooms.list_messages()
    render(conn, :index, messages: messages)
  end

  def create(conn, %{"message" => message_params}) do
    with {:ok, %Message{} = message} <- Rooms.create_message(message_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/messages/#{message}")
      |> render(:show, message: message)
    end
  end

  def show(conn, %{"id" => id}) do
    message = Rooms.get_message!(id)
    render(conn, :show, message: message)
  end

  def update(conn, %{"id" => id, "message" => message_params}) do
    message = Rooms.get_message!(id)

    with {:ok, %Message{} = message} <- Rooms.update_message(message, message_params) do
      render(conn, :show, message: message)
    end
  end

  def delete(conn, %{"id" => id}) do
    message = Rooms.get_message!(id)

    with {:ok, %Message{}} <- Rooms.delete_message(message) do
      send_resp(conn, :no_content, "")
    end
  end
end
