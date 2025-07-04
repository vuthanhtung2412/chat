defmodule BackWeb.Router do
  use BackWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  # https://hexdocs.pm/phoenix/json_and_apis.html
  # back/lib/back_web/router.ex
  scope Const.prefix() <> "/api", BackWeb do
    pipe_through :api
    resources "/users", UserController, except: [:new, :edit]
    # TODO: This is not clean
    get "/users/name/:name", UserController, :get_by_name
    resources "/rooms", RoomController, except: [:new, :edit]
    get "/rooms/:id/messages", RoomController, :show_messages
    resources "/messages", MessageController, except: [:new, :edit]
  end

  scope "/api/swagger" do
    forward "/",
            PhoenixSwagger.Plug.SwaggerUI,
            otp_app: :back,
            swagger_file: "swagger.json"
  end

  def swagger_info do
    %{
      info: %{
        version: "1.0",
        title: "My App"
      }
    }
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:back, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: BackWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
