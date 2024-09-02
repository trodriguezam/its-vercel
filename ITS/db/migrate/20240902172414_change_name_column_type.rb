class ChangeNameColumnType < ActiveRecord::Migration[7.2]
  def change
    rename_column :tasks, :type, :task_type
  end
end
