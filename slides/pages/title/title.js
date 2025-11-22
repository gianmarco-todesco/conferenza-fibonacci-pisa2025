import {Slide, two, center} from '../../libs/gmtlib.js';   

class TitleSlide extends Slide {
    constructor() {
        super("Title");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup;
        let title = this.title = two.makeText(
            'Fibonacci', 
            0,-150, {
                size: 200, 
                family: 'Arial', 
                fill: 'white',
                // stroke: 'black',
                linewidth: 2.0,
                weight: 'bold'
        });
        mainGroup.add(title);
        let subtitle = this.title = two.makeText(
            'Numeri fantastici e dove trovarli', 
            0,0, {size: 60, 
                family: 'Arial', 
                fill: 'white', 
                weight: 'bold'
        });
        mainGroup.add(subtitle);
        let contact = this.contact = two.makeText(
            'Gian Marco Todesco - gianmarco.todesco@gmail.com',
            0,120, {size: 35, family: 'Arial', fill: '#BBB', weight: 'bold'
        });
        mainGroup.add(contact);

    }
    cleanup() {
    }
    async end() {

        let tl = gsap.timeline();
        tl.to(this.mainGroup.children, {duration :0.5, opacity: 0, stagger:0.1}, 0);
        
        return tl;
    }
}

let t = new TitleSlide();

