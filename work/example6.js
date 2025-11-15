let draw, image, base, symbol;

let rows = [];
let y = 10;
let two;


function createBoard(cellSize, colsCount) {  
    // Parametri configurabili
    const unit = cellSize/40.0;
    const rowsCount = 2;
    const borderRadius = 8*unit;   // angoli arrotondati del bordo
    const borderWidth = 4*unit;     // spessore del bordo
    const bgColor = 'rgba(240,240,240,1)';      // sfondo opaco
    const gridColor = 'rgba(200, 200, 200)';       // colore griglia molto sottile
    const gridLineWidth = 0.8*unit;

    // dimensioni totali del rettangolo
    const width = colsCount * cellSize;
    const height = rowsCount * cellSize;


    // crea un gruppo unico che conterrà tutto (sfondo, griglia, bordo)
    const board = two.makeGroup();


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

    // linee verticali (escludiamo gli estremi così la griglia non copre il bordo)
    for (let c = 1; c < colsCount; c++) {
        const x = -width / 2 + c * cellSize;
        const vLine = two.makeLine(x, top, x, bottom);
        vLine.stroke = gridColor;
        vLine.linewidth = gridLineWidth;
        board.add(vLine);
    }

    // linee orizzontali
    for (let r = 1; r < rowsCount; r++) {
        const yPos = -height / 2 + r * cellSize;
        const hLine = two.makeLine(left, yPos, right, yPos);
        hLine.stroke = gridColor;
        hLine.linewidth = gridLineWidth;
        board.add(hLine);
    }

    // bordo (disegnato per ultimo così sta sopra la griglia)
    const border = two.makeRoundedRectangle(
        0, 0, width+1, height+1, borderRadius);
    border.fill = 'none';
    border.stroke = '#333';
    border.linewidth = borderWidth;
    board.add(border);

    // salva il riferimento globale se vuoi manipolarlo altrove
    base = board;

    // restituisci l'oggetto unico
    return board;
}

function createDomino(cellSize) {
    // Parametri configurabili
    const unit = cellSize/40.0;
    const rowsCount = 2;
    const colsCount = 1;
    const borderRadius = 6 * unit;   // angoli arrotondati del bordo
    const borderWidth = 2 * unit;     // spessore del bordo
    const bgColor = 'rgb(39, 216, 72)';      // sfondo opaco
    const bgColor2 = 'rgb(138, 209, 151)';      // sfondo opaco
    const gridColor = 'rgb(50, 100, 50)';       // colore griglia molto sottile
    const borderColor = 'rgb(0,100,0)';  
    const gridLineWidth = 0.8;

    // dimensioni totali del rettangolo
    const width = colsCount * cellSize;
    const height = rowsCount * cellSize;

    // crea un gruppo unico che conterrà tutto (sfondo, griglia, bordo)
    const board = two.makeGroup();


    // sfondo arrotondato (disegnato prima)
    const background = two.makeRoundedRectangle(
        0, 0, width-borderWidth, height-borderWidth, borderRadius);
    background.fill = bgColor;
    background.stroke = 'transparent';
    background.linewidth = 0;
    board.add(background);

    // linea orizzontale
    const x0 = -width / 2 + borderWidth / 2;
    const x1 = width / 2 - borderWidth / 2;
    const hLine = two.makeLine(x0,0,x1,0);
    hLine.stroke = gridColor;
    hLine.linewidth = gridLineWidth;
    board.add(hLine);

    // bordo (disegnato per ultimo così sta sopra la griglia)
    const border = two.makeRoundedRectangle(
        0, 0, width-borderWidth-0.5, height-borderWidth-0.5, borderRadius);
    border.fill = 'none';
    border.stroke = borderColor;
    border.linewidth = borderWidth;
    board.add(border);
    let t = height*0.3;
    const border2 = two.makeRoundedRectangle(
        0, 0, width-t, height-t, borderRadius);
    border2.fill = bgColor2;
    border2.stroke = borderColor;
    border2.linewidth = borderWidth;
    board.add(border2);

    // salva il riferimento globale se vuoi manipolarlo altrove
    base = board;

    // restituisci l'oggetto unico
    return board;
}

class Board {
    constructor(cellSize, colsCount) {
        this.cellSize = cellSize;
        this.colsCount = colsCount;
        this.element = createBoard(cellSize, colsCount);
        this.dominos = [];
    }

    addDomino(x,y,rotation=0) {
        let cellSize = this.cellSize;
        let domino = createDomino(cellSize);
        this.element.add(domino);
        if(rotation % 2 == 0) {
            let x0 = - cellSize * this.colsCount / 2 + cellSize / 2;
            let y0 = 0;
            domino.translation.set(x0 + x*cellSize, y0 + y*cellSize);
        } else {
            let x0 = - cellSize * this.colsCount / 2 + cellSize;
            let y0 = -cellSize/2;
            domino.translation.set(x0 + x*cellSize , y0 + y*cellSize);
            domino.rotation = Math.PI / 2;
        }
        this.dominos.push(domino);
        two.update();
        return domino;
    }

    setConfiguration(s) {
        this.dominos.forEach(d => d.remove());
        this.dominos = [];
        let x = 0;
        for(let i=0; i<s.length; i++) {
            if(s[i] === 'H') {
                this.addDomino(x,0,1);
                this.addDomino(x,1,1);
                x+=2;
            }
            else if(s[i] === 'V') {
                this.addDomino(x,0,0);
                x += 1;
            }
        }
    }
}

function getAllConfigurations(n) {
    if(n==1) return ["V"];
    else if(n==2) return ["H"];
    else {
        let a = getAllConfigurations(n-1);
        let b = getAllConfigurations(n-2);
        return a.map(s => s + "V").concat(b.map(s => s + "H"));
    }
}

function addAllBoards(n, cellSize, startx, starty) {
    let boards = [];
    let configs = getAllConfigurations(n);
    let boardWidth = cellSize * n;
    let x0 = startx + boardWidth/2;
    for(let i=0; i<configs.length; i++) {
        let b = new Board(cellSize, n);
        b.setConfiguration(configs[i]);
        b.element.translation.set(x0 + i * (boardWidth + cellSize/2), starty);
        // two.add(b.element);
        boards.push(b);
    }
    two.update();
    return boards
}

let board;
let dd;

window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(TextPlugin);

    var params = {
        fullscreen: false
    };
    var container = document.getElementById('example6');
    const containerRect = container.getBoundingClientRect();
    
    two = new Two({
        width: containerRect.width,
        height: containerRect.height
    }).appendTo(container);

    board = new Board(40, 8);
    board.element.translation.set(two.width / 2, 100);

    const textStyles = {
        family: 'proxima-nova, sans-serif',
        size: 50,
        leading: 50,
        weight: 600
    };


    for(let i=1; i<=6; i++) {
        let y = i*50 + 50;
        let boards = addAllBoards(i, 15, 50, y);
        two.makeText(boards.length.toString(), 20, y + 4, textStyles);
    }


    // Don’t forget to tell two to draw everything to the screen
    two.update();
});


document.addEventListener("keydown", (event) => {
    if(event.key === "ArrowRight") {
    }
});