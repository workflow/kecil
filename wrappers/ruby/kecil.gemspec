lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'kecil/version'

Gem::Specification.new do |s|
  s.name        = "kecil"
  s.version     = Kecil::VERSION
  s.licenses    = ["BSD-3-Clause"]
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Tobias Strebitzer"]
  s.email       = ["tobias.strebitzer@magloft.com"]
  s.homepage    = "https://github.com/workflow/kecil"
  s.summary     = "Kecil Image Awesomization"
  s.description = "Kecil Image Awesomization for rails asset pipeline"
  s.required_ruby_version = '~> 2.0'
  s.required_rubygems_version = '~> 2.4'
  s.add_dependency "bundler", '>= 1.3.0', '< 2.0'
  s.add_runtime_dependency "typhoeus", "~> 1.0"
  s.add_runtime_dependency "addressable", "~> 2.4"
  s.add_development_dependency "rspec", "~> 3.3"
  s.add_development_dependency "pry", "~> 0.10"
  s.files        = `git ls-files`.split("\n")
  s.executables  = `git ls-files -- bin/*`.split("\n").map { |f| File.basename(f) }
  s.require_path = 'lib'
end
