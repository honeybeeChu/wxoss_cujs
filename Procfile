web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -q default
clear_cache_store: bundle exec rake 'cache:clear'
#logrotate: cp ./lib/supports/logrotate/wxoss ./tmp/wxoss