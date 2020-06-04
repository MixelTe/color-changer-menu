type PosY = "up" | "down";
type PosX = "left" | "center" | "right";

class ColorPicker
{

    private menuWindow: HTMLDivElement;

    private menuTop: HTMLDivElement;
    private closeButton: HTMLDivElement;

    private menu: HTMLDivElement;
    private canva: HTMLCanvasElement;
    private curColorDiv: HTMLDivElement;
    private rangeInputH: HTMLInputElement;
    private inputH: HTMLInputElement;
    private inputL: HTMLInputElement;
    private inputS: HTMLInputElement;

    private menuBottom: HTMLDivElement;
    private okButton: HTMLDivElement;

    private height = 230;
    private width = 190;
    private X = 0;
    private Y = 0;
    private clickHandler = this.isInFocus.bind(this);
    private closeHandler = this.closeMenu.bind(this);
    private firstClick = false;
    private isOpen = false;
    private colorH = 0;
    private colorS = 100;
    private colorL = 50;
    private ctx: CanvasRenderingContext2D;

    constructor()
    {
        const inputWidth = 25;
        const inputHeight = 16;
        const topMenuHeight = 17;
        const bottomMenuHeight = 25;

        this.menuWindow = document.createElement("div");
        this.menuWindow.style.backgroundColor = "lightgray";
        this.menuWindow.style.border = "3px solid black";
        this.menuWindow.style.borderRadius = "5%";
        this.menuWindow.style.width = this.width + "px";
        this.menuWindow.style.height = this.height + "px";
        this.menuWindow.style.display = "block";
        this.menuWindow.style.position = "absolute";
        this.menuWindow.style.left = "40px";
        this.menuWindow.style.top = "40px";



        {
            this.menuTop = document.createElement("div");
            // this.menuTop.style.backgroundColor = "darkgray";
            this.menuTop.style.width = "100%";
            this.menuTop.style.height = topMenuHeight + "px";
            this.menuTop.style.display = "block";
            this.menuWindow.appendChild(this.menuTop);

            let backgrounCloseButton: string;
            {
                const canva = document.createElement("canvas");
                canva.width = topMenuHeight - 2;
                canva.height = topMenuHeight - 2;
                const ctx = canva.getContext("2d");
                if (ctx != null)
                {
                    ctx.fillStyle = "red";
                    ctx.fillRect(0, 0, canva.width, canva.height);
                    ctx.fillStyle = "black";
                    const a = 4;
                    ctx.lineWidth = 2;
                    ctx.beginPath;
                    ctx.moveTo(a, a);
                    ctx.lineTo(canva.width - a, canva.height - a);
                    ctx.moveTo(canva.width - a, a);
                    ctx.lineTo(a, canva.height - a);
                    ctx.stroke();
                }
                backgrounCloseButton = 'url(' + canva.toDataURL("image/png") + ')';
            }

            this.closeButton = document.createElement("div");
            this.closeButton.style.borderRadius = "7px";
            // this.closeButton.style.backgroundColor = "red";
            this.closeButton.style.backgroundImage = backgrounCloseButton;
            this.closeButton.style.width = topMenuHeight - 2 + "px";
            this.closeButton.style.height = topMenuHeight - 2 + "px";
            this.closeButton.style.display = "block";
            this.closeButton.style.marginLeft = "auto";
            this.closeButton.style.marginRight = "2px";
            this.closeButton.style.marginTop = "2px";
            this.closeButton.style.cursor = "pointer";
            this.menuTop.appendChild(this.closeButton);
        }

        {
            const canvaWidth = 180;
            const canvaHeight = 110;
            // const canvaWidth = 760;
            // const canvaHeight = 700;
            this.menu = document.createElement("div");
            this.menu.style.backgroundColor = "lightgray";
            this.menu.style.borderRadius = "5%";
            this.menu.style.width = "100%";
            this.menu.style.height = this.height - topMenuHeight - bottomMenuHeight + "px";
            this.menu.style.display = "block";
            this.menuWindow.appendChild(this.menu);

            this.canva = document.createElement("canvas");
            this.canva.style.backgroundColor = "white";
            this.canva.style.border = "2px solid black";
            this.canva.style.boxSizing = "border-box";
            this.canva.style.borderRadius = "5px 5px 0px 0px";
            this.canva.style.width = canvaWidth + "px";
            this.canva.style.height = canvaHeight + "px";
            this.canva.width = canvaWidth;
            this.canva.height = canvaHeight;
            this.canva.style.display = "block";
            this.canva.style.marginLeft = "auto";
            this.canva.style.marginRight = "auto";
            this.menu.appendChild(this.canva);

            this.curColorDiv = document.createElement("div");
            this.curColorDiv.style.backgroundColor = this.getColor();
            // this.curColorDiv.style.backgroundColor = "lightblue";
            this.curColorDiv.style.borderRadius = "0 0 5px 5px";
            this.curColorDiv.style.width = "180px";
            this.curColorDiv.style.height = "15px";
            this.curColorDiv.style.display = "block";
            this.curColorDiv.style.marginLeft = "auto";
            this.curColorDiv.style.marginRight = "auto";
            this.menu.appendChild(this.curColorDiv);


            const rangeInputHWidth = 180;
            const rangeInputHHeight = 25;
            let backgrounRangeInput: string;
            {
                const canva = document.createElement("canvas");
                canva.width = rangeInputHWidth;
                canva.height = rangeInputHHeight;
                const ctx = canva.getContext("2d");
                if (ctx != null)
                {
                    const segWidth = 2;
                    // const segWidth = rangeInputHWidth / 360;
                    const multiply = rangeInputHWidth / 360 / segWidth;
                    for (let i = 0; i < rangeInputHWidth / segWidth; i++)
                    {
                        ctx.fillStyle = `hsl(${i / multiply}, 100%, 50%)`;
                        ctx?.fillRect(segWidth * i, 0, segWidth, rangeInputHHeight);
                    }
                }
                backgrounRangeInput = 'url(' + canva.toDataURL("image/png") + ')';
            }
            this.rangeInputH = document.createElement("input");
            this.rangeInputH.type = "range";
            this.rangeInputH.min = "0";
            this.rangeInputH.max = "360";
            this.rangeInputH.classList.toggle("ColorPickerHInput");
            this.rangeInputH.style.outline = "none";
            this.rangeInputH.style.webkitAppearance = "none";
            // this.rangeInputH.style.backgroundColor = "lightgreen";
            this.rangeInputH.style.backgroundImage = backgrounRangeInput;
            this.rangeInputH.style.borderRadius = "5px";
            this.rangeInputH.style.width = rangeInputHWidth + "px";
            this.rangeInputH.style.height = rangeInputHHeight + "px";
            this.rangeInputH.style.display = "block";
            this.rangeInputH.style.marginLeft = "auto";
            this.rangeInputH.style.marginRight = "auto";
            this.menu.appendChild(this.rangeInputH);


            {
                const divForInputs = document.createElement("table");
                divForInputs.style.width = "90%";
                divForInputs.style.height = "26px";
                divForInputs.style.marginLeft = "auto";
                divForInputs.style.marginRight = "auto";
                this.menu.appendChild(divForInputs);


                const divForInputsH = document.createElement("td");
                divForInputs.appendChild(divForInputsH);

                const textH = document.createElement("label");
                textH.style.display = "inline-block";
                textH.innerText = "H:";
                textH.htmlFor = "inputH";
                divForInputsH.appendChild(textH);

                this.inputH = document.createElement("input");
                this.inputH.style.display = "inline-block";
                this.inputH.type = "text";
                this.inputH.id = "inputH";
                this.inputH.style.width = inputWidth + "px";
                this.inputH.style.height = inputHeight + "px";
                divForInputsH.appendChild(this.inputH);


                const divForInputsS = document.createElement("td");
                divForInputs.appendChild(divForInputsS);

                const textS = document.createElement("label");
                textS.style.display = "inline-block";
                textS.innerText = "S:";
                textS.htmlFor = "inputS";
                divForInputsS.appendChild(textS);

                this.inputS = document.createElement("input");
                this.inputS.style.display = "inline-block";
                this.inputS.type = "text";
                this.inputS.id = "inputS";
                this.inputS.style.width = inputWidth + "px";
                this.inputS.style.height = inputHeight + "px";
                divForInputsS.appendChild(this.inputS);


                const divForInputsL = document.createElement("td");
                divForInputs.appendChild(divForInputsL);

                const textL = document.createElement("label");
                textL.style.display = "inline-block";
                textL.innerText = "L:";
                textL.htmlFor = "inputL";
                divForInputsL.appendChild(textL);

                this.inputL = document.createElement("input");
                this.inputL.style.display = "inline-block";
                this.inputL.type = "text";
                this.inputL.id = "inputL";
                this.inputL.style.width = inputWidth + "px";
                this.inputL.style.height = inputHeight + "px";
                divForInputsL.appendChild(this.inputL);
            }
        }

        {
            this.menuBottom = document.createElement("div");
            // this.menuTop.style.backgroundColor = "darkgray";
            this.menuBottom.style.width = "100%";
            this.menuBottom.style.height = bottomMenuHeight + "px";
            this.menuBottom.style.display = "block";
            this.menuWindow.appendChild(this.menuBottom);

            const okButtonHeight = 18;
            this.okButton = document.createElement("div");
            this.okButton.style.borderRadius = "7px";
            this.okButton.style.backgroundColor = "green";
            this.okButton.style.width = "40px";
            this.okButton.style.height = okButtonHeight + "px";
            this.okButton.style.display = "block";
            this.okButton.style.marginLeft = "auto";
            this.okButton.style.marginTop = bottomMenuHeight - okButtonHeight - 4 + "px";
            this.okButton.style.marginRight = "2px";
            this.okButton.style.cursor = "pointer";
            this.okButton.style.textAlign = "center";
            this.okButton.innerText = "OK";
            this.menuBottom.appendChild(this.okButton);
        }

        const context = this.canva.getContext("2d");
        if (context != null)
        {
            this.ctx = context;
            this.drawPalette();
        }
        else
        {
            throw new Error("canvas not found");
        }
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
        this.menuWindow.style.top = newY + "px";

        const pX = e.pageX;
        const cX = e.clientX;
        const dX = pX - cX;
        let newX = Math.max(Math.min(pX - this.width / 2, window.innerWidth + dX - this.width - 30), 10);
        this.X = newX
        this.menuWindow.style.left = newX + "px";
    }
    private moveMenuAroundRect(rect: Rect, positionY: PosY = "up", positionX: PosX = "left", strict = false)
    {
        if (typeof rect != "object") throw new Error(`rect parameter invalid. It must be object with parameters: x, y, width, height, where y is upper left corner. Your value: '${rect}'`);
        if (typeof rect.x != "number") throw new Error(`rect.x parameter invalid. It must be number. Your value: '${rect.x}'`);
        if (typeof rect.y != "number") throw new Error(`rect.y parameter invalid. It must be number that mean upper left corner of rect. Your value: '${rect.y}'`);
        if (typeof rect.width != "number") throw new Error(`rect.width parameter invalid. It must be number. Your value: '${rect.width}'`);
        if (typeof rect.height != "number") throw new Error(`rect.height parameter invalid. It must be number. Your value: '${rect.height}'`);
        switch (positionY)
        {
            case "up":
                {
                    let newY = rect.y - this.height;
                    if (!strict && newY < 0)
                    {
                        newY = rect.y + rect.height;
                    }
                    this.Y = newY
                    this.menuWindow.style.top = newY + "px";
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
                    this.menuWindow.style.top = newY + "px";
                }
                break;

            default:
                throw new Error(`positionY parameter invalid. It can be: 'up' or 'down'. Your value: '${positionY}'`);
        }
        switch (positionX)
        {
            case "left":
                {
                    let newX = rect.x;
                    if (!strict && newX > document.body.offsetWidth - this.width)
                    {
                        newX = rect.x + rect.width - this.width;
                    }
                    this.X = newX
                    this.menuWindow.style.left = newX + "px";
                }
                break;

            case "center":
                {
                    let newX = rect.x + rect.width / 2 - this.width / 2;
                    if (!strict)
                    {
                        newX = Math.max(Math.min(newX, document.body.offsetWidth - this.width), 0);
                    }
                    this.X = newX
                    this.menuWindow.style.left = newX + "px";
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
                    this.menuWindow.style.left = newX + "px";
                }
                break;

            default:
                throw new Error(`positionX parameter invalid. It can be: 'left', 'center' or 'right'. Your value: '${positionX}'`);
        }
    }


    private drawPalette()
    {
        const segWidth = 2;
        const multiplyX = this.canva.width / 100 / segWidth;
        const multiplyX_ = this.canva.width / 50 / segWidth;
        const multiplyY = this.canva.height / 50 / segWidth;
        for (let y = 0; y < this.canva.height / segWidth; y++)
        {
            for (let x = 0; x < this.canva.width / segWidth; x++)
            {
                const l = ((100 - x / multiplyX_) / 50) * (50 - y / multiplyY);
                this.ctx.fillStyle = `hsl(${this.colorH}, ${x / multiplyX}%, ${l}%)`;
                this.ctx.fillRect(segWidth * x, segWidth * y, segWidth, segWidth);
            }
        }
    }
    private getColor()
    {
        return `hsl(${this.colorH}, ${this.colorS}%, ${this.colorL}%)`;
    }


    private openMenu()
    {
        if (!this.isOpen)
        {
            this.isOpen = true;
            document.body.appendChild(this.menuWindow);
            this.firstClick = true;
            document.addEventListener("click", this.clickHandler);
            this.closeButton.addEventListener("click", this.closeHandler);
            window.addEventListener("resize", this.closeHandler);
        }
    }
    private closeMenu()
    {
        if (this.isOpen)
        {
            this.isOpen = false;
            this.menuWindow.parentElement?.removeChild(this.menuWindow);
            document.removeEventListener("click", this.clickHandler);
            this.closeButton.removeEventListener("click", this.closeHandler);
            window.removeEventListener("resize", this.closeHandler);
        }
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