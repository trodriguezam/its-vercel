class AddTypeToTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :tasks, :type, :string
  end
end
