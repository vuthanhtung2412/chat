defmodule Back.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string

      timestamps(type: :utc_datetime)
    end

    create unique_index(:users, [:name])
  end
end
