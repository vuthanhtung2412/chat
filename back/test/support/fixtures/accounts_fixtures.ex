defmodule Back.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Back.Accounts` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> Back.Accounts.create_user()

    user
  end
end
