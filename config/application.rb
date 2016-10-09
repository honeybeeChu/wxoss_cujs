require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)
require_relative '../lib/utils/redis_config'

module Wxoss
  REDIS_CACHE_NAMESPACE = 'cache:wxoss'

  class Application < Rails::Application
    config.to_prepare do
      # Load application's model / class decorators
      Dir.glob(File.join(File.dirname(__FILE__), "../app/**/*_decorator*.rb")) do |c|
        Rails.configuration.cache_classes ? require(c) : load(c)
      end
    end
    config.time_zone = 'Beijing'
    config.active_record.default_timezone = :local
    config.autoload_paths << Rails.root.join('lib')

    redis_config_hash = Utils::RedisConfig.redis_store_options
    redis_config_hash[:namespace] = REDIS_CACHE_NAMESPACE
    redis_config_hash[:expires_in] = 2.weeks # Cache should not grow forever
    config.cache_store = :redis_store, redis_config_hash

    config.active_job.queue_adapter = :sidekiq
    config.autoload_paths << Rails.root.join('lib')


    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # 语言国际化默认使用中文
    config.i18n.default_locale = "zh-CN"

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    # ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
    #   errors = Array(instance.error_message).join(',')
    #   %(#{html_tag} #{errors}).html_safe
    # end

  end
end
