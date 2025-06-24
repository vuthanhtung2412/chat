defmodule BackWeb.UserController do
  use PhoenixSwagger, otp_app: :back
  use BackWeb, :controller

  alias Back.Accounts
  alias Back.Accounts.User

  action_fallback BackWeb.FallbackController

  def swagger_definitions do
    %{
      User:
        swagger_schema do
          title("User")
          description("A user of the application")

          properties do
            id(:integer, "User id", required: true)
            name(:string, "User name (unique for each user)", required: true)
          end

          example(%{
            id: "123",
            name: "Joe"
          })
        end,
      Users:
        swagger_schema do
          title("Users")
          description("A collection of Users")
          type(:array)
          items(Schema.ref(:User))
        end
    }
  end

  swagger_path :index do
    get("/api/users")
    description("List all users")
    response(200, "Success")
  end

  def index(conn, _params) do
    users = Accounts.list_users()
    render(conn, :index, users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/users/#{user}")
      |> render(:show, user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    render(conn, :show, user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Accounts.get_user!(id)

    with {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
      render(conn, :show, user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)

    with {:ok, %User{}} <- Accounts.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
