# Be sure to restart your server when you modify this file.

redis_config = Utils::RedisConfig.redis_store_options
redis_config[:namespace] = 'session:wxoss'

Rails.application.config.session_store(
    :redis_store, # Using the cookie_store would enable session replay attacks.
    servers: redis_config,
    key: '_wxoss_session',
    secure: false,
    httponly: true,
    expire_after: 10080 * 60,
    path: '/wxoss'
)
