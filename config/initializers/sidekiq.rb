SIDEKIQ_REDIS_NAMESPACE = 'resque:wxoss'

Sidekiq.configure_server do |config|
  config.redis = {
      url: Utils::RedisConfig.url,
      namespace: SIDEKIQ_REDIS_NAMESPACE
  }
end

Sidekiq.configure_client do |config|
  config.redis = {
      url: Utils::RedisConfig.url,
      namespace: SIDEKIQ_REDIS_NAMESPACE
  }
end