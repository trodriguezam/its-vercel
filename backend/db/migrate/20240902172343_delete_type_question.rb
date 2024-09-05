class DeleteTypeQuestion < ActiveRecord::Migration[7.2]
  def change
    remove_column :questions, :type, :string
  end
end
