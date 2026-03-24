// ── State ────────────────────────────────────────────────
let currentSize = 16;
let drawMode = 'random';  // 'random' | 'darken' | 'classic'
let isDrawing = false;  // true while mouse button is held
const CLASSIC_COLOR = '#2d2d2d';

// ── Grid builder ─────────────────────────────────────────
function buildGrid(size) {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';

    // Cell dimensions driven purely by flex percentages
    const cellPercent = 100 / size;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.style.width = `${cellPercent}%`;
        cell.style.height = `${cellPercent}%`;
        cell.dataset.opacity = '0'; // Tracks darkening level 0-1

        // Draw on mouseenter while button held OR on direct mousedown
        cell.addEventListener('mouseenter', () => { if (isDrawing) applyColor(cell); });
        cell.addEventListener('mousedown', (e) => { e.preventDefault(); applyColor(cell); });

        container.appendChild(cell);
    }

    document.getElementById('size-display').textContent = `${size} * ${size}`;
}

// ── Color logic ───────────────────────────────────────────
function randomHex() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;
}

function applyColor(cell) {
    if (drawMode === 'random') {
        cell.style.backgroundColor = randomHex;
        cell.style.opacity = '1';
    } else if (drawMode === 'darken') {
        let op = parseFloat(cell.dataset.opacity);
        if (op < 1) {
            op = Math.min(op + 0.1, 1);
            cell.style.backgroundColor = '#1a1a2e';
            cell.style.opacity = String(op);
        }
    } else {
        // Classic
        cell.style.backgroundColor = CLASSIC_COLOR;
        cell.style.opacity = '1';
    }
    // Tiny pop animation
    cell.classList.remove = ('cell-pop');
    void cell.offsetWidth; //Reflow trick
    cell.classList.add('cell-pop');
}

// Clear grid
function clearGrid() {
    document.querySelectorAll(".grid-cell").forEach(cell => {
        cell.style.backgroundColor = '';
        cell.style.opacity = '1';
        cell.dataset.opacity = '0';
    }) 
}

// ── Resize prompt ─────────────────────────────────────────
function promptResize() {
    let size = parseInt(prompt('Enter grid size(1 - 100):', currentSize), 10);
    if (isNaN(size) || size < 1)    size = 1;
    if (size > 100)                 size = 100;
    currentSize = size;
    buildGrid(currentSize);
}

// ── Shake-to-clear via knobs ──────────────────────────────
function shakeAndClear() {
    const toy = document.getElementById('toy');
    toy.classList.remove('shaking');
    void toy(offsetWidth);
    toy.classList.remove('shaking');
    setTimeout(clearGrid, 200);
}

// ── Event wiring ──────────────────────────────────────────
// Global mouse tracking for draw-on-drag
document.addEventListener('mousedown', () => { isDrawing = true; });
document.addEventListener('mouseup', () => { isDrawing = false; });

document.getElementById('btn-clear').addEventListener('click', clearGrid);
document.getElementById('btn-resize').addEventListener('click', promptResize);
document.getElementById('knob-left').addEventListener('click', shakeAndClear);
document.getElementById('knob-right').addEventListener('click', shakeAndClear);

// Mode pills
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        drawMode = pill.dataset.mode;
    });
});

// Prevent context menu on grid so right-drag works smoothly
document.getElementById('grid-container').addEventListener('contextmenu', e => e.preventDefault());
