class DeleteTypeAnswer < ActiveRecord::Migration[7.2]
  def change
    remove_column :answers, :type, :string
  end
end
