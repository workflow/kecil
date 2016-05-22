# Medium like blur up image lazy loader

Kecil is an implementation that allows you to achieve the "Medium Image loading blur effect" read more about it [here](https://jmperezperez.com/medium-image-progressive-loading-placeholder) with very little effort. Kecil will resize your images and create a nice blur effect on the smaller size images, When the larger images are finished loading, they will automatically have an animated blur up effect that shows them in place

![Image blur](https://css-tricks.com/wp-content/uploads/2015/12/blur.gif)

This will help load your webpage a lot faster while maintaining the finished layout without the page jumping around confusing your users like this ->

![Jumping webpage](http://aspiringwebdev.com/wp-content/uploads/2015/03/meal-plan-load-no-padding-bottom.gif)

## Development

    $ npm install
    $ bower install
    
    install imagemagick and graphicsmagick
    see instructions here https://www.npmjs.com/package/gm 
    
    $ grunt serve
