defmodule Back.Repo do
  use Ecto.Repo,
    otp_app: :back,
    adapter: Ecto.Adapters.SQLite3
end
