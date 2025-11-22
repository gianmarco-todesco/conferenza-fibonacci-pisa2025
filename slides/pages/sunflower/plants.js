import {Slide, two, center} from '../../libs/gmtlib.js';   

class PlantsSlide extends Slide {
    constructor() {
        super("Plants");
    }   
    initialize() {
    }
    start() {
        let mainGroup = two.makeGroup();
        mainGroup.position.set(center.x, center.y);
        this.mainGroup = mainGroup; 
        this.addImage('/slides/assets/daisy.jpg', -200, 0, 0.125);
        this.addImage('/slides/assets/pinecone.jpg', 0, 0, 0.25);
        this.addImage('/slides/assets/sunflower-1.png', 200, 0, 0.25);
        this.addImage('/slides/assets/broccolo.jpg', 200, 300, 0.25);
    }

    addImage(path, x, y, scale) {
        let sprite = two.makeSprite(path, 0, 0);
        this.mainGroup.add(sprite);
        sprite.scale = scale;
        sprite.position.set(x, y);
        // sprite.visible = false;
        return sprite;
    }

    async end() {
    }
    cleanup() {
        this.mainGroup.remove();
    }
}

let plantsSlide = new PlantsSlide();

