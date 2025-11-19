import {Slide, two, center} from '../../libs/gmtlib.js';   

class SumOfSquares extends Slide {
    constructor() {
        super("SumOfSquares");
    }   
    initialize() {
    }
    start() {

        let tl = this.tl = gsap.timeline();

        let textSytle = {
            size: 35,
            family: 'Arial',
            fill: 'white',
            weight: 550
        };
        let lines = [];
        let line = [];
        let fibs = [];
        let a=1,b=1;
        for(let i=0;i<10;i++) {
            let txt = two.makeText(`${a}`, 50+i*60, 50, textSytle);
            txt.opacity = 0; tl.to(txt, {duration:0.5, opacity:1}, i*0.5);
            fibs.push(a);
            line.push(txt);
            [a,b]=[b,a+b]
        }
        lines.push(line);
        for(let i= 1; i<10; i++) {
            let line = [];
            let x = 50;
            let y = 100 + i * 40;
            let t = 0; 
            for(let j=0; j<i; j++) {
                let txt = two.makeText(`${fibs[j]}²`, x, y, textSytle); x+=60;
                line.push(txt);
                txt = two.makeText(j+1<i ? '+' : '=', x, y, textSytle); x+=40;
                line.push(txt);                
                t += fibs[j]**2;
            }
            let txt = two.makeText(`${t}`, x, y, textSytle);
        }

    }
    async end() {
    }
}

let t = new SumOfSquares();

