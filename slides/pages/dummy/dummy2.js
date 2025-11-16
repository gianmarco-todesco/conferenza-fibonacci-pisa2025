import {Slide, two, center} from '../../libs/gmtlib.js';   

class Dummy2Slide extends Slide {
    constructor() {
        super("Dummy2");
    }       
    initialize() {
    }
    start() {
        let text = two.makeText('This is a dummy slide', center.x, center.y, {
            size: 40,
            family: 'Arial',
            fill: '#000'
        });
        two.update();
        this.text = text;
    }           
    async end() {
        console.log("Dummy2Slide ended");
        let text = this.text;
        this.text = null;
        gsap.to(text, {
            duration:2, opacity: 0, 
            onUpdate() {two.update();}, 
            onComplete() {
                text.remove();
            }
        });
    }
}

let dummy2Slide = new Dummy2Slide();

