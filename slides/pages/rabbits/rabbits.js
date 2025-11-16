import {Slide, two, center} from '../../libs/gmtlib.js';   

const margin = 90;

class RabbitsSlide extends Slide {
    constructor() {
        super("Rabbits");
        this.started = false;
    }   
    initialize() {
    }
    start() {
        if(this.started) return;
        this.started = true;
        this.linkLayer = two.makeGroup();
        this.nodeLayer = two.makeGroup();    
        this.countLabel = two.makeText("1", 50, 50, {size: 50, family: 'Arial'});
    
        let g = this.graph = createGraph();
        let layout = this.layout = ngraphCreateLayout(g);

        this.sprites = [];
        this.segments = [];
        this.nextNodeId = 1;

        let node1 = this.addNode();
        this.updateLayoutTicker = gsap.ticker.add(this.updateLayout.bind(this));
    }
    cleanup() {
        if(!this.started) return;
        this.started = false;
        if(this.updateLayoutTicker) {
            gsap.ticker.remove(this.updateLayoutTicker);
            this.updateLayoutTicker = null; 
        }
        if(this.segments) {
            this.segments.forEach(segm => segm.remove());
            this.segments = null;
        }
        if(this.sprites) {
            this.sprites.forEach(spr => spr.remove());      
            this.sprites = null;
        }
        if(this.graph) {
            this.graph.clear(); 
            this.graph = null;
        }
        if(this.layout) {
            this.layout.dispose();
            this.layout = null;
        }
        if(this.linkLayer) {
            this.linkLayer.remove();
            this.linkLayer = null;
        }
        if(this.nodeLayer) {
            this.nodeLayer.remove();
            this.nodeLayer = null;
        }   
        if(this.countLabel) {
            this.countLabel.remove();
            this.countLabel = null;
        }   
    }
    async end() {
    }


    updateLayout() {
        const layout = this.layout;
        layout.step();
        this.graph.forEachNode(function(node) {
            let p = layout.getNodePosition(node.id);
            node.data.sprite.position.set(center.x + 10.0 * p.x , center.y + 10.0 * p.y );
        });
        this.graph.forEachLink(function(link) {
            let p = layout.getLinkPosition(link.id);
            let segmentId = link.fromId + '_' + link.toId;
            let segment = link.data.segment;
            segment.vertices[0].set(center.x + 10.0 * p.from.x , center.y + 10.0 * p.from.y );
            segment.vertices[1].set(center.x + 10.0 * p.to.x , center.y + 10.0 * p.to.y );
        });
        // two.update();
    }

    
    addNode(parentId = "") {
        let sprite = two.makeSprite('/slides/assets/rabbit-pair-2.png', 0, 0);
        sprite.scale = 0.02;
        this.sprites.push(sprite);
        let nodeId = 'node' + this.nextNodeId++;
        this.graph.addNode(nodeId, {
            sprite: sprite,
            young: true
        });
        this.nodeLayer.add(sprite);
    
        if(parentId != "") {
            let pos = this.layout.getNodePosition(parentId);
            let dx = 10 * (Math.random() - 0.5), dy = 10 * (Math.random() - 0.5);
            this.layout.setNodePosition(nodeId, pos.x + dx, pos.y + dy);

            let edgeId = parentId + '_' + nodeId;
            let segment = two.makeLine(0,0,0,0);
            this.segments.push(segment);
            segment.stroke = '#ccc';
            segment.linewidth = 2;
            this.linkLayer.add(segment);
            this.graph.addLink(parentId, nodeId, {segment: segment});
        }
        return nodeId;
    }

    step() {
        let lst = [];
        this.graph.forEachNode(function(node) {
            if(node.data.young) {
                let sprite = node.data.sprite;
                gsap.to(sprite, {scale: 0.03, duration: 1.0});
                node.data.young = false;
            }
            else
            {
                lst.push(node.id);
            }
        });
        lst.forEach(id => {
            let newId = this.addNode(id);
        });
        this.countLabel.value = this.sprites.length.toString();
    }
}


let rabbitsSlide = new RabbitsSlide();  

