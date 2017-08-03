APP_PATH = "/var/www/codefund/current"
working_directory APP_PATH

stderr_path APP_PATH + "/log/unicorn.log"
stdout_path APP_PATH + "/log/unicorn.log"

pid APP_PATH + "/pids/unicorn.pid"

listen APP_PATH + "/tmp/sockets/unicorn.codefund.sock"
listen "127.0.0.1:8080", :tcp_nopush => true


worker_processes 2

timeout 30
