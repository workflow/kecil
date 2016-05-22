require "base64"

module Kecil
  class Asset
    attr_accessor :tag, :svg, :width, :height
    
    def initialize(uri, tag: nil, cache_dir: nil, attributes: "")
      @uri = uri
      @tag = tag
      @cache_dir = cache_dir
      @attributes = attributes
      
      # Import cached svg
      @svg = File.open(cache_path).read if cached?
    end
    
    def import(data)
      @svg = data["svg"]
      @width = data["width"]
      @height = data["height"]
    end
    
    def key
      @key ||= Digest::MD5.new.update(url).hexdigest
    end
    
    def url
      @uri.to_s
    end
    
    def svg_encoded
      Base64::strict_encode64(svg)
    end
    
    def object
      "<object #{@attributes.strip} type=\"image/svg+xml\" data=\"data:image/svg+xml;base64,#{svg_encoded}\"></object>"
    end
    
    def cache_filename
      "#{key}.svg"
    end
    
    def cache_path
      File.join(@cache_dir, cache_filename)
    end
    
    def cached?
      File.exists?(cache_path)
    end
    
    def cache!
      FileUtils.mkdir_p(@cache_dir) unless File.directory?(@cache_dir)
      File.open(cache_path, "w") do |file|
        file.write(svg)
      end
    end
  end
end
