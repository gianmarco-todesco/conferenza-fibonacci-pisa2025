import {Slide, two, center} from '../../libs/gmtlib.js';   

class TitleSlide extends Slide {
    constructor() {
        super("Title");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup = two.makeGroup();
        mainGroup.position.set(center.x, center.y); 

        let title = this.title = two.makeText('Fibonacci: numeri fantastici e dove trovarli', 
            0,0, {
                size: 40,
                family: 'Arial',
                fill: 'yellow',
                weight: 'bold'
        });
        mainGroup.add(title);

    }
    cleanup() {
        this.mainGroup.remove();
    }
    async end() {

        let tl = gsap.timeline();
        tl.to(this.title, {duration :1, opacity: 0}, 0);
        
        return tl;
    }
}

let t = new TitleSlide();

