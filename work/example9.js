// Springy.js Force Layout Example with SVG.js and GSAP
let draw, graph, layout;

let nodes = [];
window.addEventListener("DOMContentLoaded", () => {
    initializeVisualization();
   
});


let g;
let nodeDict = {};
let edgeDict = {};
let nextNodeId = 1;
let center;
let rabbitTexture;
let nodeLayer, linkLayer;

function addNode(parentId) {
    let sprite = two.makeSprite('rabbit-pair-2.png', 0, 0);
    sprite.scale = 0.02;
    let nodeId = 'node' + nextNodeId++;
    g.addNode(nodeId, {
        sprite: sprite,
        young: true
    });
    nodeLayer.add(sprite);
    nodeDict[nodeId] = sprite;
    
    if(parentId) {
        let pos = layout.getNodePosition(parentId);
        let dx = 10 * (Math.random() - 0.5), dy = 10 * (Math.random() - 0.5);
        layout.setNodePosition(nodeId, pos.x + dx, pos.y + dy);

        let edgeId = parentId + '_' + nodeId;
        let segment = edgeDict[edgeId] = two.makeLine(0,0,0,0);
        segment.stroke = '#ccc';
        segment.linewidth = 2;
        linkLayer.add(segment);

        g.addLink(parentId, nodeId, {segment: segment});

    }
    return nodeId;
}

let countLabel;

function initializeVisualization() {
    var container = document.getElementById('example9');
    const containerRect = container.getBoundingClientRect();
    
    two = new Two({
        width: containerRect.width,
        height: containerRect.height
    }).appendTo(container);
    center = {x:containerRect.width / 2, y: containerRect.height / 2};

    linkLayer = two.makeGroup();
    nodeLayer = two.makeGroup();    


    countLabel = two.makeText("1", 50, 50, {size: 50, family: 'Arial'});
    
    g = createGraph();
    layout = ngraphCreateLayout(g);

    let node1 = addNode();
    // let node2 = addNode(node1);
 
    setInterval(()=>{
        layout.step();
        g.forEachNode(function(node) {
        let p = layout.getNodePosition(node.id);
        nodeDict[node.id].position.set(center.x + 10.0 * p.x , center.y + 10.0 * p.y );
        // Node position is pair of x,y coordinates:
        // {x: ... , y: ... }
        });
        g.forEachLink(function(link) {
            let p = layout.getLinkPosition(link.id);
            let segmentId = link.fromId + '_' + link.toId;
            let segment = edgeDict[segmentId];
            segment.vertices[0].set(center.x + 10.0 * p.from.x , center.y + 10.0 * p.from.y );
            segment.vertices[1].set(center.x + 10.0 * p.to.x , center.y + 10.0 * p.to.y );
        });
        two.update();
    }, 50);
    /*
    g.addNode('hello');
    layout.setNodePosition('hello', 100,100);
    g.addNode('world');
    layout.setNodePosition('world', 200,100);
    
    g.addLink('hello', 'world');
    */

    

    /*, {
        springLength: 100,
        springCoefficient: 0.0008,
        gravity: -1.2,
        theta: 0.8
    });
    */

    
}

let mysegment;

function step() {
    let lst = [];
    g.forEachNode(function(node) {
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
        let newId = addNode(id);
    });
    countLabel.value = Object.keys(nodeDict).length.toString();
}

function uffa() {
    for (var i = 0; i < 200; ++i) {
        layout.step();
    }
    g.forEachNode(function(node) {
        let p = layout.getNodePosition(node.id);
        nodeDict[node.id].position.set(center.x + 10.0 * p.x , center.y + 10.0 * p.y );
        // Node position is pair of x,y coordinates:
        // {x: ... , y: ... }
    });
    g.forEachLink(function(link) {
        let p = layout.getLinkPosition(link.id);
        let segmentId = link.fromId + '_' + link.toId;
        let segment = edgeDict[segmentId];
        segment.vertices[0].set(center.x + 10.0 * p.from.x , center.y + 10.0 * p.from.y );
        segment.vertices[1].set(center.x + 10.0 * p.to.x , center.y + 10.0 * p.to.y );
    });
    two.update();
}


document.addEventListener('keypress', (event) => {
    if(event.key === 'a') {
        step(); 
    }
});