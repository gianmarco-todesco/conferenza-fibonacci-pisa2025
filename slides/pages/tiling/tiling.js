import {Slide, two, center} from '../../libs/gmtlib.js';   


function createBoard(cellSize, colsCount, withBG=true) {  
    // Parametri configurabili
    const unit = cellSize/40.0;
    const borderRadius = 8*unit;   // angoli arrotondati del bordo
    const borderWidth = 4*unit;     // spessore del bordo
    const bgColor = 'rgba(240,240,240,1)';      // sfondo opaco
    const gridColor = 'rgba(200, 200, 200)';       // colore griglia molto sottile
    const gridLineWidth = 0.8*unit;

    // dimensioni totali del rettangolo
    const width = colsCount * cellSize;
    const height = cellSize;

    // crea un gruppo unico che conterrà tutto (sfondo, griglia, bordo)
    const board = two.makeGroup();
    board.userData = {};
    board.userData.cellSize = cellSize;
    board.userData.colsCount = colsCount;   
    board.userData.tiles = []

    const top =   -height / 2;
    const bottom =  height / 2 ;

    if(withBG) {
        // sfondo arrotondato (disegnato prima)
        const background = two.makeRoundedRectangle(0, 0, width, height, borderRadius);
        background.fill = bgColor;
        background.stroke = 'transparent';
        background.linewidth = 0;
        board.add(background);

        // linee verticali (escludiamo gli estremi così la griglia non copre il bordo)
        for (let c = 1; c < colsCount; c++) {
            const x = -width / 2 + c * cellSize;
            const vLine = two.makeLine(x, top, x, bottom);
            vLine.stroke = gridColor;
            vLine.linewidth = gridLineWidth;
            board.add(vLine);
        }
    }

    // bordo (disegnato per ultimo così sta sopra la griglia)
    const border = two.makeRoundedRectangle(
        0, 0, width+1, height+1, borderRadius);
    border.fill = 'none';
    border.stroke = '#333';
    border.linewidth = borderWidth;
    board.add(border);

    // restituisci l'oggetto unico
    return board;
}

function createTile(cellSize, colsCount) {
    // Parametri configurabili
    const unit = cellSize/40.0;
    const borderRadius = 6 * unit;   // angoli arrotondati del bordo
    const borderWidth = 2 * unit;     // spessore del bordo
    const bgColor = colsCount==1 ? 'rgb(42, 152, 221)' : 'rgb(200, 215, 35)';      // sfondo opaco
    const gridColor = 'rgb(50, 87, 100)';       // colore griglia molto sottile
    const borderColor = 'rgb(0,100,0)';  
    const gridLineWidth = 0.8;

    // dimensioni totali del rettangolo
    const width = colsCount * cellSize;
    const height = cellSize;

    // sfondo arrotondato (disegnato prima)
    const tile = two.makeRoundedRectangle(
        0, 0, width-borderWidth, height-borderWidth, borderRadius);
    tile.fill = bgColor;
    tile.stroke = borderColor;
    tile.linewidth = borderWidth;
    
    return tile;
}

function getTilePosition(cellSize, boardColsCount, tileColsCount, index) {
   return cellSize * (-boardColsCount + tileColsCount) / 2 + index * cellSize;
}

function createFilledBoard(cellSize, colsCount, pattern) {
    const board = createBoard(cellSize, colsCount, false);
    let x = -cellSize * colsCount / 2 + cellSize / 2;
    for(let c of pattern) {
        if(c=="1") {
            let tile = createTile(cellSize, 1);
            board.add(tile);
            tile.position.x = x;
            x += cellSize;
        } else if(c=="2") {
            let tile = createTile(cellSize, 2);
            board.add(tile);
            tile.position.x = x + cellSize/2;
            x += 2 * cellSize;
        }
    }
    return board;
}

function getAllConfigurations(n) {
    if(n<2) {
        return [[""],["1"],["2"]][n];  
    } else {
        let lst1 = getAllConfigurations(n-1).map(x=>"1"+x);
        let lst2 = getAllConfigurations(n-2).map(x=>"2"+x);
        return lst1.concat(lst2);
    }
}
window.getAllConfigurations = getAllConfigurations;


class TilingSlide extends Slide {
    constructor() {
        super("Tiling");
        
    }   
    initialize() {
    }
    start() {

        this.mainBoard = createBoard(50, 8, true);
        this.mainBoard.position.set(center.x, 100);
        this.mainBoardTiles = [];
        let tile1 = this.tile1Pool = createTile(50, 1);
        tile1.position.set(50, two.height - 50);
        
        let tile2 = this.tile2Pool = createTile(50, 2);
        tile2.position.set(150, two.height - 50);

        /*
        let cellSize = 20;
        const textStyle = { 
            size: 40,
            family: 'Arial',
            fill: 'white'
        };
        let y = 250;
        for(let n = 1; n <= 6; n++) {
            let configs = getAllConfigurations(n);
            let x = 30;
            let txt = two.makeText(`${n}`, x, y,textStyle);
            x += 50;
            for(let i=0;i<configs.length;i++) {
                let b = createFilledBoard(cellSize, n, configs[i]);
                b.rotation = Math.PI/2;
                b.position.set(x + i * (cellSize + 10), y);
            }
            y += cellSize * n + 20;
        }
        // two.update();
        */
        this.uffa = [];
        this.count = 0;
        this.act = 0;
    }
    async end() {
    }
    cleanup() {
        this.mainBoard.remove();
        this.tile1Pool.remove();
        this.tile2Pool.remove();
        this.uffa.forEach(e => e.remove());
        this.uffa = []; 
        this.mainBoard = null;
        this.tile1Pool = null;
        this.tile2Pool = null;          
    }

    nextAct() {
        if(this.act < 4) {
            let patterns = ["11111111", "2222", "111212", "211121"];
            this.fillMain(this.mainBoard, patterns[this.act]);
            this.act++;
        } else {
            this.act2();
        }
    }

    act2() {
        if( this.mainBoard.visible) {
            this.mainBoard.visible = false;
            return;
        }
        if(this.count==0) this.count = 1;
        let n = this.count;
        let x = 100 + (n-1) * 50 + n*(n+1)/2 * 30;

        this.foobar(this.count, x, 100);
        this.count++;
    }

    foobar(n, x0, y0) {
        let cellSize = 30;
        let configs = getAllConfigurations(n);
        let tl = gsap.timeline();
        let y = y0;
        for(let i=0;i<configs.length;i++) {
            let b = createBoard(cellSize, n);
            this.uffa.push(b);
            b.position.set(x0, y);
            b.opacity = 0;
            tl.to(b, {duration:0.1, opacity:1});
            tl.add(this.fillMain(b, configs[i]));
            y += 35;
        }
        let txt = two.makeText(`${configs.length}`,
            x0, y0 - 50,{size:50, fill:'white', weight:'bold'});
        txt.opacity = 0;
        tl.to(txt, {duration:0.5, opacity:1});
        this.uffa.push(txt);
    }

  
    fillMain(board, pattern) {
        let tl = gsap.timeline();
        board.userData.tiles.forEach(t => t.remove());
        board.userData.tiles = [];
        const cellSize = board.userData.cellSize;
        let k = 0;
        for(let i=0; i<pattern.length; i++) {
            let c = pattern[i];
            let tileColsCount = c=="1" ? 1 : 2;
            let tile = createTile(cellSize, tileColsCount);
            board.add(tile);
            board.userData.tiles.push(tile);
            let grp = c=="1" ? this.tile1Pool : this.tile2Pool;
            tile.position.x = grp.position.x - board.position.x;
            tile.position.y = grp.position.y - board.position.y;
            let x = getTilePosition(cellSize, board.userData.colsCount, tileColsCount, k);
            tl.to(tile.position, {
                duration: 0.5,
                delay: i * 0.125,
                x: x, y: 0
            }, 0);
            k += tileColsCount;
        } 
        return tl;
    }
}

let t = new TilingSlide();

