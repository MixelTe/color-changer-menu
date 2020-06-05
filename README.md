# Color picker menu

![](/docs/menu.png)


#
## How to use it
Add import for script to html

```html
<head>
    <script defer src="./colorPicker.js"></script>
    <!-- your code: -->
    <script defer src="./main.js"></script>
```
Add this style to html (optional)
``` html
    <style>
        .ColorPickerHInput::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 10px;
            height: 25px;
            border-radius: 4px;
            background: rgb(85, 85, 85);
            cursor: pointer;
        }
    </style>
</head>
```
Write code in your program to use it
```js

//create new picker
const colorPicker = new ColorPicker();

//some HTML element on page
const a = document.getElementById("one");
a.addEventListener("click", openPicker);

//create function to open menu
function openPicker()
{
    //rectangle to place menu beside
    const rect = {x: number, y: number, width: number, height: number}

    //if you want to open menu beside HTML element you can calculate rect this way:
    const rect = {x: this.offsetLeft, y: this.offsetTop, width: this.offsetWidth, height: this.offsetHeight}

    colorPicker.openMenu(rect);
}
```

#
## Picker setting
### Placement:
``` js
colorPicker.openMenu(rect, Ypos, Xpos);
```
Ypos can be "up" or "down"

Xpos can be "left", "center" or "right"

![](/docs/menu_place.png)

### Set current color:
``` js
colorPicker.setColorHSL(h, s, l);
colorPicker.setColorRGB(r, g, b);
```

### Style:
To change/get color of background or font:

``` js
colorPicker.styleColors(element, parameter, color); //change
colorPicker.styleColors(element, parameter); //get color
```

element can be "buttonOk", "buttonCancel", "window" or "inputs"

parameter can be "font" or "background"

color - some color

![](/docs/menu_colors.png)

To change/get window style options:

``` js
colorPicker.styleWindow(option, arg); //change
colorPicker.styleWindow(option); //get boolean
```
option can be "roundCorners", "pickedColorBackground" or "pickedColorBorder"

arg - boolean

roundCorners false

![](/docs/menu_notRounded.png)

pickedColorBorder true

![](/docs/menu_borderColor.gif)

pickedColorBackground true

![](/docs/menu_backgroundColor.gif)