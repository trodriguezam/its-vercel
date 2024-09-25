
class API::UserTopicsController < ApplicationController

  def index
    userstopics = UserTopic.all
    render json: userstopics
  end

  def show
    userstopic = UserTopic.find(params[:id])
    render json: userstopic
  end

  def create
    user_topic = UserTopic.new(user_topic_params)
    if user_topic.save
      render json: user_topic, status: :created
    else
      render json: user_topic.errors, status: :unprocessable_entity
    end
  end

  def update
    user_topic = UserTopic.find(params[:id])
    if user_topic.update(user_topic_params)
      render json: user_topic
    else
      render json: user_topic.errors, status: :unprocessable_entity
    end
  end

  private

  def user_topic_params
    params.require(:user_topic).permit(:user_id, :topic_id, :completion)
  end

end
