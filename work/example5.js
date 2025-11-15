
let draw, image, base, symbol;

let rows = [];
let y = 10;


window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(TextPlugin);

    
    draw = SVG().addTo('#example5').size(600, 800);
    symbol = draw.symbol();



    base = symbol.image('rabbit-pair.jpg').size(100, 100);
    let row = [];
    let inst = draw.use(base);
    inst.move(100, y);
    gsap.set(inst.node, {scale: 0.5, transformOrigin: "50% 100%"});
    inst.userData = {x:100, y:y, size:0.5};
    row.push(inst);
    rows.push(row);


    // make some nodes
    var spruce = graph.newNode({label: 'Norway Spruce'});
    var fir = graph.newNode({label: 'Sicilian Fir'});

    // connect them with an edge
    let edge = graph.newEdge(spruce, fir);

    spruce.myData = draw.circle(20).fill('green');
    fir.myData = draw.circle(20).fill('blue');
    edge.myData = draw.line(0, 0, 100, 100).stroke({width: 2, color: '#000'});

    var layout = new Springy.Layout.ForceDirected(
        graph,
        800.0, // Spring stiffness
        8000.0, // Node repulsion
        0.5 // Damping
    );

    spruce.myData.move(100,100);
    fir.myData.move(150,100);
    edge.myData.plot(100,100,300,100);
    var renderer = new Springy.Renderer(
        layout,
        function clear() {
            // code to clear screen
        },
        function drawEdge(edge, p1, p2) {
            edge.myData.plot(p1.x, p1.y, p2.x, p2.y);
            // draw an edge
        },
        function drawNode(node, p) {
            node.myData.move(p.x, p.y);
            // draw a node
        }
    );

    renderer.start();
    /*
    // creo tante copie spostate
    for (let i = 0; i < 10; i++) {
        let inst = draw.use(base);
        inst.move(100+i * 60, 100+0);
        rows.push(inst);
    }
        */
});


function nextGeneration() {
    let newRow = [];
    let lastRow = rows[rows.length - 1];    
    let n = lastRow.length;
    y += 100;
    let x = 100;
    for(let i=0; i<n; i++) {
        let src = lastRow[i];
        let x0 = src.userData.x, y0 = src.userData.y, sc = src.userData.size;
        if(sc < 1.0) {
            // piccolo: cresce 
            let inst = draw.use(base);
            gsap.set(inst.node, {x:x0, y:y0, scale: 0.5, transformOrigin: "50% 100%"});
            gsap.to(inst.node, {duration: 1, 
                scale: 1.0, transformOrigin: "50% 100%",
                x: x, y: y,
                delay: 0.5 * i
            });
            inst.userData = {x:x, y:y, size:1.0};
            newRow.push(inst);
            x += 100;
        } else {
            // grande: si divide
            let inst = draw.use(base);
            gsap.set(inst.node, {x:x0, y:y0, scale: 1.0, transformOrigin: "50% 100%"});
            gsap.to(inst.node, {duration: 1, 
                x: x, y: y,
                delay: 0.5 * i
            });
            inst.userData = {x:x, y:y, size:1.0};
            newRow.push(inst);
            x += 100;
            inst = draw.use(base);
            gsap.set(inst.node, {x:x0, y:y0, scale: 0.5, transformOrigin: "50% 100%"});
            gsap.to(inst.node, {duration: 1, 
                x: x, y: y,
                delay: 0.5 * i
            });
            inst.userData = {x:x, y:y, size:0.5};
            newRow.push(inst);
            x += 100;
        }
    }    
    rows.push(newRow);

}

document.addEventListener("keydown", (event) => {
    if(event.key === "ArrowRight") {
        nextGeneration();
    }
});