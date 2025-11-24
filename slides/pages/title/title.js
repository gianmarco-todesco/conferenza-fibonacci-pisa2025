import {Slide, two, center} from '../../libs/gmtlib.js';   

class TitleSlide extends Slide {
    constructor() {
        super("Title");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup;
        let bg = two.makeSprite('/slides/assets/title-bg.jpg');
        mainGroup.add(bg);
        bg.scale = 2;
        let title = this.title = two.makeText(
            'Fibonacci', 
            0,-150, {
                size: 200, 
                family: 'Arial', 
                fill: 'black',
                // stroke: 'black',
                linewidth: 2.0,
                weight: 'bold'
        });
        mainGroup.add(title);
        let subtitle = this.title = two.makeText(
            'Numeri fantastici e dove trovarli', 
            0,50, {size: 110, 
                family: 'Arial', 
                fill: 'black', 
                weight: 'bold'
        });
        mainGroup.add(subtitle);
        let contact = this.contact = two.makeText(
            'Gian Marco Todesco - gianmarco.todesco@gmail.com',
            0,450, {size: 50, family: 'Arial', fill: '#111', weight: 'bold'
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

