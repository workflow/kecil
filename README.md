# Kecil Image Lazy Loader with Blurred Previews

Kecil is an implementation that allows you to achieve the "blurry image loading effect" ([as seen on Medium](https://jmperezperez.com/medium-image-progressive-loading-placeholder)) with very little effort. Kecil resizes your images and creates a **nice blur effect** on the smaller images until the larger versions are finished loading. The larger images will fade in as soon as they are available.

This will help load your webpage **a lot faster** while keeping the finished layout from breaking during loading as seen here:

With Kecil :)   | Without Kecil :(
--------------- | ----------------
![Image blur](https://cloud.githubusercontent.com/assets/8395474/15454516/3fd91c6e-206d-11e6-8a8a-b08ea615c39a.gif) | ![Jumping webpage](http://aspiringwebdev.com/wp-content/uploads/2015/03/meal-plan-load-no-padding-bottom.gif)


## Usage

At this point, Kecil works without JavaScript. Simply put, it preprocesses your images and creates inlined SVG drop-ins to use instead of your original images.

Kecil can be used in a couple of different ways:

### Wordpress Plugin:

We have created a Wordpress wrapper you can download [here](https://github.com/danborufka/wp-kecil).

### Ruby on Rails Gem:

Ruby on Rails users can use a gem you can get from [here](https://something.com).

### Host Kecil on your own server

* Clone repository (in your terminal, run `git clone https://github.com/workflow/kecil.git`)
    
* Download node version > 6.2 

* Run `$ cd backend`

* Run `$ npm install`
    
* Install ImageMagick and GraphicsMagick
  -> See instructions [here](https://www.npmjs.com/package/gm)
    
* Create a script that will extract all images you want to kecilify from your html page and gather them in a **JSON format** described below.

To test, run `node app.js`
    
The **API REST endpoint** /kecilify will consume a JSON-formatted **POST request** with the following format:
    
```JSON
{
    "images": ["http://…jpg", ]
}
```

An example can be found using: 

```CURL
$ curl -d @backend/sample/sample-api-request.json --header "Content-Type: application/json" http://localhost:3000/kecilify
```
    
… And will return a JSON with the format:
    
```JSON
{
    "images": [{"key":"h5acd984ab4ac457", "data":"data:image/svg+xml;charset=UTF-8,<svg>…</svg>", "width": 300, "height": 200}, ]
}
```
    
If you are not using any of Kecil's wrappers, you will need to replace the `<img ... />` with an object element in your HTML like so: 
````html
<object type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,<svg>…</svg>">
````
    
Using the returned `data:image/svg+xml;charset=UTF-8,<svg>…</svg>` data from the JSON response.
    
Then run `node app.js` on the server and see the magic happen!


## Limitations

Kecil takes care of your images and intends you to use object tags instead. Be aware that **any CSS** addressing images directly via the **tagname selector**: 
````css
img { … }
````
 …will not take effect on the objects unless you add them accordingly: 
 ````css
 img, object { … }
 ```` 
 We strongly recommend using classes in such cases, as Kecil's wrapper *do* let the resulting objects inherit all attributes from the original image.
 In the future, Kecil shall replace the objects back with images once loading is finished so advantages of the image tag can still be leveraged.

![Kecil Logo](https://cloud.githubusercontent.com/assets/8395474/15454561/f2104a32-206e-11e6-957a-d5b660e95d8b.png)   
(The Kecil Logo)
