# Kecil Image Lazy Loader with Blurred Previews

Kecil is an implementation that allows you to achieve the "blurry image loading effect" (as seen on Medium) with very little effort. Read more about it [here](https://jmperezperez.com/medium-image-progressive-loading-placeholder). Kecil resizes your images and creates a **nice blur effect** on the smaller images until the larger versions are finished loading. The larger images will fade in as soon as they are available.

This will help load your webpage **a lot faster** while keeping the finished layout from breaking during loading as seen here:

With Kecil :)   | Without Kecil :(
--------------- | ----------------
![Image blur](https://cloud.githubusercontent.com/assets/8395474/15454516/3fd91c6e-206d-11e6-8a8a-b08ea615c39a.gif) | ![Jumping webpage](http://aspiringwebdev.com/wp-content/uploads/2015/03/meal-plan-load-no-padding-bottom.gif)


## Usage

Kecil can be used in a couple of different ways:

### Wordpress Plugin:

We have created a Wordpress wrapper you can download [here](https://something.com).

### Ruby on Rails Gem:

Ruby on Rails users can use a gem you can get from [here](https://something.com).

### Host Kecil on your own server

* Clone repository
    
* Download node version > 6.2 

`$ cd backend`
    
`$ npm install`
    
* Install ImageMagick and GraphicsMagick
-> See instructions [here](https://www.npmjs.com/package/gm)
    
* Create a script that will extract all images you want to kecilify from your html page and gather them in a **JSON format** described below.
    
The **API REST endpoint** /kecilify will consume a JSON-formatted **POST request** with the following format:
    
```JSON
{
    "images": ["http://…jpg", ]
}
```
    
… And will return a JSON with the format:
    
```JSON
{
    "images": [{"key":"h5acd984ab4ac457", "data":"data:image/svg+xml;charset=UTF-8,<svg>…</svg>", "width": 300, "height": 200}, ]
}
```
    
If you are not using any of Kecil's wrappers, you will need to replace the `<img ... />` with an object element in your html like so: `<object type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,<svg>…</svg>">` 
    
Using the returned `data:image/svg+xml;charset=UTF-8,<svg>…</svg>` data from the JSON response.
    
Then run `node app.js` on the server and see the magic happen!
