import {Slide, two, center} from '../../libs/gmtlib.js';   

class TitleSlide extends Slide {
    constructor() {
        super("Title");
    }   
    initialize() {
    }
    start() {
        let title = two.makeText('Fibonacci: numeri fantastici e dove trovarli', 
            center.x, center.y, {
                size: 40,
                family: 'Arial',
                fill: 'yellow',
                weight: 'bold'
        });


    }
    cleanup() {
        document.body.removeChild(this.div);
        this.div = null;
        this.text.remove();
        this.text = null;
    }
    async end() {

        let tl = gsap.timeline();
        this.div.style.opacity = 1;
        tl.to(this.text, {duration :1, opacity: 0}, 0);
        tl.to(this.div.style, {duration :1, opacity: 0}, 0);
        
        let promise = new Promise((resolve) => {
            tl.eventCallback("onComplete", resolve);
        });
        await promise;
    }
}

let t = new TitleSlide();

