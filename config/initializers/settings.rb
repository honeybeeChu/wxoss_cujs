class Settings < Settingslogic
  source "#{Rails.root}/config/application.yml"
  namespace Rails.env
  load!
  suppress_errors Rails.env.production?
end