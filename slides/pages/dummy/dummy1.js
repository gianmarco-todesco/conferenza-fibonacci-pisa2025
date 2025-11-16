import {Slide, two, center} from '../../libs/gmtlib.js';   

class Dummy1Slide extends Slide {
    constructor() {
        super("Dummy1");
    }   
    initialize() {
    }
    start() {
        let text = two.makeText('This is the first slide', center.x, center.y, {
            size: 40,
            family: 'Arial',
            fill: 'yellow'
        });
        two.update();
        this.text = text;

    }
    async end() {
        let text = this.text; this.text = null;
        await gsap.to(text, {
            duration:2, opacity: 0, 
            onUpdate() {two.update();}, 
            onComplete() {
                text.remove();
            }
        });
    }
}

let dummy1Slide = new Dummy1Slide();

