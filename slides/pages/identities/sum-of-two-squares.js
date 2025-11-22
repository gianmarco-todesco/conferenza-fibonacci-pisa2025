import {Slide, two, center} from '../../libs/gmtlib.js';   


class TextLine {
    constructor(texts, style) {
        this.group = two.makeGroup();
        this.texts = texts.map(t => two.makeText(t, 0, 0, style));
        this.texts.forEach(t => this.group.add(t));        
    }
    update() {
        two.update();
        let x = 0;
        this.texts.forEach((item)=>{
            let cr = item.getBoundingClientRect();
            item.position.x = x + cr.width/2;
            x += cr.width + 20;
        });
    }
}

class TwoSquaresSumSlide extends Slide {
    constructor() {
        super("TwoSquaresSum");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup = two.makeGroup();
        mainGroup.position.set(center.x, center.y); 

        let line = two.makeGroup();
        mainGroup.add(line);

        const textSytle = {
            size: 40,
            family: 'Arial',
            fill: 'white',
            weight: 550
        };
        let fibs = [1,1];
        for(let i=0; i<11; i++) fibs.push(fibs[i]+fibs[i+1]);
        let textLines = [];
        let fibTextLine = new TextLine(fibs.map(i => `${i}`), textSytle);
        textLines.push(fibTextLine);
        mainGroup.add(fibTextLine.group);
        fibTextLine.group.position.set(-300,-100);
        
        for(let i=3; i<10; i++) {
            let a = fibs[i], b = fibs[i+1];
            let a2 = a*a, b2 = b*b;
            let s = a2 + b2;    
            let ts = [`${fibs[i]}²`, '+', `${fibs[i+1]}²`, 
                '=', `${a2}`, '+', `${b2}`, 
                "=", `${s}`]
            let sumTextLine = new TextLine(ts, textSytle);
            textLines.push(sumTextLine);
            mainGroup.add(sumTextLine.group);
            sumTextLine.group.position.set(fibTextLine.group.position.x, (i-2)*60);
        }
        two.update(); // per ottenere le dimensioni
        textLines.forEach(tl => tl.update());

    }
    cleanup() {
        this.mainGroup.remove();
    }
    async end() {
 
    }
}

let t = new TwoSquaresSumSlide();

