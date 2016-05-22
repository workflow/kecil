require 'kecil/compressor'

module Kecil
  class Rack
    DEFAULT_OPTIONS = {
      enabled: true,
      cache_dir: "cache/kecil",
      backend: "http://localhost:8080/images"
    }

    def initialize(app, options={})
      @app = app
      options = DEFAULT_OPTIONS.merge(options)
      @compressor = Kecil::Compressor.new(options)
    end

    def call(env)
      status, headers, body = @app.call(env)
      if headers.key? 'Content-Type' and headers['Content-Type'] =~ /html/
        content = ''
        body.each do |part|
          content << part
        end
        content = @compressor.compress(content, env)
        headers['Content-Length'] = content.bytesize.to_s if headers['Content-Length']
        [status, headers, [content]]
      else
        [status, headers, body]
      end
    ensure
      body.close if body.respond_to?(:close)
    end
  end
end
