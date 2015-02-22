# Star rating

A rating widget directive for AngularJS 1.2
(c) Karoly "Charles" Szilagyi

Twitter: [@karolysz](https://twitter.com/karolysz)

## HTML

Sample HTML code:

```html
<starrating ng-model="food.rating" max="5"></starrating>
```

## Options

``ng-model`` is the object you want to modify via the widget (mandatory).
``max`` is the number of stars a user can give (from 0 to max) (mandatory)

## CSS

A sample CSS style which you can use with [Font Awesome](http://fontawesome.io/):

```less
  // Based on http://css-tricks.com/star-ratings/
  .starrating {
    unicode-bidi: bidi-override;
    direction: rtl;
    text-align: left;
  }
  .starrating > i:hover:before,
  .starrating > i:hover ~ i:before,
  .starrating > i.starrating-yes:before,
  .starrating > i.starrating-yes ~ i:before,
   {
     color: red;
  }

  // \f005 is a star
  // \f004 is a heart
  .starrating > i:before {
    content: "\f005";
  }
```
