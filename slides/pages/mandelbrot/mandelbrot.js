import {Slide, two, center} from '../../libs/gmtlib.js';   

class MandelbrotSlide extends Slide {
    constructor() {
        super("Mandelbrot");
    }   
    initialize() {
    }
    start() {
        let iframe = this.iframe = document.createElement('iframe');
        iframe.src = 'https://jmaio.github.io/mandelbrot-maps/#/m@0.2361652,0.5633767,4,0.2/j@0.4364131,-0.6468786,4,2.12';
        document.body.appendChild(iframe);
        iframe.style.position = 'absolute';
        iframe.style.top = '5%';
        iframe.style.left = '5%';
        iframe.style.width = '90%';
        iframe.style.height = '90%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '10px';

    }
    cleanup() {
        this.iframe.remove();
    }
    async end() {

    }
}

let t = new MandelbrotSlide();

