# Kecil Image Lazy Loader with Blurred Previews

Kecil is an implementation that allows you to achieve the "blurry image loading effect" (as seen on Medium) with very little effort. Read more about it [here](https://jmperezperez.com/medium-image-progressive-loading-placeholder). Kecil resizes your images and creates a nice blur effect on the smaller images until the larger versions are finished loading. The larger images will fade in as soon as they are available.

![Image blur](https://css-tricks.com/wp-content/uploads/2015/12/blur.gif)

This will help load your webpage a lot faster while keeping the finished layout from breaking during loading like seen here:

![Jumping webpage](http://aspiringwebdev.com/wp-content/uploads/2015/03/meal-plan-load-no-padding-bottom.gif)

## Usage

Kecil can be used in a couple of different ways:

1. Use Kecil's hosted solution for your webpage with implementation wrappers:

For Wordpress users, we have created a plugin you can download [here](https://something.com)
Ruby on Rails users can use a gem you can get [here](https://something.com)

2. Host Kecil on your own server

    Clone repository
    
    Download node version > 6.2 

    `$ cd backend`
    
    `$ npm install`
    
    install imagemagick and graphicsmagick
    see instructions [here](https://www.npmjs.com/package/gm)
    
    Create a script that will extract all images you want to kecilify from your html page and gather them in a JSON format described below.
    
    The api rest endpoint /kecilify will consume a POST request with a JSON with the format:
    
    ```JSON
    {
        "images": ["http://…jpg", ]
    }
    ```
    
    And it will return a JSON with the format:
    
    ```JSON
    {
        "images": [{"key":"h5acd984ab4ac457", "data":"<svg>…</svg>", "width": 300, "height": 200}, ]
    }
    ```
    
    If you are not using any of Kecil's wrappers you will need to replace the `<img ... />` with an object element using the returned `data:image/svg+xml;charset=UTF-8,<svg>…</svg>` data from the response> `<object type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,<svg>…</svg>">`
    
    Then run `node app.js` on the server
