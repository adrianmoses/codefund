# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'codefund'
set :repo_url, 'git@bitbucket.org:amoses/codefund.git'

set :deploy_to, '/var/www/codefund'

set :scm, :git
set :branch, "master"

set :user, "adrian"
set :port, 22

set :rails_env, "production"

set :deploy_via, :remote_cache

set :stages, ["production"]

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
# Default value for keep_releases is 5
set :keep_releases, 3

namespace :deploy do

  task :symlink_config do
    on roles(:app) do
      execute "ln -sf #{shared_path}/database.yml #{release_path}/config/database.yml"
    end
  end

  after :updating, :symlink_config
end
