// GSAP Simple Square and Text Animation Example

// Create the square element dynamically
const container = document.getElementById("container");

gsap.registerPlugin(TextPlugin) 
// Create the text container with numbers and operator

const textContainer = document.createElement("div");
textContainer.className = "text-container";
textContainer.id = "text-container";

function createNumberSpan(number) {
    const span = document.createElement("span");
    span.className = "number";
    span.id = "number" + number;
    span.textContent = ""+number;
    return span;
}

let fibs = [1,1];
for(let i=2;i<30;i++) fibs.push(fibs[i-1]+fibs[i-2]);
let numbers = fibs.map(createNumberSpan);

let ops = [];
for(let i=0; i<numbers.length;i++) {
    const operator = document.createElement("span");
    operator.className = "operator";
    operator.id = "operator"+i;
    operator.textContent = i==0 ? '+' : "=";
    ops.push(operator);
}
for(let i=0;i<numbers.length;i++) {
    textContainer.appendChild(numbers[i]);
    textContainer.appendChild(ops[i]);
}

container.appendChild(textContainer);

// Debug: verifica che gli elementi siano stati creati
console.log("Numeri creati:", numbers.length);
console.log("Operatori creati:", ops.length);
console.log("Primo numero:", numbers[0]);

// Hide all numbers and operators initially
numbers.forEach(num => {
    gsap.set(num, { opacity: 0, scale: 0, y: -20 });
});
ops.forEach(op => {
    gsap.set(op, { opacity: 0, scale: 0, rotation: 180 });
});

// Simple animation function
function playAnimation() {
    console.log("Avvio animazione...");
        
    // Create a timeline for coordinated animations
    const tl = gsap.timeline();
    
    let dt = 0.5;
    tl.to(numbers[0], {duration: dt,opacity: 1,y:0,scale: 1,ease: "back.out(1.7)"});
    tl.to(ops[0], {duration: dt,opacity: 1,y:0,scale: 1,ease: "back.out(1.7)"});
    tl.to(numbers[1], {duration: dt,opacity: 1,y:0,scale: 1,ease: "back.out(1.7)"});
    tl.to(ops[1], {duration: dt,opacity: 1,y:0,scale: 1,ease: "back.out(1.7)"});
    tl.to(numbers[2], {duration: dt,opacity: 1,y:0,scale: 1,ease: "back.out(1.7)"});
    tl.addPause("waitForRight");
    for(let i=0; i<20; i++) {
        tl.to(ops[i], {duration: 0.5,opacity: 0}, "qui-"+i);
        tl.to(ops[i+1], {text:"+", duration: 0.5}, "qui-"+i);
        tl.to(ops[i+2], {text:"=", duration: 0.5,opacity: 1,y:0,scale: 1,ease: "back.out(1.7)", delay:0.5});
        tl.to(numbers[i+3], {duration: 0.5,opacity: 1,y:0,scale: 1,ease: "back.out(1.7)"});
        if(i>=10) 
        {
            tl.to(numbers[i-10], {duration: 0.5,opacity: 0}, "qui-"+i);
        }
        tl.addPause("waitForRight-"+i);
    }

    document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      // continua da dove è ferma (dopo la addPause)
      tl.play();
    }

    // opzionale: freccia sinistra per tornare indietro
    if (event.key === "ArrowLeft") {
      tl.reverse();
    }
  });
    

      // VERSIONE STAGGER - molto più pulita!
    // Anima tutti i numeri rimanenti con stagger di 1 secondo
    /*
    tl.to(numbers, {
        duration: 0.5,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "back.out(1.7)",
        stagger: 1 // 1 secondo tra ogni numero
    }, "+=1")
    .to(ops, {
        duration: 0.3,
        opacity: 1,
        scale: 1,
        rotation: 0,
        ease: "bounce.out",
        stagger: 1 // 1 secondo tra ogni operatore, sincronizzato
    }, "+=0.3"); // Inizia 0.3s dopo i numeri
    */
}

// Auto-play animation when page loads
window.addEventListener("load", () => {
    setTimeout(() => {
        playAnimation();
    }, 500);
});

