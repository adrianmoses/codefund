Rails.application.routes.draw do
  scope(:path => '/api') do
    resources :campaigns
    resources :users

    resources :admin do
      member do
        get :approve
      end
    end

    post '/schools.json' => 'schools#find_or_create'
    put '/campaigns/:id.json' => 'campaigns#update'
    put '/users/:id.json' => 'users#update'
    put '/users/pw/:id.json' => 'users#update_password'
  end

  get "/*path" => redirect("/?goto=%{path}")
end
