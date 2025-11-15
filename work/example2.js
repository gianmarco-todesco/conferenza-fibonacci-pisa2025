// Domino Tiling Visualization - GSAP + SVG
// Mostra come i pezzi del domino (1×2) possono tassellare un rettangolo 2×n in F_n modi

gsap.registerPlugin(TextPlugin);

// Variabili globali
let currentN = 2;
const maxN = 8;
const minN = 1;
let currentTilingIndex = 0;
let tilings = [];

// Calcola i numeri di Fibonacci
function fibonacci(n) {
    if (n <= 1) return 1;
    if (n === 2) return 1;
    let a = 1, b = 1;
    for (let i = 3; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

// Genera tutte le possibili tassellazioni per un rettangolo 2×n
function generateTilings(n) {
    if (n === 1) return [['V']]; // Una tessera verticale
    if (n === 2) return [['V', 'V'], ['H']]; // Due verticali o una orizzontale
    
    const tilings = [];
    
    // Ricorsione: F(n) = F(n-1) + F(n-2)
    // Caso 1: inizia con una tessera verticale (poi F(n-1) modi per il resto)
    const smallerTilings = generateTilings(n - 1);
    smallerTilings.forEach(tiling => {
        tilings.push(['V', ...tiling]);
    });
    
    // Caso 2: inizia con una tessera orizzontale (occupa 2 colonne, poi F(n-2) modi)
    const evenSmallerTilings = generateTilings(n - 2);
    evenSmallerTilings.forEach(tiling => {
        tilings.push(['H', ...tiling]);
    });
    
    return tilings;
}

// Disegna un singolo domino nell'SVG
function drawDomino(svg, x, y, width, height, color, id) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", color);
    rect.setAttribute("stroke", "#333");
    rect.setAttribute("stroke-width", "2");
    rect.setAttribute("id", id);
    rect.setAttribute("opacity", "0");
    svg.appendChild(rect);
    return rect;
}

// Disegna una tassellazione completa
function drawTiling(tiling, tilingIndex) {
    const svg = document.getElementById("domino-svg");
    svg.innerHTML = ""; // Pulisci SVG
    
    const tileSize = 40;
    const startX = 50;
    const startY = 100;
    
    // Colori per i domini
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"];
    
    let x = startX;
    const dominoes = [];
    
    tiling.forEach((piece, index) => {
        const color = colors[index % colors.length];
        
        if (piece === 'V') {
            // Domino verticale (1×2)
            const domino = drawDomino(svg, x, startY, tileSize, tileSize * 2, color, `domino-${tilingIndex}-${index}`);
            dominoes.push(domino);
            x += tileSize;
        } else if (piece === 'H') {
            // Domino orizzontale (2×1, ma occupa 2 colonne in alto e in basso)
            const domino1 = drawDomino(svg, x, startY, tileSize * 2, tileSize, color, `domino-${tilingIndex}-${index}-top`);
            const domino2 = drawDomino(svg, x, startY + tileSize, tileSize * 2, tileSize, color, `domino-${tilingIndex}-${index}-bottom`);
            dominoes.push(domino1, domino2);
            x += tileSize * 2;
        }
    });
    
    // Disegna il bordo del rettangolo
    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", startX - 2);
    border.setAttribute("y", startY - 2);
    border.setAttribute("width", currentN * tileSize + 4);
    border.setAttribute("height", tileSize * 2 + 4);
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", "#fff");
    border.setAttribute("stroke-width", "3");
    border.setAttribute("opacity", "0");
    svg.appendChild(border);
    
    return { dominoes, border };
}

// Anima l'apparizione di una tassellazione
function animateTiling(elements, delay = 0) {
    const tl = gsap.timeline({ delay });
    
    // Prima appare il bordo
    tl.to(elements.border, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out"
    });
    
    // Poi appaiono i domini con stagger
    tl.to(elements.dominoes, {
        duration: 0.6,
        opacity: 1,
        scale: 1,
        ease: "back.out(1.7)",
        stagger: 0.2
    }, "-=0.2");
    
    return tl;
}

// Aggiorna la visualizzazione per il valore corrente di n
function updateVisualization() {
    tilings = generateTilings(currentN);
    currentTilingIndex = 0;
    
    // Aggiorna le informazioni
    document.getElementById("current-n").textContent = currentN;
    document.getElementById("fibonacci-count").textContent = fibonacci(currentN);
    
    // Aggiorna i pulsanti
    document.getElementById("prevBtn").disabled = currentN <= minN;
    document.getElementById("nextBtn").disabled = currentN >= maxN;
    
    // Mostra la prima tassellazione
    showCurrentTiling();
}

// Mostra la tassellazione corrente
function showCurrentTiling() {
    if (tilings.length === 0) return;
    
    const elements = drawTiling(tilings[currentTilingIndex], currentTilingIndex);
    animateTiling(elements);
    
    // Aggiorna info sulla tassellazione corrente
    const info = document.getElementById("info");
    const tilingInfo = document.createElement("div");
    tilingInfo.style.marginTop = "10px";
    tilingInfo.style.fontSize = "14px";
    tilingInfo.innerHTML = `Tiling ${currentTilingIndex + 1} of ${tilings.length}`;
    
    // Rimuovi info precedente se esiste
    const oldInfo = info.querySelector(".tiling-info");
    if (oldInfo) oldInfo.remove();
    
    tilingInfo.className = "tiling-info";
    info.appendChild(tilingInfo);
}

// Mostra tutte le tassellazioni
function showAllTilings() {
    const svg = document.getElementById("domino-svg");
    svg.innerHTML = "";
    
    const tileSize = 30; // Più piccolo per mostrare tutto
    const spacing = 20;
    const startY = 50;
    
    tilings.forEach((tiling, tilingIndex) => {
        const startX = 50 + tilingIndex * (currentN * tileSize + spacing);
        
        // Disegna ogni tassellazione
        let x = startX;
        tiling.forEach((piece, pieceIndex) => {
            const color = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"][pieceIndex % 4];
            
            if (piece === 'V') {
                const domino = drawDomino(svg, x, startY, tileSize, tileSize * 2, color, `all-${tilingIndex}-${pieceIndex}`);
                x += tileSize;
            } else if (piece === 'H') {
                const domino1 = drawDomino(svg, x, startY, tileSize * 2, tileSize, color, `all-${tilingIndex}-${pieceIndex}-1`);
                const domino2 = drawDomino(svg, x, startY + tileSize, tileSize * 2, tileSize, color, `all-${tilingIndex}-${pieceIndex}-2`);
                x += tileSize * 2;
            }
        });
        
        // Bordo per ogni tassellazione
        const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        border.setAttribute("x", startX - 1);
        border.setAttribute("y", startY - 1);
        border.setAttribute("width", currentN * tileSize + 2);
        border.setAttribute("height", tileSize * 2 + 2);
        border.setAttribute("fill", "none");
        border.setAttribute("stroke", "#fff");
        border.setAttribute("stroke-width", "2");
        border.setAttribute("opacity", "0");
        svg.appendChild(border);
    });
    
    // Anima tutte le tassellazioni
    const allElements = svg.querySelectorAll("rect");
    gsap.fromTo(allElements, 
        { opacity: 0, scale: 0.5 },
        { 
            duration: 0.8,
            opacity: 1,
            scale: 1,
            ease: "back.out(1.7)",
            stagger: 0.1
        }
    );
}

// Funzioni di navigazione
function showNextN() {
    if (currentN < maxN) {
        currentN++;
        updateVisualization();
    }
}

function showPreviousN() {
    if (currentN > minN) {
        currentN--;
        updateVisualization();
    }
}

function showNextTiling() {
    if (currentTilingIndex < tilings.length - 1) {
        currentTilingIndex++;
        showCurrentTiling();
    }
}

function showPreviousTiling() {
    if (currentTilingIndex > 0) {
        currentTilingIndex--;
        showCurrentTiling();
    }
}

// Gestione delle tastiere
document.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowUp":
            showNextN();
            break;
        case "ArrowDown":
            showPreviousN();
            break;
        case "ArrowRight":
            showNextTiling();
            break;
        case "ArrowLeft":
            showPreviousTiling();
            break;
        case " ":
            showAllTilings();
            event.preventDefault();
            break;
    }
});

// Inizializzazione
window.addEventListener("load", () => {
    setTimeout(() => {
        updateVisualization();
    }, 500);
});

