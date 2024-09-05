class API::QuestionsController < ApplicationController
  def index
    questions = Question.all
    render json: questions
  end

  def indexQuestions
    task = Task.find(params[:task_id])
    questions = Question.where(task_id: task.id)
    render json: questions
  end

  def show
    question = Question.find(params[:id])
    render json: question
  end

  private

  def question_params
    params.require(:question).permit(:question_text, :task_id)
  end
end
