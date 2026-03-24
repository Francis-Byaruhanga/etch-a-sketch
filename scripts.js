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
        cell.style.width = `${cellPercent}%`;{
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