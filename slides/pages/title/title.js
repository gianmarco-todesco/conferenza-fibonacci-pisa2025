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

        let title = this.title = two.makeText(
            'Fibonacci', 
            0,-80, {size: 90, family: 'Arial', fill: 'white', weight: 'bold'
        });
        mainGroup.add(title);
        let subtitle = this.title = two.makeText(
            'Numeri fantastici e dove trovarli', 
            0,0, {size: 40, family: 'Arial', fill: 'white', weight: 'bold'
        });
        mainGroup.add(subtitle);
        let contact = this.contact = two.makeText(
            'Gian Marco Todesco - gianmarco.todesco@gmail.com',
            0,80, {size: 20, family: 'Arial', fill: '#BBB', weight: 'bold'
        });
        mainGroup.add(contact);

    }
    cleanup() {
        this.mainGroup.remove();
    }
    async end() {

        let tl = gsap.timeline();
        tl.to(this.mainGroup.children, {duration :0.5, opacity: 0, stagger:0.1}, 0);
        
        return tl;
    }
}

let t = new TitleSlide();

