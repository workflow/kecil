require "kecil/scanner"
require "json"
require "typhoeus"

module Kecil
  class Compressor
    
    def initialize(options={})
      @options = options
    end

    def compress(html, env)
      return html if not @options[:enabled] or html.nil? or html.length == 0
      req = ::Rack::Request.new(env)
      
      # Prepare request information
      scanner = Scanner.new(html, origin: req.url, cache_dir: @options[:cache_dir])
      
      # Handle cached assets
      scanner.cached_assets.each do |key, asset|
        html.gsub!(asset.tag, asset.object)
      end
      
      # Transpose images via api
      images = scanner.uncached_assets.map{|key, asset| [asset.key, asset.url]}.to_h
      if images.size > 0
        response = Typhoeus.post(@options[:backend], body: images, headers: { 'Content-Type' => "application/json"})
        data = JSON.parse(response.body)
      
        # Replace image tags
        data["images"].each do |image|
          if asset = scanner.assets[image["key"]]
            # Import data into asset
            asset.import(image)
        
            # Replace html
            html.gsub!(asset.tag, asset.object)
        
            # Cache asset
            asset.cache!
          end
        end
      end

      html
    end
  end
end
