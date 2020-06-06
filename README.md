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
//some HTML element on page
const btn = document.getElementById("btnChangeColor");
btn.addEventListener("click", () => {
    // rectangle to place menu beside
    const rect = {x: number, y: number, width: number, height: number}

    // if you want to open menu beside HTML element you can get bounding rect of the element
	//const rect = this.getBoundingClientRect();

	// create new picker
	const colorPicker = new ColorPicker();
    colorPicker.openMenu(rect);
});
```
Take information from picker
```js
colorPicker.getColor(); //return Color
```
or with events
```js
colorPicker.addEventListener("opened", anyFunction);

colorPicker.removeEventListener("opened", anyFunction);


function anyFunction(e)
{
    console.log(e);
}
```

### Picker events:
Event Name | Fired When                  | Data
-----------|-----------------------------|----------------
opened     | picker opened               | Coordinate
reopened   | picker open without closing | Coordinate
closed     | picker closed               | Color
input      | user input color            | Color
changed    | user ends input color       | Color
canceled   | user press cancel button    | Color
confirmed  | user press confirm button   | Color

### Coordinate interface:
parameters |  type  | value
-----------|--------|-----------------------
x          | number | x cord of picker's left upper corner
y          | number | y cord of picker's left upper corner

### Color interface:
parameters |  type  | value
-----------|--------|-----------------------
h          | number | picker curent color in **h**sl format, only hue
s          | number | picker curent color in h**s**l format, only saturation
l          | number | picker curent color in hs**l** format, only lightness
colorHSL   | string | picker curent color in **hsl** format: `"hsl(h, s%, l%)"`
r          | number | picker curent color in **r**gb format, only red
g          | number | picker curent color in r**g**b format, only green
b          | number | picker curent color in rg**b** format, only blue
colorRBG   | string | picker curent color in **rgb** format: `"rgb(r, g, b)"`

## working example:

```js

//create new picker
const colorPicker = new ColorPicker();
colorPicker.addEventListener("changed", e =>
{
	document.body.style.backgroundColor = e.colorHSL;
});

// some HTML element on page
const btn = document.getElementById("btnChangeColor");
btn.addEventListener("click", () =>
{
	// get bounding rect of btn
	const rect = this.getBoundingClientRect();

    colorPicker.openMenu(rect);
});
```


#
## Picker settings
### Placement:
``` js
colorPicker.setPlacement(side, align);
//or when open
colorPicker.openMenu(rect, side, align);
```
side can be "up", "down" or null

align can be "left", "center", "right" or null

![](/docs/menu_place.png)

### Set current color:
``` js
colorPicker.setColorHSL(h, s, l);
colorPicker.setColorRGB(r, g, b);
```

#
## Style:
``` js
colorPicker.setStyle(options);
```

#### To change color of background, text or border and border width:

``` js
options = {
    elementName: {
        text: color
        // or/and
        background: color
        // or/and
        borderColor: color
        // or/and
        borderWidth: number
    }
}
```

All elementNames: "buttonOk", "buttonCancel", "window" or "inputs"

color - color value ("rgb(94, 65, 190)", "hsl(70, 91%, 67%)", "blue", "#23ff45")

number - integer or float number

![](/docs/menu_colors.png)

#### To change window style options:

``` js
options = {
    optionName: value
}
```
optionName can be "roundCorners", "pickedColorBackground" or "pickedColorBorder"

value - boolean (true, false)

roundCorners:

![](/docs/menu_notRounded.png)

pickedColorBorder:

![](/docs/menu_borderColor.gif)

pickedColorBackground:

![](/docs/menu_backgroundColor.gif)

## working example:
``` js
const options = {
    buttonOk: { background: "#00d93d" },
    buttonCancel: { text: "hsl(303, 100%, 27%)"  },
    window: { background: "black", text: "white", borderWidth: 6 },
    inputs: { background: "rgb(115, 115, 115)", text: "white", borderColor: "orange" },
    pickedColorBorder: true
}
colorPicker.setStyle(options);
```

Resut:

![](/docs/menu_darkTheme.png)

#
## All comands

comand              | descripton                     | arguments                             | return
--------------------|--------------------------------|---------------------------------------|----------------------
openMenu_OnCursor   | open picker in cursor position | MouseEvent                            |
openMenu_AroundRect | open picker beside some rect   | rect, side(optional), align(optional) |
setPlacement        | set where picker will appear   | side, align(optional)                 |
setColorHSL         | set picker color               | h, s, l                               |
setColorRGB         | set picker color               | r, g, b                               |
setStyle            | change picker style            | options                               |
getColor            | get picker color               |                                       | Color
addEventListener    | subscribe to event             | eventName, function                   |
removeEventListener | unsubscribe from event         | eventName, function                   |

##
arguments           | arguments type
--------------------|-----------------
MouseEvent          | MouseEvent
rect                | {x: number, y: number, height: number, width: number}
side                | "up" or "down"
align               | "left", "center" or "right"
h, s, l             | number(0-360);  number(0-100);  number(0-100)
r, g, b             | number(0-256);  number(0-256);  number(0-256)

### All options for setStyle
arguments             | arguments type
----------------------|-----------------
buttonOk              | { background: color, text: color, borderColor: color, borderWidth: number };
buttonCancel          | { background: color, text: color, borderColor: color, borderWidth: number };
window                | { background: color, text: color, borderColor: color, borderWidth: number };
inputs                | { background: color, text: color, borderColor: color, borderWidth: number };
roundCorners          | boolean;
pickedColorBackground | boolean;
pickedColorBorder     | boolean;

color - color value ("rgb(94, 65, 190)", "hsl(70, 91%, 67%)", "blue", "#23ff45")

number - integer or float number

### All events
Event Name | Fired When                  | Data
-----------|-----------------------------|----------------------
opened     | picker opened               | Coordinate
reopened   | picker open without closing | Coordinate
closed     | picker closed               | Color
input      | user input color            | Color
changed    | user ends input color       | Color
canceled   | user press cancel button    | Color
confirmed  | user press confirm button   | Color

### Coordinate:
parameters |  type  | value
-----------|--------|-----------------------
x          | number | x cord of picker's left upper corner
y          | number | y cord of picker's left upper corner

### Color:
parameters |  type  | value
-----------|--------|-----------------------
h          | number | picker curent color in **h**sl format, only hue
s          | number | picker curent color in h**s**l format, only saturation
l          | number | picker curent color in hs**l** format, only lightness
colorHSL   | string | picker curent color in **hsl** format: `"hsl(h, s%, l%)"`
r          | number | picker curent color in **r**gb format, only red
g          | number | picker curent color in r**g**b format, only green
b          | number | picker curent color in rg**b** format, only blue
colorRBG   | string | picker curent color in **rgb** format: `"rgb(r, g, b)"`
