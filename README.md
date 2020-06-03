# Color changer menu

## How it works
open it with mouse event

![](/docs/menu.png)

to close, click outside the menu


#
## How to use it
Add import for script to html

```html
<head>
    <script defer src="./colorChanger.js"></script>
    <!-- your code: -->
    <script defer src="./main.js"></script>
</head>
```
Write code in your program to use it
``` js
//create new changer
const colorChangerMenu = new ColorChangerMenu();

//some object on page
const a = document.getElementById("one");

//add any mouse event listener with openMenu function
a.addEventListener("click", colorChangerMenu.openMenu());
```