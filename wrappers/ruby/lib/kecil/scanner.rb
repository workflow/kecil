require "kecil/asset"
require "addressable/uri"

module Kecil
  class Scanner
    attr_accessor :assets
    
    def initialize(html, options)
      @html = html
      @options = options
      @origin = Addressable::URI.parse(options[:origin]) if options[:origin]
      @assets = html.scan(/(<img\s([^>]*)src="([^"]+)"([^>]*?)\/?>)/).map { |(tag, attr_pre, url, attr_post)|
        uri = Addressable::URI.parse(url)
        uri = @origin.join(uri) if uri.relative?
        asset = Asset.new(uri, tag: tag, cache_dir: options[:cache_dir], attr_pre: attr_pre, attr_post: attr_post)
        [asset.key, asset]
      }.to_h
    end
    
    def cached_assets
      @assets.select{|key, asset| asset.cached?}
    end
    
    def uncached_assets
      @assets.select{|key, asset| !asset.cached?}
    end
  end
end
