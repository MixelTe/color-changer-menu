type PosY = "up" | "down";
type PosX = "left" | "center" | "right";

class ColorPicker
{

    private menu: HTMLDivElement;
    private menuTop: HTMLDivElement;
    private menuBelow: HTMLDivElement;
    private canva: HTMLCanvasElement;
    private height = 230;
    private width = 190;
    private X = 0;
    private Y = 0;
    private clickHandler = this.isInFocus.bind(this);
    private firstClick = false;

    constructor()
    {
        this.menu = document.createElement("div");
        this.menu.style.backgroundColor = "lightgray";
        this.menu.style.border = "3px solid black";
        this.menu.style.width = "190px";
        this.menu.style.height = "230px";
        this.menu.style.display = "block";
        this.menu.style.position = "absolute";
        this.menu.style.left = "40px";
        this.menu.style.top = "40px";




        this.menuTop = document.createElement("div");
        this.menuTop.style.backgroundColor = "lightgray";
        this.menuTop.style.width = "190px";
        this.menuTop.style.height = "120px";
        this.menuTop.style.display = "block";
        this.menuTop.style.marginTop = "10px";
        this.menu.appendChild(this.menuTop);

        this.canva = document.createElement("canvas");
        this.canva.style.backgroundColor = "gray";
        this.canva.style.border = "1px solid black";
        this.canva.style.width = "170px";
        this.canva.style.height = "120px";
        this.canva.style.display = "block";
        this.canva.style.marginLeft = "auto";
        this.canva.style.marginRight = "auto";
        this.menuTop.appendChild(this.canva);





        this.menuBelow = document.createElement("div");
        this.menuBelow.style.backgroundColor = "lightgray";
        this.menuBelow.style.width = "190px";
        this.menuBelow.style.height = "100px";
        this.menuBelow.style.display = "block";
        this.menu.appendChild(this.menuBelow);



        this.menu.style.display = "none";
    }
    public openMenu_OnCursor(e: MouseEvent)
    {
        this.moveMenuToCursor(e);
        this.openMenu();
    }
    public openMenu_AroundRect(rect: Rect, positionY?: PosY, positionX?: PosX, strict?: boolean)
    {
        this.moveMenuAroundRect(rect, positionY, positionX, strict);
        this.openMenu();
    }
    private moveMenuToCursor(e: MouseEvent)
    {
        const pY = e.pageY;
        const cY = e.clientY;
        const dY = pY - cY;
        let newY = Math.max(pY - this.height - 16, dY + 10);
        this.Y = newY
        this.menu.style.top = newY + "px";

        const pX = e.pageX;
        const cX = e.clientX;
        const dX = pX - cX;
        let newX = Math.max(Math.min(pX - this.width / 2, window.innerWidth + dX - this.width - 30), 10);
        this.X = newX
        this.menu.style.left = newX + "px";
    }
    private moveMenuAroundRect(rect: Rect, positionY: PosY = "up", positionX: PosX = "left", strict = false)
    {
        if (typeof rect != "object") throw new Error(`rect parameter invalid. It must be object with parameters: x, y, width, height, where y is upper left corner. Your value: '${rect}'`);
        if (typeof rect.x != "number") throw new Error(`rect.x parameter invalid. It must be number. Your value: '${rect.x}'`);
        if (typeof rect.y != "number") throw new Error(`rect.y parameter invalid. It must be number that mean upper left corner of rect. Your value: '${rect.y}'`);
        if (typeof rect.width != "number") throw new Error(`rect.width parameter invalid. It must be number. Your value: '${rect.width}'`);
        if (typeof rect.height != "number") throw new Error(`rect.height parameter invalid. It must be number. Your value: '${rect.height}'`);
        switch (positionY) {
            case "up":
                {
                    let newY = rect.y - this.height;
                    if (!strict && newY < 0)
                    {
                        newY = rect.y + rect.height;
                    }
                    this.Y = newY
                    this.menu.style.top = newY + "px";
                }
                break;

            case "down":
                {
                    let newY = rect.y + rect.height;
                    if (!strict && newY + this.height > document.body.offsetHeight && rect.y - this.height > 0)
                    {
                        newY = rect.y - this.height;
                    }
                    this.Y = newY
                    this.menu.style.top = newY + "px";
                }
                break;

            default:
                throw new Error(`positionY parameter invalid. It can be: 'up' or 'down'. Your value: '${positionY}'`);
        }
        switch (positionX) {
            case "left":
                {
                    let newX = rect.x;
                    if (!strict && newX > document.body.offsetWidth - this.width)
                    {
                        newX = rect.x + rect.width - this.width;
                    }
                    this.X = newX
                    this.menu.style.left = newX + "px";
                }
                break;

            case "center":
                {
                    let newX = rect.x + rect.width/2 - this.width / 2;
                    if (!strict)
                    {
                        newX = Math.max(Math.min(newX, document.body.offsetWidth - this.width), 0);
                    }
                    this.X = newX
                    this.menu.style.left = newX + "px";
                }
                break;

            case "right":
                {
                    let newX = rect.x + rect.width - this.width;
                    if (!strict && newX < document.body.offsetLeft)
                    {
                        newX = rect.x;
                    }
                    this.X = newX
                    this.menu.style.left = newX + "px";
                }
                break;

            default:
                throw new Error(`positionX parameter invalid. It can be: 'left', 'center' or 'right'. Your value: '${positionX}'`);
        }
    }


    private openMenu()
    {
        document.body.appendChild(this.menu);
        this.menu.style.display = "block";
        this.firstClick = true;
        document.addEventListener("click", this.clickHandler);
    }
    private closeMenu()
    {
        this.menu.parentElement?.removeChild(this.menu);
        this.menu.style.display = "none";
        document.removeEventListener("click", this.clickHandler);
    }
    private isInFocus(e: MouseEvent)
    {
        if (this.firstClick)
        {
            this.firstClick = false;
        }
        else
        {
            const y = e.pageY;
            const x = e.pageX;
            if (!this.clickIntersect(x, y))
            {
                this.closeMenu();
            }
        }
    }
    private clickIntersect(x: number, y: number)
    {
        const f = this.isInFocus;
        const d = document;
        const e = <MouseEvent>{};
        const args = [1];

        return (
            x > this.X &&
            x < this.X + this.width &&
            y > this.Y &&
            y < this.Y + this.height
        );
    }
}
interface Rect
{
    x: number;
    y: number;
    width: number;
    height: number;
}