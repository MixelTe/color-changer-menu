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

const colorChangerMenu = new ColorChangerMenu();

function btnClick(e: MouseEvent)
{
    colorChangerMenu.openMenu(e);
}