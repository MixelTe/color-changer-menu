# Color picker menu

## How it works
open it with mouse event

![](/docs/menu.png)

to close, click outside the menu


#
## How to use it
Add import for script to html

```html
<head>
    <script defer src="./colorPicker.js"></script>
    <!-- your code: -->
    <script defer src="./main.js"></script>
</head>
```
Write code in your program to use it
```js

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

    //create new picker
    const colorPicker = new ColorPicker();
    colorPicker.openMenu(rect);
}
```