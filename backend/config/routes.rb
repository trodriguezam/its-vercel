Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'api/login',
    sign_out: 'api/logout',
    registration: 'api/signup'
  },
  controllers: {
    sessions: 'api/sessions',
    registrations: 'api/registrations'
  }

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    resources :topics, only: [:index, :show] do
      resources :tasks, only: [:index, :show], action: 'indexTopics' 
    end
    resources :questions, only: [:index, :show, :create] do
      resources :answers, only: [:index, :show], action: 'indexAnswers'
    end
    resources :tasks, only: [:index, :show] do 
      resources :questions, only: [:index, :show], action: 'indexQuestions' 
    end
    resources :user_questions, only: [:index, :show, :create, :update]
    resources :user_tasks, only: [:index, :show, :create, :update]
    resources :answers, only: [:index, :show, :create]
    resources :users, only: [:index, :show, :update]
    # enable post method for skip_task
    resources :user_task_skips
  end
end
