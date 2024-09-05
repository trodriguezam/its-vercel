
class API::AnswersController < ApplicationController
  def index
    answers = Answer.all
    render json: answers
  end

  def indexAnswers
    question = Question.find(params[:question_id])
    answers = Answer.where(question_id: question.id)
    render json: answers
  end

  def show
    answer = Answer.find(params[:id])
    render json: answer
  end
end