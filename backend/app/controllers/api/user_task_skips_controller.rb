class API::UserTaskSkipsController < ApplicationController
  def index
    user_task_skips = UserTaskSkip.all
    render json: user_task_skips
  end

  def show
    user_task_skip = UserTaskSkip.find(params[:id])
    render json: user_task_skip
  end

  def create
    user_task_skip = UserTaskSkip.new(user_task_skip_params)
    if user_task_skip.save
      render json: user_task_skip, status: :created
    else
      render json: user_task_skip.errors, status: :unprocessable_entity
    end
  end

  def update
    user_task_skip = UserTaskSkip.find(params[:id])
    if user_task_skip.update(user_task_skip_params)
      render json: user_task_skip
    else
      render json: user_task_skip.errors, status: :unprocessable_entity
    end
  end

  private

  def user_task_skip_params
    params.require(:user_task_skip).permit(:user_id, :task_id, :skip_count)
  end
end