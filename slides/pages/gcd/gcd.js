import {Slide, two, center} from '../../libs/gmtlib.js';   

const margin = 20;


function gcd(a,b) {
    if(a<b) [a,b]=[b,a];
    while(b!=0) [a,b]=[b,a%b];
    return a;
}

    

class Board {
    constructor(cellSize, rowsCount, colsCount, bigGridSize = 0) {
        this.cellSize = cellSize;
        this.rowsCount = rowsCount;
        this.colsCount = colsCount;

        // Parametri configurabili
        const unit = cellSize/40.0;
        const borderRadius = 8*unit;   // angoli arrotondati del bordo
        const borderWidth = 4*unit;     // spessore del bordo
        const bgColor = 'rgba(240,240,240,1)';      // sfondo opaco
        const gridColor = 'rgba(200, 200, 200)';       // colore griglia molto sottile
        const gridLineWidth = 0.8*unit;

        // dimensioni totali del rettangolo
        const width = this.width = colsCount * cellSize;
        const height = this.height = rowsCount * cellSize;


        // crea un gruppo unico che conterrà tutto (sfondo, griglia, bordo)
        const board = this.group = two.makeGroup();

        // sfondo arrotondato (disegnato prima)
        const background = two.makeRoundedRectangle(0, 0, width, height, borderRadius);
        background.fill = bgColor;
        background.stroke = 'transparent';
        background.linewidth = 0;
        board.add(background);

        // calcola gli estremi interni dove disegnare la griglia (inset evita sovrapposizione con il bordo)
        const left = -width / 2;
        const right =  width / 2 ;
        const top =   -height / 2;
        const bottom =  height / 2 ;

        let verticalLines = this.verticalLines = [];
        let horizontalLines = this.horizontalLines = [];
        let bigGridLines = this.bigGridLines = [];
        let cutLines = this.cutLines = [];

        let g = bigGridSize;
        if(g == 0) g = gcd(rowsCount, colsCount);
        this.bigGridSize = g;

        // linee verticali (escludiamo gli estremi così la griglia non copre il bordo)
        for (let c = 1; c < colsCount; c++) {
            const x = -width / 2 + c * cellSize;
            const vLine = two.makeLine(x, top, x, bottom);
            vLine.stroke = gridColor;
            vLine.linewidth = gridLineWidth;
            board.add(vLine);
            verticalLines.push(vLine);
            if(c%g == 0) bigGridLines.push(vLine);
            if((colsCount-c)%rowsCount == 0) cutLines.push({
                x0:x,y0:top,x1:x,y1:bottom
            });
        }

        // linee orizzontali
        for (let r = 1; r < rowsCount; r++) {
            const yPos = -height / 2 + r * cellSize;
            const hLine = two.makeLine(left, yPos, right, yPos);
            hLine.stroke = gridColor;
            hLine.linewidth = gridLineWidth;
            board.add(hLine);
            horizontalLines.push(hLine);
            if(r%g == 0) bigGridLines.push(hLine);
            if((rowsCount-r)%colsCount == 0) cutLines.push({
                x0:left,y0:yPos,x1:right,y1:yPos
            });
        }
        cutLines.forEach(line => {
            const {x0, y0, x1, y1} = line;
            let element = line.element = two.makeLine(x0, y0, x1, y1);
            const length = line.length = Math.sqrt((x1-x0)**2 + (y1-y0)**2);
            element.stroke = '#333';
            element.linewidth = borderWidth;
            // element.visible = false;
            element.dashes = [0,length];
            board.add(element);
        });

        // bordo (disegnato per ultimo così sta sopra la griglia)
        const border = two.makeRoundedRectangle(
            0, 0, width+1, height+1, borderRadius);
        border.fill = 'none';
        border.stroke = '#333';
        border.linewidth = borderWidth;
        board.add(border);
        this._bigGridVisible = 0.0;
        this._cutLinesVisible = 0.0;

        this.bigGridColorInterpolator = gsap.utils.interpolate(
            [gridColor, 'red']);
        this.parent = null;
        this.children = this.makeChildren();
        this.children.forEach(child => child.group.visible = false);
    }

    set bigGridVisible(v) {
        if(this._bigGridVisible !== v) {
            this._bigGridVisible = v;
            let color = this.bigGridColorInterpolator(v);
            this.bigGridLines.forEach(line => line.stroke = color);
            this.children.forEach(child => child.bigGridVisible = v);
            two.update();
        }
    }

    get bigGridVisible() {
        return this._bigGridVisible;
    }

    set cutLinesVisible(v) {
        const cutLines = this.cutLines;
        if(this._cutLinesVisible != v && cutLines.length>0) {
            this._cutLinesVisible = v;
            if(v==0) {
                cutLines.forEach(line => line.element.visible = false);
            } else {
                cutLines.forEach(line => {
                    line.element.visible = true;
                    line.element.dashes[0] = line.length * v;
                });
            }
        }
        two.update();
    }

    get cutLinesVisible() {
        return this._cutLinesVisible;
    } 
    

    makeChildren() {
        let rowsCount = this.rowsCount, colsCount = this.colsCount;
        let boards = [];
        let g = this.bigGridSize;
        if(rowsCount < colsCount) {
            let rest = colsCount % rowsCount;
            for(let i=0; i<Math.ceil(colsCount/rowsCount); i++) {
                let childColsCount = i == 0 && rest>0 ? rest : rowsCount;
                let child = new Board(this.cellSize, rowsCount, childColsCount, g);
                boards.push(child);
            }
        } else if(rowsCount > colsCount) {
            let rest = rowsCount % colsCount;
            for(let i=0; i<Math.ceil(rowsCount/colsCount); i++) {
                let childRowsCount = i == 0 && rest>0 ? rest : colsCount;
                let child = new Board(this.cellSize, childRowsCount, colsCount, g);
                boards.push(child);
            }
        }
        return boards;
    }

    updateChildrenPosition() {
        let rowsCount = this.rowsCount, colsCount = this.colsCount;
        let x0 = this.group.position.x - this.width/2;
        let y0 = this.group.position.y - this.height/2;
        if(rowsCount < colsCount) {
            let childExtendedSize = this.children[0].getMarginSize();
            this.children.forEach((child,i) => {
                child.group.position.set(x0 + child.width/2, y0 + child.height/2);
                child.targetx = child.group.position.x + (i==0 ? 0 : childExtendedSize.x + margin * i);
                child.targety = child.group.position.y;
                child.updateChildrenPosition();
                x0 += child.width;
            });
        } else if(rowsCount > colsCount) {
            let childExtendedSize = this.children[0].getMarginSize();
            this.children.forEach((child,i) => {
                child.group.position.set(x0 + child.width/2, y0 + child.height/2);
                child.targetx = child.group.position.x;
                child.targety = child.group.position.y + (i==0 ? 0 : childExtendedSize.x + margin * i);
                child.updateChildrenPosition();
                y0 += child.height;
            });
        }
    }

    getMarginSize() {
        let rowsCount = this.rowsCount, colsCount = this.colsCount;
        if(rowsCount == colsCount) return {x:0, y:0};
        else {
            let extendedSize = this.children[0].getMarginSize();  
            if(rowsCount < colsCount) {
                extendedSize.x += (this.children.length-1) * margin;
            } else {
                extendedSize.y += (this.children.length-1) * margin;
            }   
            return extendedSize;
        }
    }


    _split() {
        let rowsCount = this.rowsCount, colsCount = this.colsCount;
        if(rowsCount == colsCount) return [];   
        this.children.forEach(child => child.group.visible = true);
        this.group.visible = false;
        two.update();    
    }

    split() {
        let me = this;
        var tl = gsap.timeline({onUpdate() {two.update();}});
        tl.to(this, {cutLinesVisible: 1, duration: 1, onComplete() {me._split();}});
        for(let i=this.children.length-1; i>0; i--) {
            let child = this.children[i];
            tl.to(child.group.position, {x: child.targetx, y: child.targety, duration: 1});
        }
    }

    dispose() {
        this.group.remove();
        this.group = null;
        this.children.forEach(child => child.dispose());
        this.children = []; 
    }
}




class GcdSlide extends Slide {
    constructor() {
        super("GCD");
    }   
    initialize() {
    }

    setBoard(cellSize, rows, cols) {
        if(this.board) {
            this.board.dispose();
            this.board = null;
        }
        let board = this.board = new Board(cellSize, rows, cols); 
        this.currentBoard = board;
        board.group.position.set(center.x, center.y);
        board.updateChildrenPosition();
    }
    start() {
        this.setBoard(20, 3*7, 3*12);
    }
    async end() {
    }

    cleanup() {
        if(this.board) {
            this.board.dispose();
            this.board = null;
        }
        this.currentBoard = null;
    }

    onKeyDown(event) {
        if(event.key === "1") {
            this.setBoard(20, 3*7, 3*12);
        } else if(event.key === "2") {
            this.setBoard(20, 21, 34);
        }
        else if(event.key === "s") {
            if(this.currentBoard) {
                this.currentBoard.split();
                this.currentBoard = this.currentBoard.children[0];
            }
        } else if(event.key === "r") {
            if(this.currentBoard)
                gsap.to(this.currentBoard, {bigGridVisible: 1, duration: 1} );
        }
    }
}

let t = new GcdSlide();

