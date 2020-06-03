class ColorChangerMenu
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
    public openMenu(e: MouseEvent)
    {
        if (e != undefined)
        {
            document.body.appendChild(this.menu);
            this.moveMenu(e);
            this.menu.style.display = "block";
            this.firstClick = true;
            document.addEventListener("click", this.clickHandler);
        }
    }
    private closeMenu()
    {
        this.menu.parentElement?.removeChild(this.menu);
        this.menu.style.display = "none";
        document.removeEventListener("click", this.clickHandler);
    }
    private moveMenu(e: MouseEvent)
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

        console.log(dX);
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