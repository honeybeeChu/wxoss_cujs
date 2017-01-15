class WxserverController < ApplicationController
  skip_before_filter :authenticate, :url_check

  def configrefresh
  end

  def health
  end
end
