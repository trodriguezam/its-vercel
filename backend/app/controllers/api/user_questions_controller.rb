
class API::UserQuestionsController < ApplicationController

  def index
    usersquestions = UserQuestion.all
    render json: usersquestions
  end

  def show
    usersquestion = UserQuestion.find(params[:id])
    render json: usersquestion
  end

  def create
    user_question = UserQuestion.new(user_question_params)
    if user_question.save
      render json: user_question, status: :created
    else
      render json: user_question.errors, status: :unprocessable_entity
    end
  end

  def update
    user_question = UserQuestion.find(params[:id])
    if user_question.update(user_question_params)
      render json: user_question
    else
      render json: user_question.errors, status: :unprocessable_entity
    end
  end

  private

  def user_question_params
    params.require(:user_question).permit(:user_id, :question_id, :correct)
  end
end
