document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const colorInputs = document.getElementById('colorInputs');
    const colorAmountInput = document.getElementById('colorAmountInput');
    const decreaseColorBtn = document.getElementById('decreaseColorBtn');
    const increaseColorBtn = document.getElementById('increaseColorBtn');
    const colorFormat = document.getElementById('colorFormat');
    const previewArea = document.getElementById('previewArea');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const lowercaseToggle = document.getElementById('lowercaseToggle');
    const shadowToggle = document.getElementById('shadowToggle');
    const shadowHeader = document.getElementById('shadowHeader');
    const shadowSettings = document.getElementById('shadowSettings');
    const shadowChevron = document.getElementById('shadowChevron');
    const extraShadowOptions = document.getElementById('extraShadowOptions');
    const shadowColorInputs = document.getElementById('shadowColorInputs');
    const shadowColorAmountInput = document.getElementById('shadowColorAmountInput');
    const decreaseShadowColorBtn = document.getElementById('decreaseShadowColorBtn');
    const increaseShadowColorBtn = document.getElementById('increaseShadowColorBtn');

    // Utility Buttons
    const randomizeBtn = document.getElementById('randomizeBtn');
    const reverseBtn = document.getElementById('reverseBtn');
    const invertBtn = document.getElementById('invertBtn');
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const strikethroughBtn = document.getElementById('strikethroughBtn');
    const obfuscatedBtn = document.getElementById('obfuscatedBtn');

    let colors = ['#3b82f6', '#06b6d4'];
    let shadowColors = ['#000000'];
    let formats = { bold: false, italic: false, underline: false, strikethrough: false, obfuscated: false, shadow: false };

    function init() {
        loadState();
        renderColors();
        renderShadowColors();
        updateGradient();
    }

    function saveState() {
        const state = {
            text: inputText.value,
            colors, shadowColors, formats,
            formatType: colorFormat.value,
            lowercase: lowercaseToggle.checked,
            colorAmount: colorAmountInput.value
        };
        localStorage.setItem('nexus_gradient_state', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('nexus_gradient_state');
        if (saved) {
            const s = JSON.parse(saved);
            inputText.value = s.text || 'Nexus';
            colors = s.colors || colors;
            formats = s.formats || formats;
            colorFormat.value = s.formatType || '&#rrggbb';
            lowercaseToggle.checked = s.lowercase || false;
            
            Object.keys(formats).forEach(f => {
                const btn = document.getElementById(`${f}Btn`);
                if (btn && formats[f]) btn.classList.add('active');
            });
        }
    }

    function renderColors() {
        colorInputs.innerHTML = '';
        colors.forEach((color, i) => {
            const row = document.createElement('div');
            row.className = 'color-row';
            row.innerHTML = `
                <input type="color" value="${color}" data-index="${i}">
                <input type="text" value="${color.toUpperCase()}" data-index="${i}" class="hex-text">
                <div class="row-controls">
                    <button onclick="moveColor(${i}, -1)"><i class="fas fa-chevron-up"></i></button>
                    <button onclick="moveColor(${i}, 1)"><i class="fas fa-chevron-down"></i></button>
                </div>
            `;
            colorInputs.appendChild(row);
        });
        setupInputListeners();
    }

    window.moveColor = (index, step) => {
        const newIndex = index + step;
        if (newIndex >= 0 && newIndex < colors.length) {
            const temp = colors[index];
            colors[index] = colors[newIndex];
            colors[newIndex] = temp;
            renderColors();
            updateGradient();
        }
    };

    function setupInputListeners() {
        colorInputs.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.dataset.index;
                colors[idx] = e.target.value;
                renderColors(); // Refresh to sync text and picker
                updateGradient();
            });
        });
    }

    function hexToRgb(hex) {
        const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return res ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) } : null;
    }

    function interpolateColor(c1, c2, factor) {
        const rgb1 = hexToRgb(c1), rgb2 = hexToRgb(c2);
        const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
        const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
        const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    function getGradientColor(index, total) {
        if (total <= 1) return colors[0];
        const section = (colors.length - 1) * index / (total - 1);
        const i = Math.floor(section);
        return interpolateColor(colors[i], colors[i + 1] || colors[i], section - i);
    }

    function updateGradient() {
        const text = inputText.value;
        let previewHtml = '';
        let outputStr = '';

        for (let i = 0; i < text.length; i++) {
            const color = getGradientColor(i, text.length);
            let char = text[i];
            
            // Preview Logic
            let style = `color: ${color};`;
            if (formats.bold) style += 'font-weight: bold;';
            if (formats.italic) style += 'font-style: italic;';
            
            let displayChar = formats.obfuscated ? `<span class="obf">${char}</span>` : char;
            previewHtml += `<span style="${style}">${displayChar}</span>`;

            // Output Logic (Simplified for brevity)
            let hex = color.replace('#', '');
            if (lowercaseToggle.checked) hex = hex.toLowerCase();
            outputStr += `<#${hex}>${char}`;
        }

        previewArea.innerHTML = previewHtml;
        outputText.value = outputStr;
        saveState();
    }

    // Toggle Buttons
    [boldBtn, italicBtn, underlineBtn, strikethroughBtn, obfuscatedBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.id.replace('Btn', '');
            formats[type] = !formats[type];
            btn.classList.toggle('active');
            updateGradient();
        });
    });

    // Obfuscation Animation
    setInterval(() => {
        document.querySelectorAll('.obf').forEach(el => {
            const chars = 'ABCDEFTUVXYZ0123456789';
            el.innerText = chars[Math.floor(Math.random() * chars.length)];
        });
    }, 50);

    init();
});
