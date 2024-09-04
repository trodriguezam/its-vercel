
class API::TasksController < ApplicationController
  def index
    tasks = Task.all
    render json: tasks
  end

  def indexTopics
    topic = Topic.find(params[:topic_id])
    tasks = Task.where(topic_id: topic.id)
    render json: tasks
  end

  def show
    task = Task.find(params[:id])
    render json: task
  end
end
