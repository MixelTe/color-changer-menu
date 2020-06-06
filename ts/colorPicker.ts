type PosY = "up" | "down";
type PosX = "left" | "center" | "right";

type EventNames = "colorPicker-input" | "colorPicker-changed" | "colorPicker-canceled" | "colorPicker-confirmed" | "colorPicker-opened" | "colorPicker-closed" | "colorPicker-reopened";

class ColorPicker
{

    private menuWindow: HTMLDivElement;

    private menuTop: HTMLDivElement;

    private menu: HTMLDivElement;
    private canva: HTMLCanvasElement;
    private cursor: HTMLCanvasElement;
    private curColorDiv: HTMLDivElement;
    private rangeInputH: HTMLInputElement;
    private inputH: HTMLInputElement;
    private inputL: HTMLInputElement;
    private inputS: HTMLInputElement;

    private menuBottom: HTMLDivElement;
    private closeButton: HTMLDivElement;
    private okButton: HTMLDivElement;

    private multiplyX: number;
    private multiplyX_: number;
    private multiplyY: number;


    private height = 230;
    private width = 190;
    private X = 0;
    private Y = 0;
    private clickHandler = this.isInFocus.bind(this);
    private closeHandler = this.closeMenu.bind(this);
    private buttonCancelHandler = this.buttonsClick.bind(this, "cancel");
    private buttonOkHandler = this.buttonsClick.bind(this, "ok");
    private colorHRHandler = this.inputs.bind(this, "colorHRange");
    private colorHIHandler = this.inputs.bind(this, "colorH");
    private colorSHandler = this.inputs.bind(this, "colorS");
    private colorLHandler = this.inputs.bind(this, "colorL");
    private colorChangedHandler = this.inputs.bind(this, "changed");
    private canvaUpHandler = this.canvaMouse.bind(this, "up");
    private canvaMoveHandler = this.canvaMouse.bind(this, "move");
    private canvaDownHandler = this.canvaMouse.bind(this, "down");
    private ctx: CanvasRenderingContext2D;
    private ctxCursor: CanvasRenderingContext2D;
    private cursorX = 0;
    private cursorY = 0;
    private firstClick = false;
    private isOpen = false;
    private colorIsChanging = false;
    private rounded = true;
    private changeBackground = false;
    private changeBorder = false;
    private segWidth = 3;
    private colorH = 0;
    private colorS = 100;
    private colorL = 50;

    private placement_positionY: PosY = "up";
    private placement_positionX: PosX = "left";
    private placement_strict = false;

    private eventsMap = new Map();


    constructor()
    {
        const topMenuHeight = 4;
        const bottomMenuHeight = 22;

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

        }

        {
            const canvaWidth = 184;
            const canvaHeight = 120;
            // const canvaWidth = 760;
            // const canvaHeight = 700;
            this.menu = document.createElement("div");
            // this.menu.style.backgroundColor = "lightgray";
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

            this.cursor = document.createElement("canvas");
            this.cursor.style.border = "2px solid transparent";
            this.cursor.style.boxSizing = "border-box";
            this.cursor.style.borderRadius = "5px 5px 0px 0px";
            this.cursor.style.width = canvaWidth + "px";
            this.cursor.style.height = canvaHeight + "px";
            this.cursor.width = canvaWidth;
            this.cursor.height = canvaHeight;
            this.cursor.style.display = "block";
            this.cursor.style.position = "absolute";
            this.cursor.style.top = topMenuHeight + "px";
            this.cursor.style.left = "3px";
            this.menu.appendChild(this.cursor);

            this.curColorDiv = document.createElement("div");
            this.curColorDiv.style.backgroundColor = this.getHSLColor();
            // this.curColorDiv.style.backgroundColor = "lightblue";
            this.curColorDiv.style.borderRadius = "0 0 5px 5px";
            this.curColorDiv.style.width = canvaWidth + "px";
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
                const inputWidth = 25;
                const inputHeight = 16;

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
                textH.style.userSelect = "none";
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
                textS.style.userSelect = "none";
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
                textL.style.userSelect = "none";
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

            const buttonDIV = document.createElement("div");
            // this.menuTop.style.backgroundColor = "darkgray";
            buttonDIV.style.width = "80px";
            buttonDIV.style.height = bottomMenuHeight + "px";
            buttonDIV.style.display = "block";
            buttonDIV.style.marginLeft = this.width - 80 + 8 + "px";
            this.menuBottom.appendChild(buttonDIV);


            const okButtonHeight = 17;
            let backgrounCloseButton = this.drawCloseButton();

            this.closeButton = document.createElement("div");
            this.closeButton.style.borderRadius = "7px 0px 0px 7px";
            this.closeButton.style.backgroundColor = "red";
            this.closeButton.style.backgroundImage = backgrounCloseButton;
            this.closeButton.style.border = "1px solid black";
            this.closeButton.style.borderRightWidth = "0px";
            this.closeButton.style.width = "18px";
            this.closeButton.style.height = okButtonHeight + "px";
            this.closeButton.style.display = "table-cell";
            this.closeButton.style.cursor = "pointer";
            buttonDIV.appendChild(this.closeButton);

            this.okButton = document.createElement("div");
            this.okButton.style.borderRadius = "0px 7px 7px 0px";
            this.okButton.style.backgroundColor = "green";
            this.okButton.style.color = "black";
            this.okButton.style.border = "1px solid black";
            this.okButton.style.borderLeftWidth = "0px";
            this.okButton.style.width = "42px";
            this.okButton.style.height = okButtonHeight + "px";
            this.okButton.style.display = "table-cell";
            this.okButton.style.cursor = "pointer";
            this.okButton.style.textAlign = "left";
            this.okButton.style.paddingLeft = "8px";
            this.okButton.style.marginTop = "8px";
            this.okButton.innerText = "OK";
            buttonDIV.appendChild(this.okButton);
        }

        this.multiplyX = this.canva.width / 100 / this.segWidth;
        this.multiplyX_ = this.canva.width / 50 / this.segWidth;
        this.multiplyY = this.canva.height / 50 / this.segWidth;

        const context2 = this.cursor.getContext("2d");
        if (context2 != null)
        {
            this.ctxCursor = context2;
        }
        else
        {
            throw new Error("canvas2 not found");
        }
        const context = this.canva.getContext("2d");
        if (context != null)
        {
            this.ctx = context;
            this.drawPalette();
            this.calculateNewCurCords();
            this.drawCursor();
        }
        else
        {
            throw new Error("canvas not found");
        }
        this.rangeInputH.value = `${this.colorH}`;
        this.inputH.value = `${this.colorH}`;
        this.inputS.value = `${this.colorS}`;
        this.inputL.value = `${this.colorL}`;

        this.eventsMap.set("colorPicker-input", []);
        this.eventsMap.set("colorPicker-changed", []);
        this.eventsMap.set("colorPicker-canceled", []);
        this.eventsMap.set("colorPicker-confirmed", []);
        this.eventsMap.set("colorPicker-opened", []);
        this.eventsMap.set("colorPicker-reopened", []);
        this.eventsMap.set("colorPicker-closed", []);
    }
    public openMenu_OnCursor(e: MouseEvent)
    {
        this.moveMenuToCursor(e);
        this.openMenu();
    }
    public openMenu_AroundRect(rect: Rect, positionY?: PosY, positionX?: PosX, strict?: boolean)
    {
        this.firstClick = true;
        this.moveMenuAroundRect(rect, positionY, positionX, strict);
        this.displayColor();
        this.openMenu();
    }
    public styleColors(element: "buttonOk" | "buttonCancel" | "window" | "inputs", type: "background" | "font", value?: string)
    {
        switch (element)
        {
            case "buttonOk":
                switch (type)
                {
                    case "font":
                        if (value != null) this.okButton.style.color = value
                        else return this.okButton.style.color;
                        break;
                    case "background":
                        if (value != null) this.okButton.style.backgroundColor = value
                        else return this.okButton.style.backgroundColor;
                        break;
                    default:
                        throw new Error(`second argument value unvalid. It can be: 'font' or 'background'. Your value: '${type}'`);
                }
                break;
            case "buttonCancel":
                switch (type)
                {
                    case "font":
                        if (value != null)
                        {
                            this.closeButton.style.color = value
                            this.closeButton.style.backgroundImage = this.drawCloseButton(this.closeButton.style.backgroundColor, this.closeButton.style.color);
                        }
                        else { return this.closeButton.style.color };
                        break;
                    case "background":
                        if (value != null)
                        {
                            this.closeButton.style.backgroundColor = value;
                            this.closeButton.style.backgroundImage = this.drawCloseButton(this.closeButton.style.backgroundColor, this.closeButton.style.color);
                        }
                        else { return this.closeButton.style.backgroundColor };
                        break;
                    default:
                        throw new Error(`second argument value unvalid. It can be: 'font' or 'background'. Your value: '${type}'`);
                }
                break;
            case "window":
                switch (type)
                {
                    case "font":
                        if (value != null) this.menuWindow.style.color = value
                        else return this.menuWindow.style.color;
                        break;
                    case "background":
                        if (value != null) this.menuWindow.style.backgroundColor = value
                        else return this.menuWindow.style.backgroundColor;
                        break;
                    default:
                        throw new Error(`second argument value unvalid. It can be: 'font' or 'background'. Your value: '${type}'`);
                }
                break;
            case "inputs":
                switch (type)
                {
                    case "font":
                        if (value != null)
                        {
                            this.inputH.style.color = value
                            this.inputL.style.color = value
                            this.inputS.style.color = value
                        }
                        else { return this.inputH.style.color; };
                        break;
                    case "background":
                        if (value != null)
                        {
                            this.inputH.style.backgroundColor = value
                            this.inputL.style.backgroundColor = value
                            this.inputS.style.backgroundColor = value
                        }
                        else { return this.inputH.style.backgroundColor; };
                        break;
                    default:
                        throw new Error(`second argument value unvalid. It can be: 'font' or 'background'. Your value: '${type}'`);
                }
                break;
            default:
                throw new Error(`first argument value unvalid. It can be: 'buttonOk', 'buttonCancel', 'window' or 'inputs'. Your value: '${element}'`);
        }
    }
    public styleWindow(option: "roundCorners" | "pickedColorBackground" | "pickedColorBorder", value?: boolean)
    {
        switch (option)
        {
            case "roundCorners":
                if (typeof value == "boolean")
                {
                    if (value)
                    {
                        this.menuWindow.style.borderRadius = "5%";
                        this.menu.style.borderRadius = "5%";
                        this.canva.style.borderRadius = "5px 5px 0px 0px";
                        this.cursor.style.borderRadius = "5px 5px 0px 0px";
                        this.curColorDiv.style.borderRadius = "0 0 5px 5px";
                        this.rangeInputH.style.borderRadius = "5px";
                        this.closeButton.style.borderRadius = "7px 0px 0px 7px";
                        this.okButton.style.borderRadius = "0px 7px 7px 0px";
                    }
                    else
                    {
                        this.menuWindow.style.borderRadius = "0";
                        this.menu.style.borderRadius = "0";
                        this.canva.style.borderRadius = "0";
                        this.cursor.style.borderRadius = "0";
                        this.curColorDiv.style.borderRadius = "0";
                        this.rangeInputH.style.borderRadius = "0";
                        this.closeButton.style.borderRadius = "0";
                        this.okButton.style.borderRadius = "0";
                    }
                } else { return this.rounded }
                break;
            case "pickedColorBackground":
                if (typeof value == "boolean") this.changeBackground = value;
                else { return this.changeBackground }
                break;
            case "pickedColorBorder":
                if (typeof value == "boolean") this.changeBorder = value;
                else { return this.changeBorder }
                break;
            default:
                throw new Error(`first argument value unvalid. It can be: 'roundCorners', 'pickedColorBackground' or 'pickedColorBorder'. Your value: '${option}'`);
        }
    }
    public setColorHSL(h: number, s: number, l: number)
    {
        this.colorH = Math.max(Math.min(h, 360), 0);
        this.colorS = Math.max(Math.min(s, 100), 0);
        this.colorL = Math.max(Math.min(l, 100), 0);
        this.rangeInputH.value = `${this.colorH}`
        this.inputH.value = `${this.colorH}`
        this.inputL.value = `${this.colorL}`
        this.inputS.value = `${this.colorS}`
        this.displayColor()
        this.calculateNewCurCords()
        this.drawPalette();
        this.drawCursor();
    }
    public setColorRGB(r: number, g: number, b: number)
    {
        const hsl = this.RGBToHSL(r, g, b);
        this.colorH = Math.max(Math.min(hsl[0], 360), 0);
        this.colorS = Math.max(Math.min(hsl[1], 100), 0);
        this.colorL = Math.max(Math.min(hsl[2], 100), 0);
        this.rangeInputH.value = `${this.colorH}`
        this.inputH.value = `${this.colorH}`
        this.inputL.value = `${this.colorL}`
        this.inputS.value = `${this.colorS}`
        this.displayColor()
        this.calculateNewCurCords()
        this.drawPalette();
        this.drawCursor();
    }
    public setPlacement(positionY: PosY, positionX?: PosX, strict?: boolean)
    {
        if (typeof positionY == "string")
        {
            switch (positionY)
            {
                case "up":
                case "down":
                    this.placement_positionY = positionY;
                    break;
                default: throw new Error(`positionY parameter invalid. It can be: 'up' or 'down'. Your value: '${positionY}'`);
            }
        }
        if (typeof positionX == "string")
        {
            switch (positionX)
            {
                case "left":
                case "center":
                case "right":
                    this.placement_positionX = positionX;
                    break;
                default: throw new Error(`positionX parameter invalid. It can be: 'left', 'center' or 'right'. Your value: '${positionX}'`);
            }
        }
        if (typeof strict == "boolean")
        {
            this.placement_strict = strict;
        }
    }
    public getColor()
    {
        const rgb = this.HSLToRGB(this.colorH, this.colorH, this.colorL);
        return {
            h: this.colorH,
            s: this.colorH,
            l: this.colorL,
            colorHSL: this.getHSLColor(),
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
            colorRBG: `rbg(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        }
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
    private moveMenuAroundRect(rect: Rect, positionY: PosY = this.placement_positionY, positionX: PosX = this.placement_positionX, strict = this.placement_strict)
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
        for (let y = 0; y < this.canva.height / this.segWidth; y++)
        {
            for (let x = 0; x < this.canva.width / this.segWidth; x++)
            {
                const l = ((100 - x / this.multiplyX_) / 50) * (50 - y / this.multiplyY);
                this.ctx.fillStyle = `hsl(${this.colorH}, ${x / this.multiplyX}%, ${l}%)`;
                this.ctx.fillRect(this.segWidth * x, this.segWidth * y, this.segWidth, this.segWidth);
            }
        }
    }
    private getHSLColor()
    {
        return `hsl(${this.colorH}, ${this.colorS}%, ${this.colorL}%)`;
    }
    private drawCursor()
    {
        this.ctxCursor.clearRect(0, 0, this.cursor.width, this.cursor.height);
        this.ctxCursor.strokeStyle = `black`;
        this.ctxCursor.lineWidth = 3;
        this.ctxCursor.beginPath();
        this.ctxCursor.arc(this.cursorX + 1, this.cursorY + 1, 5, 1, 20);
        this.ctxCursor.stroke();

        this.ctxCursor.strokeStyle = `white`;
        this.ctxCursor.lineWidth = 1;
        this.ctxCursor.beginPath();
        this.ctxCursor.arc(this.cursorX + 1, this.cursorY + 1, 5, 1, 20);
        this.ctxCursor.stroke();
    }
    private changeHColor(rangeInput: boolean)
    {
        if (rangeInput)
        {
            const value = parseInt(this.rangeInputH.value);
            this.colorH = value;
            this.inputH.value = `${value}`;
            this.drawPalette();
        }
        else
        {
            let value: number | string = parseInt(this.inputH.value);
            if (value - value == 0 && 0 <= value && value <= 360)
            {
                this.colorH = value;
                this.rangeInputH.value = `${value}`;
                this.drawPalette();
            }
            let valuestr = this.inputL.value;
            if (valuestr.length > 3)
            {
                this.inputH.value = valuestr.slice(0, 3);
            }
        }
        this.displayColor();
    }
    private changeSColor()
    {
        let value: number | string = parseInt(this.inputS.value);
        if (value - value == 0 && 0 <= value && value <= 100)
        {
            this.colorS = value;
            this.calculateNewCurCords();
            this.drawCursor();
        }
        let valuestr = this.inputL.value;
        if (valuestr.length > 3)
        {
            this.inputS.value = valuestr.slice(0, 3);
        }
        this.displayColor();
    }
    private changeLColor()
    {
        let value = parseInt(this.inputL.value);
        if (value - value == 0 && 0 <= value && value <= 100)
        {
            this.colorL = value;
            this.calculateNewCurCords();
            this.drawCursor();
        }
        let valuestr = this.inputL.value;
        if (valuestr.length > 3)
        {
            this.inputL.value = valuestr.slice(0, 3);
        }
        this.displayColor();
    }
    private displayColor()
    {
        this.curColorDiv.style.backgroundColor = this.getHSLColor();
        if (this.changeBackground) this.menuWindow.style.backgroundColor = this.getHSLColor();
        if (this.changeBorder) this.menuWindow.style.borderColor = this.getHSLColor();
    }
    private calculateNewCurCords()
    {
        let x = this.colorS * this.multiplyX;
        let y = -(50 * this.multiplyY * (this.multiplyX_ * (-100 + this.colorL) + x)) / (100 * this.multiplyX_ - x);
        if (y < 0)
        {
            x = x + y / this.multiplyX;
            y = 0;
        }
        x *= this.segWidth;
        y *= this.segWidth;

        x = Math.min(Math.max(x, 2), this.canva.width - 2)
        y = Math.min(Math.max(y, 2), this.canva.height - 2)
        this.cursorX = x;
        this.cursorY = y;
        // console.log(x, y);
    }
    private canvaClick(e: MouseEvent)
    {
        let x = Math.abs(e.offsetX);
        let y = Math.abs(e.offsetY);
        this.cursorX = x;
        this.cursorY = y;
        this.drawCursor();

        x = Math.floor(x / this.segWidth);
        y = Math.floor(y / this.segWidth);

        let s = x / this.multiplyX;
        let l = ((100 - x / this.multiplyX_) / 50) * (50 - y / this.multiplyY);
        s = Math.round(s);
        l = Math.round(l);
        this.colorS = s;
        this.colorL = l;
        this.inputS.value = `${s}`;
        this.inputL.value = `${l}`;
        this.displayColor();
    }


    private canvaMouse(state: "up" | "down" | "move", e: MouseEvent)
    {
        switch (state)
        {
            case "down":
                this.colorIsChanging = true;
                this.canvaClick(e);
                this.fireEvent("colorPicker-changed");
                // console.log(`color changed: h:${this.colorH} s:${this.colorS} l:${this.colorL}`);
                break;
            case "move":
                if (this.colorIsChanging)
                {
                    this.canvaClick(e);
                    this.fireEvent("colorPicker-input");
                    // console.log(`color input: h:${this.colorH} s:${this.colorS} l:${this.colorL}`);
                }
                break;
            case "up":
                if (this.colorIsChanging)
                {
                    this.fireEvent("colorPicker-changed");
                    // console.log(`color changed: h:${this.colorH} s:${this.colorS} l:${this.colorL}`);
                }
                this.colorIsChanging = false;
                break;
        }
    }
    private buttonsClick(button: "cancel" | "ok")
    {
        switch (button)
        {
            case "cancel":
                this.fireEvent("colorPicker-canceled");
                // console.log("user press cancel button");
                break;
            case "ok":
                this.fireEvent("colorPicker-confirmed");
                // console.log("user press ok button");
                break;
            default:
                break;
        }
        this.closeMenu();
    }
    private inputs(input: "colorH" | "colorS" | "colorL" | "colorHRange" | "changed")
    {
        switch (input)
        {
            case "colorHRange":
                this.changeHColor(true);
                break;
            case "colorH":
                this.changeHColor(false);
                break;
            case "colorS":
                this.changeSColor();
                break;
            case "colorL":
                this.changeLColor();
                break;
            default:
                break;
        }
        if (input == "changed")
        {
            this.fireEvent("colorPicker-changed");
            // console.log(`color changed: h:${this.colorH} s:${this.colorS} l:${this.colorL}`)
        }
        else
        {
            this.fireEvent("colorPicker-input");
            // console.log(`color input: h:${this.colorH} s:${this.colorS} l:${this.colorL}`)
        }
    }

    private openMenu()
    {
        if (!this.isOpen)
        {
            this.isOpen = true;
            document.body.appendChild(this.menuWindow);
            this.firstClick = true;

            document.addEventListener("click", this.clickHandler);
            window.addEventListener("resize", this.closeHandler);

            this.closeButton.addEventListener("click", this.buttonCancelHandler);
            this.okButton.addEventListener("click", this.buttonOkHandler);

            this.rangeInputH.addEventListener("input", this.colorHRHandler);
            this.inputH.addEventListener("input", this.colorHIHandler);
            this.inputS.addEventListener("input", this.colorSHandler);
            this.inputL.addEventListener("input", this.colorLHandler);
            this.rangeInputH.addEventListener("change", this.colorChangedHandler);
            this.inputH.addEventListener("change", this.colorChangedHandler);
            this.inputS.addEventListener("change", this.colorChangedHandler);
            this.inputL.addEventListener("change", this.colorChangedHandler);

            this.cursor.addEventListener("mousedown", this.canvaDownHandler);
            this.cursor.addEventListener("mousemove", this.canvaMoveHandler);
            document.addEventListener("mouseup", this.canvaUpHandler);

            this.fireEvent("colorPicker-opened")
            // console.log("color picker open");
        }
        else
        {
            this.fireEvent("colorPicker-reopened")
        }
    }
    private closeMenu()
    {
        if (this.isOpen)
        {
            this.isOpen = false;
            this.menuWindow.parentElement?.removeChild(this.menuWindow);
            document.removeEventListener("click", this.clickHandler);
            this.closeButton.removeEventListener("click", this.buttonCancelHandler);
            this.okButton.removeEventListener("click", this.buttonOkHandler);
            window.removeEventListener("resize", this.closeHandler);
            this.rangeInputH.removeEventListener("input", this.colorHRHandler);
            this.inputH.removeEventListener("input", this.colorHIHandler);
            this.inputS.removeEventListener("input", this.colorSHandler);
            this.inputL.removeEventListener("input", this.colorLHandler);
            this.cursor.removeEventListener("mouseup", this.canvaUpHandler);
            this.cursor.removeEventListener("mousedown", this.canvaDownHandler);
            this.cursor.removeEventListener("mousemove", this.canvaMoveHandler);
            document.removeEventListener("mouseup", this.canvaUpHandler);

            this.fireEvent("colorPicker-closed")
            // console.log("color picker closed");
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
        return (
            x > this.X &&
            x < this.X + this.width &&
            y > this.Y &&
            y < this.Y + this.height
        );
    }


    public addEventListener(eventName: EventNames, f: (d:MyEvent) => void)
    {
        switch (eventName)
        {
            case "colorPicker-input":
            case "colorPicker-changed":
            case "colorPicker-canceled":
            case "colorPicker-confirmed":
            case "colorPicker-opened":
            case "colorPicker-reopened":
            case "colorPicker-closed":
                break;
            default: throw new Error(`Unexpected value: ${eventName}`);
        }
        let curentListenersFunctions = this.eventsMap.get(eventName);
        curentListenersFunctions[curentListenersFunctions.length] = f;
        this.eventsMap.set(eventName, curentListenersFunctions);
    }
    public removeEventListener(eventName: EventNames, f: (d:MyEvent) => void)
    {
        switch (eventName)
        {
            case "colorPicker-input":
            case "colorPicker-changed":
            case "colorPicker-canceled":
            case "colorPicker-confirmed":
            case "colorPicker-opened":
            case "colorPicker-reopened":
            case "colorPicker-closed":
                break;
            default: throw new Error(`Unexpected value: ${eventName}`);
        }
        let eventListenersFunctions = this.eventsMap.get(eventName);
        for (let i = 0; i < eventListenersFunctions.length; i++)
        {
            if (eventListenersFunctions[i] == f)
            {
                eventListenersFunctions.splice(i, 1);
                i = eventListenersFunctions.length + 1;
            }
        }
        this.eventsMap.set(eventName, eventListenersFunctions);
    }
    private fireEvent(eventName: EventNames)
    {
        const detail = this.createEventDetail(eventName);
        let curentListenersFunctions = this.eventsMap.get(eventName);
        curentListenersFunctions.forEach((el: (d:any) => void) => { el(detail); });
        // const e = new CustomEvent(eventName, { detail });
        // this.menuWindow.dispatchEvent(e);
    }
    private createEventDetail(eventName: EventNames)
    {
        switch (eventName)
        {
            case "colorPicker-input":
            case "colorPicker-changed":
            case "colorPicker-canceled":
            case "colorPicker-confirmed":
            case "colorPicker-closed":
                return this.getEventData(eventName);

            case "colorPicker-opened":
            case "colorPicker-reopened":
                return { x: this.X, y: this.Y, eventName };

            default: throw new Error(`Unexpected value: ${eventName}`);
        }
    }
    private fireEvent_(eventName: EventNames)
    {
        const detail = this.createEventDetail(eventName);
        const e = new CustomEvent(eventName, { detail });
        this.menuWindow.dispatchEvent(e);
    }

    private drawCloseButton(back?: string, front?: string)
    {
        {
            const canva = document.createElement("canvas");
            canva.width = 24;
            canva.height = 17;
            const ctx = canva.getContext("2d");
            if (ctx != null)
            {
                ctx.fillStyle = "red";
                if (back != null) ctx.fillStyle = back;
                ctx.fillRect(0, 0, canva.width, canva.height);
                ctx.fillStyle = "black";
                if (front != null) ctx.fillStyle = front;
                const a = 4;
                const shiftY = 1;
                const shiftX = 1;
                const width = 17;
                ctx.lineWidth = 2;
                ctx.beginPath;
                ctx.moveTo(a + shiftX, a + shiftY);
                ctx.lineTo(width - a + shiftX, width - a + shiftY);
                ctx.moveTo(width - a + shiftX, a + shiftY);
                ctx.lineTo(a + shiftX, width - a + shiftY);
                ctx.stroke();
            }
            return 'url(' + canva.toDataURL("image/png") + ')';
        }
    }
    private getEventData(eventName: EventNames)
    {
        const rgb = this.HSLToRGB(this.colorH, this.colorH, this.colorL);
        return {
            h: this.colorH,
            s: this.colorH,
            l: this.colorL,
            colorHSL: this.getHSLColor(),
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
            colorRBG: `rbg(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
            eventName
        };
    }
    private RGBToHSL(r: number, g: number, b: number)
    {
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;
        if (delta == 0)
            h = 0;
        else if (cmax == r) h = ((g - b) / delta) % 6;
        else if (cmax == g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return [h, s, l];
    }
    private HSLToRGB(h: number, s: number, l: number)
    {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return [r, g, b];
    }
}
interface Rect
{
    x: number;
    y: number;
    width: number;
    height: number;
}
interface MyEvent
{
    x?: number;
    y?: number;
    h?: number;
    s?: number;
    l?: number;
    colorHSL?: string;
    r?: number;
    g?: number;
    b?: number;
    colorRBG?: string;
    eventName: EventNames;
}