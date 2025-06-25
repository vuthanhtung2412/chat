import Config

# Configures Swoosh API Client
config :swoosh, api_client: Swoosh.ApiClient.Req

# Disable Swoosh Local Memory Storage
config :swoosh, local: false

# Do not print debug messages in production
config :logger, level: :info

# Runtime production configuration, including reading
# of environment variables, is done on config/runtime.exs.
config :back, BackWeb.Endpoint,
  # Server checks list of origin in check_origin
  # -> This is used to allow CORS on the server side.
  check_origin: false
