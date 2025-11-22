import {Slide, two, center} from '../../libs/gmtlib.js';   

const margin = 90;
const babySize = 0.02;
const adultSize = 0.04;


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
        this.mainGroup.add(this.linkLayer);
        this.mainGroup.add(this.nodeLayer);
    
        let g = this.graph = createGraph();
        // see https://github.com/anvaka/ngraph.forcelayout
        var physicsSettings = {
            timeStep: 0.5,
            dimensions: 2,
            gravity: -12,
            theta: 0.8,
            springLength: 15, // was 10
            springCoefficient: 0.8,
            dragCoefficient: 0.9,
        };
        let layout = this.layout = ngraphCreateLayout(g, physicsSettings);

        this.sprites = [];
        this.segments = [];
        this.nextNodeId = 1;
        this.month = 0;
        this.lastValue = 1;

        let node1 = this.addNode("", false);
        // this.updateLayoutTicker = gsap.ticker.add(this.updateLayout.bind(this));
        this.createPanel();
    }

    createPanel() {
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '230px';
        div.style.height = '600px';
        div.style.top = '100px';
        div.style.left = '30px';
        div.style.border = '1px solid white';
        div.innerHTML = "<table><thead><tr>" +
            "<th>Mese</th><th>Coppie</th><th>%</th>"+
            "</tr></thead><tbody><tr><td></td><td>1</td><td></td></tr></tbody></table>"
        document.body.appendChild(div);

        div.style.backgroundColor = 'rgba(169, 211, 210, 0.7)';
        div.style.borderRadius = '15px';
        div.style.padding = '20px';
        div.style.color = 'white';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        const style = document.createElement('style');
        style.textContent = `
            #${div.id = 'rabbits-table'} table {
                width: 100%;
                border-collapse: collapse;
            }
            #rabbits-table th {
                padding: 10px;
                text-align: center;
                border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                font-weight: bold;
            }
            #rabbits-table td {
                padding: 8px;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            #rabbits-table tbody tr:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(style);
        this.panelDiv = div;
        this.panelStyle = style;
    }
    addTableRow(month, pairs) {
        let tbody = this.panelDiv.querySelector('tbody');
        let row = document.createElement('tr');    
        let monthCell = document.createElement('td');
        monthCell.textContent = month.toString();
        row.appendChild(monthCell);             
        let pairsCell = document.createElement('td');
        pairsCell.textContent = pairs.toString();
        row.appendChild(pairsCell);             
        let incCell = document.createElement('td');
        incCell.textContent = (100.0*pairs/this.lastValue).toFixed(2) + '%';
        row.appendChild(incCell);             
        tbody.appendChild(row);
        this.lastValue = pairs;
    }

    cleanup() {
        if(!this.started) return;
        this.started = false;
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
    }
    async end() {
    }

    update(time, deltaTime) {
        this.updateLayout();
    }
        
    updateLayout() {
        const layout = this.layout;
        layout.step();
        this.graph.forEachNode(function(node) {
            let p = layout.getNodePosition(node.id);
            node.data.sprite.position.set(10.0 * p.x , 10.0 * p.y );
        });
        this.graph.forEachLink(function(link) {
            let p = layout.getLinkPosition(link.id);
            let segmentId = link.fromId + '_' + link.toId;
            let segment = link.data.segment;
            segment.vertices[0].set(10.0 * p.from.x , 10.0 * p.from.y );
            segment.vertices[1].set(10.0 * p.to.x , 10.0 * p.to.y );
        });
    }

    
    addNode(parentId = "", isBaby = true) {
        let spritePair = two.makeGroup();
        let sprite2 = two.makeSprite('/slides/assets/rabbit-pair-2-white.png', 0, 0);
        spritePair.add(sprite2);
        let sprite = two.makeSprite('/slides/assets/rabbit-pair-2.png', 0, 0);
        spritePair.add(sprite);
        if(isBaby) {
            sprite2.opacity = 1.0;
            sprite.opacity = 0.0;
        } else {
            sprite.opacity = 1.0;
            sprite2.opacity = 0.0;

        }
        spritePair.scale = isBaby ? babySize : adultSize;
        this.sprites.push(spritePair);
        let nodeId = 'node' + this.nextNodeId++;
        this.graph.addNode(nodeId, {
            sprite: spritePair,
            young: isBaby
        });
        this.nodeLayer.add(spritePair);
    
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
                let spritePair = node.data.sprite;
                let sprite1 = spritePair.children[0];
                let sprite2 = spritePair.children[1];
                let obj = {t: 0};
                gsap.to(obj, {
                    t:1, duration: 1.0, 
                    onUpdate: function() {
                        sprite2.opacity = obj.t;
                        sprite1.opacity = 1 - obj.t;
                        spritePair.scale = babySize * (1-obj.t) + adultSize * obj.t;
                    }
                });
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
        this.addTableRow(++this.month, this.sprites.length);
    }
    nextAct() {
        this.step();
    }

    setScale(scale) {
        let s0 = Math.log(this.mainGroup.scale);
        let s1 = Math.log(scale)
        let obj = {s:s0};
        gsap.to(obj, {
            s:s1, duration: 1.0,
            onUpdate: () => {     
                this.mainGroup.scale = Math.exp(obj.s);
            }
        });
            
    }
    onKeyDown(event) {
        if(event.key === '-') {
            this.setScale(this.mainGroup.scale * 0.8);
        } else if(event.key === '+') {
            this.setScale(this.mainGroup.scale / 0.8);
        }
    }
}


let rabbitsSlide = new RabbitsSlide();  

