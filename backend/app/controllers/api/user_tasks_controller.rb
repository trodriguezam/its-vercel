
class API::UserTasksController < ApplicationController

  def index
    userstasks = UserTask.all
    render json: userstasks
  end

  def show
    userstask = UserTask.find(params[:id])
    render json: userstask
  end

  def create
    user_task = UserTask.new(user_task_params)
    if user_task.save
      render json: user_task, status: :created
    else
      render json: user_task.errors, status: :unprocessable_entity
    end
  end  

  def update
    user_task = UserTask.find(params[:id])
    if user_task.update(user_task_params)
      render json: user_task
    else
      render json: user_task.errors, status: :unprocessable_entity
    end
  end

  private

  def user_task_params
    params.require(:user_task).permit(:user_id, :task_id, :completion)
  end


end
