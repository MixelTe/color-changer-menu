// document.body.addEventListener("click", function (e: MouseEvent)
// {
// 	const el = e.target;

// 	if (el instanceof HTMLButtonElement)
// 	{
// 		const rect = { x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth - 6, height: el.offsetHeight };
// 		colorPicker.openMenu(rect);
// 	}
// });

document.body.querySelectorAll("button")
	.forEach(el =>
	{
		el.addEventListener("click", btnClick);
	});

const colorPicker = new ColorPicker();
// colorPicker.setStyle({window: {text: "blue"}});
// colorPicker.setColorHSL(200, 100, 50);
// colorPicker.setPlacement("down", "center");

// function logIt(e:MyEvent)
// {
//     console.log(e.eventName, e);
// }

// colorPicker.addEventListener("colorPicker-opened", logIt);
// colorPicker.addEventListener("colorPicker-reopened", logIt);
// colorPicker.addEventListener("colorPicker-closed", logIt);
// colorPicker.addEventListener("colorPicker-input", logIt);
// colorPicker.addEventListener("colorPicker-changed", logIt);
// colorPicker.addEventListener("colorPicker-canceled", logIt);
// colorPicker.addEventListener("colorPicker-confirmed", logIt);

// colorPicker.removeEventListener("colorPicker-opened", logIt);

const options = {
    buttonOk: { background: "#00d93d" },
    buttonCancel: { text: "hsl(303, 100%, 27%)"  },
    window: { background: "black", text: "white", borderWidth: 6 },
    inputs: { background: "rgb(115, 115, 115)", text: "white", borderColor: "orange" },
    pickedColorBorder: true
}
colorPicker.setStyle(options);

function btnClick(this: HTMLElement, e: MouseEvent)
{
    const rect = { x: this.offsetLeft, y: this.offsetTop, width: this.offsetWidth - 6, height: this.offsetHeight + 5 };
    colorPicker.openMenu(rect);
}