# Medium like blur up image lazy loader

Kecil is an implementation that allows you to achieve the "Medium Image loading blur effect" with very little effort, read more about it [here](https://jmperezperez.com/medium-image-progressive-loading-placeholder). Kecil will resize your images and create a nice blur effect on the smaller size images, When the larger images are finished loading, they will automatically have an animated blur up effect that shows them in place

![Image blur](https://css-tricks.com/wp-content/uploads/2015/12/blur.gif)
Right

This will help load your webpage a lot faster while maintaining the finished layout without the page jumping around confusing your users like this ->

![Jumping webpage](http://aspiringwebdev.com/wp-content/uploads/2015/03/meal-plan-load-no-padding-bottom.gif)
Wrong

## Usage

Kecil can be used in a couple different ways

1. Use Kecils hosted solution for your webpage with implementation wrappers

With wordpress we have created a plugin you can download [here](https://something.com)
With Ruby on Rails we have created a gem you can get [here](https://something.com)

2. Host Kecil on your own server

    Clone repository
    
    Download node version > 6.2 

    `$ cd backend`
    
    `$ npm install`
    
    install imagemagick and graphicsmagick
    see instructions [here](https://www.npmjs.com/package/gm)
    
    The api rest endpoint /kecilify will consume a POST request with a JSON with the format:
    
    ```JSON
    {
        "images": ["http://…jpg", ...]
    }
    ```
    
    And it will return a JSON with the format:
    
    ```JSON
    {
        "images": [{"key":"h5acd984ab4ac457", "data":"<svg>…</svg>", "width": 300, "height": 200}, ...]
    }
    ```
    
    If you are not using any of Kecil's wrappers you will need to replace the <img ... /> with the returned <svg>…</svg> data
    
    Then run your node however you wish with app.js being the server file
