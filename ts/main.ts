const a = document.getElementById("one");
if (a != null) a.addEventListener("click", btnClick);

const b = document.getElementById("two");
if (b != null) b.addEventListener("click", btnClick);

const c = document.getElementById("three");
if (c != null) c.addEventListener("click", btnClick);

const d = document.getElementById("four");
if (d != null) d.addEventListener("click", btnClick);

const e = document.getElementById("five");
if (e != null) e.addEventListener("click", btnClick);

const f = document.getElementById("six");
if (f != null) f.addEventListener("click", btnClick);

const g = document.getElementById("seven");
if (g != null) g.addEventListener("click", btnClick);

const colorPicker = new ColorPicker();
// colorPicker.styleColors("inputs", "background", "rgb(100, 100, 100)");
// colorPicker.styleWindow("pickedColorBorder", true);
// colorPicker.setColorHSL(200, 100, 50);

colorPicker.menuWindow.addEventListener("colorPicker-opened", (e) => console.log((<CustomEvent>e).detail));
colorPicker.menuWindow.addEventListener("colorPicker-reopened", (e) => console.log((<CustomEvent>e).detail));
colorPicker.menuWindow.addEventListener("colorPicker-closed", (e) => console.log((<CustomEvent>e).detail));

colorPicker.menuWindow.addEventListener("colorPicker-input", (e) => console.log((<CustomEvent>e).detail));
colorPicker.menuWindow.addEventListener("colorPicker-changed", (e) => console.log((<CustomEvent>e).detail));

colorPicker.menuWindow.addEventListener("colorPicker-canceled", (e) => console.log((<CustomEvent>e).detail));
colorPicker.menuWindow.addEventListener("colorPicker-confirmed", (e) => console.log((<CustomEvent>e).detail));

function btnClick(this: HTMLElement, e: MouseEvent)
{
    const rect = { x: this.offsetLeft, y: this.offsetTop - 5, width: this.offsetWidth - 6, height: this.offsetHeight + 5 };
    colorPicker.openMenu_AroundRect(rect, "up", "left");
}