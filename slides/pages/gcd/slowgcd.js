import {Slide, two, center} from '../../libs/gmtlib.js';   


function gcd(a,b) {
    if(a<b) [a,b]=[b,a];
    while(b!=0) [a,b]=[b,a%b];
    return a;
}

class Line {
    constructor(a,b) {
        this.a = a;
        this.b = b;
        this.textSpans = [];
        this.countText = null;
        this.braket = null;
    }
}

class SlowGcd extends Slide {
    constructor() {
        super("SlowGcd");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup;
        let cells = this.cells = [];
        let cellSize = 25;
        let x0 = -400;
        let y0 = -500;
        let start = performance.now();
        for(let den = 2; den < 40; den ++) {
            for(let num = 1; num < den; num++) {
                let x = x0 + cellSize*(num-1);
                let y = y0 + cellSize*(den-2);
                let rect = two.makeRectangle(
                    x,y,cellSize, cellSize
                );
                rect.stroke = 'gray';
                rect.linewidth = 2;
                rect.fill = 'white';
                mainGroup.add(rect);
                //let numTxt = two.makeText(`${num}`, x, y - cellSize/4);
                //mainGroup.add(numTxt);
                //let denTxt = two.makeText(`${den}`, x, y + cellSize/4);
                //mainGroup.add(denTxt);
                cells.push(
                    {num,den,rect}
                );
            }
        }
        this.timeStep = 1;
        this.status = 0;
        this.cellIndex = 0;
        this.maxCount = 0;
        this.selectedCount = 0;
        console.log(performance.now()-start);
        y0 = -450;
        let y = y0;
        let sz = 90;
        this.addText(-100, y, "a=", sz);
        this.aTxt = this.addText(0, y, '', sz); 
        this.addText(200, y, "b=", sz);
        this.bTxt = this.addText(300,y, '', sz);
        y += sz;
        this.currentTxt = this.addText(-150,y, '', 60);
        this.currentTxt.alignment = 'left';
        y += 60;
        /*
        this.addText(600, y, "massimo numero di passi:", 60);
        this.maxCountTxt = this.addText(600,y+120,'',120);
        */
    }
    async end() {
    }

    update(time, deltaTime) {
        let incTime = this.timeStep;
        if(this.status > 0 && this.nextTime > time) return;
        if(this.cellIndex >= this.cells.length) return;
        if(this.status == 0) {
            this.nextTime = time+1;
            this.status = 1;
        } else if(this.status == 1) {
            let cell = this.cells[this.cellIndex];
            this.currentTxt.value = `${cell.num}/${cell.den}`;
            this.nextTime = time + incTime;
            this.status = 2;
            this.ab = [cell.num, cell.den];
            this.aTxt.value = cell.num;
            this.bTxt.value = cell.den;
            
            this.currentCount = 1;
        } else if(this.status == 2) {
            let cell = this.cells[this.cellIndex];
            let a=this.ab[0], b=this.ab[1];
            if(a==0) {
                this.currentTxt.value = "";
                let m = this.currentCount;
                this.setCell(cell, m);
                this.status = 1;
                this.cellIndex++;
                this.nextTime = time + incTime;
            
            } else {
                [a,b] = [b%a,a];
                this.currentCount ++;
                if(a>0)    
                    this.currentTxt.value += ` → ${a}/${b}`;
                else
                    this.currentTxt.value += ` → ${b}`;

                this.ab = [a,b];
                this.nextTime = time + incTime;
            
            }
        }
    }

    addText(x,y,text = '', size=60) {
        let txt = two.makeText(text, x,y, {
            size:size,
            align:'left',
            fill:'white'
        })
        this.mainGroup.add(txt);
        return txt;
    }

    setCell(cell, m) {
        // console.log(cell.num, cell.den, m);
        const c1 = 'rgba(0, 0, 255,1)';
        const c2 = 'rgba(0, 102, 255,1)';
        const c3 = 'rgba(0, 204, 255,1)';
        const c4 = 'rgba(0, 255, 153,1)';
        const c5 = 'rgba(102, 255, 0,1)';
        const c6 = 'rgba(255, 204, 0,1)';
        const c7 = 'rgba(255, 102, 0,1)';
        const c8 = 'rgba(255, 0, 0,1)';
        const colors = [c1,c2,c3,c4,c5,c6,c7,c8];

        let color = colors[Math.min(m-1, colors.length-1)]; // gsap.utils.interpolate(c1, c5, (m-1)/7);
        gsap.to(cell.rect, {fill: color});
        
        if(m <= this.maxCount) return;
        
        this.maxCount = m;
        // this.maxCountTxt.value = m.toString();
        // gsap.to(rect, {fill: colors[m]});
        let x = -900;
        let y = -300 + this.selectedCount * 120;
        this.selectedCount++;

        let txt = this.addText(x+50,y, 
            ` ${m-1} pass${m-1==1?'o':'i'} : (${cell.num}, ${cell.den})`)
        txt.alignment = 'left';
        txt.size = 40;
        txt.opacity = 0;

        let blackrect = two.makeRectangle(
                cell.rect.position.x,
                cell.rect.position.y,
                cell.rect.width,
                cell.rect.height            
        );
        this.mainGroup.add(blackrect);
        blackrect.fill = 'none';
        blackrect.stroke = 'black';
        blackrect.linewidth = 2;    
        

        let rect = two.makeRectangle(
                cell.rect.position.x,
                cell.rect.position.y,
                cell.rect.width,
                cell.rect.height            
        );
        this.mainGroup.add(rect);
        rect.fill = color;
        gsap.to(rect.position, {
            x:x,
            y:y,
            duration:1
        } );
        gsap.to(txt, {opacity:1, duration:0.5, delay:1});

    }

    cleanup() {

    }

    onKeyDown(event) {
        if(event.key == '+') {
            this.timeStep /= 10;
        } else if(event.key == '-') {
            this.timeStep *= 10;
        }
    }
}

let t = new SlowGcd();

