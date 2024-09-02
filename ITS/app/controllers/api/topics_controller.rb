# app/controllers/api/topics_controller.rb
module Api
    class TopicsController < ApplicationController
      def index
        topics = Topic.all
        render json: topics
      end
  
      def show
        topic = Topic.find(params[:id])
        render json: topic
      end
    end
  end