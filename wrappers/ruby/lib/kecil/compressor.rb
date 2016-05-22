require "typhoeus"
require "addressable/uri"

module Kecil
  class Compressor
    IMAGE_PATTERN = 
    
    def initialize(options={})
      @options = options
    end

    def compress(html, env)
      return html if not @options[:enabled] or html.nil? or html.length == 0
      
      # Prepare request information
      req = ::Rack::Request.new(env)
      req_uri = Addressable::URI.parse(req.url)
      root_uri = env["REQUEST_URI"];
      
      # Build image data
      image_data = {}
      html.scan(/(<img.*src="([^"]+)"\/?[^>]+>)/).each do |(tag, url)|
        uri = Addressable::URI.parse(url)
        uri = req_uri.join(uri) if uri.relative?
        md5 = Digest::MD5.new.update(uri).hexdigest
        image_data[md5] = uri.to_s
      end
      
      # Transpose images via api
      # curl -d @backend/sample/sample-api-request.json --header "Content-Type: application/json" http://localhost:3000/kecilify
      # response = Typhoeus.post(@options[:backend], body: image_data)

      html
    end
  end
end
