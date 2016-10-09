module ApplicationHelper
  def plugin_css(route, options={})
    options.merge!({rel: "stylesheet", type: "text/css", href: "/plugins/"+route})
    tag "link", options
  end

  def plugin_js(route, options={})
    #<script type="text/javascript" src="plugins/webuploader/webuploader.js"></script>
    options.merge!({type: "text/javascript", src: "/plugins/"+route})
    content_tag :script, nil, options
  end
end
