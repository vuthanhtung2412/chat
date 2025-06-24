defmodule BackWeb.UserSocket do
  alias Back.Accounts.User
  alias Back.Repo
  use Phoenix.Socket

  channel "room:*", BackWeb.RoomChannel
  # A Socket handler
  #
  # It's possible to control the websocket connection and
  # assign values that can be accessed by your channel topics.

  ## Channels
  # Uncomment the following line to define a "room:*" topic
  # pointing to the `BackWeb.RoomChannel`:
  #
  # channel "room:*", BackWeb.RoomChannel
  #
  # To create a channel file, use the mix task:
  #
  #     mix phx.gen.channel Room
  #
  # See the [`Channels guide`](https://hexdocs.pm/phoenix/channels.html)
  # for further details.

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error` or `{:error, term}`. To control the
  # response the client receives in that case, [define an error handler in the
  # websocket
  # configuration](https://hexdocs.pm/phoenix/Phoenix.Endpoint.html#socket/3-websocket-configuration).
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  #
  # Usage:
  # websocat "ws://localhost:4000/socket/websocket?user_id=1"
  @impl true
  def connect(params, socket, _connect_info) do
    case params do
      %{"user_id" => user_id} when is_binary(user_id) ->
        case Repo.get(User, user_id) do
          nil ->
            :error

          user ->
            {:ok,
             socket
             |> assign(:user_id, user_id)
             |> assign(:user_name, user.name)}
        end

      _ ->
        :error
    end
  end

  # Socket IDs are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     Elixir.BackWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  @impl true
  def id(_socket), do: nil
end
