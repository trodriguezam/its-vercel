
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

  def create
    answer = Answer.new(answer_params)
    if answer.save
      render json: answer, status: :created
    else
      render json: answer.errors, status: :unprocessable_entity
    end
  end

  private

  def answer_params
    params.require(:answer).permit(:question_id, :answer_text, :correct)
  end
end