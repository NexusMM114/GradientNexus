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
    const randomizeShadowBtn = document.getElementById('randomizeShadowBtn');
    const copyShadowColorsBtn = document.getElementById('copyShadowColorsBtn');
    const reverseShadowBtn = document.getElementById('reverseShadowBtn');
    const invertShadowBtn = document.getElementById('invertShadowBtn');

    const randomizeBtn = document.getElementById('randomizeBtn');
    const reverseBtn = document.getElementById('reverseBtn');
    const invertBtn = document.getElementById('invertBtn');
    const nightModeBtn = document.getElementById('nightModeBtn');

    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const strikethroughBtn = document.getElementById('strikethroughBtn');
    const obfuscatedBtn = document.getElementById('obfuscatedBtn');

    let colors = ['#f97316', '#ef4444'];
    let shadowColors = ['#000000'];
    let formats = {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        obfuscated: false,
        shadow: false
    };

    function init() {
        loadState();
        renderColors();
        renderShadowColors();
        updateGradient();
    }

    function saveState() {
        const state = {
            text: inputText.value,
            colors: colors,
            shadowColors: shadowColors,
            formats: formats,
            formatType: colorFormat.value,
            lowercase: lowercaseToggle.checked,
            colorAmount: colorAmountInput.value,
            shadowColorAmount: shadowColorAmountInput.value
        };
        localStorage.setItem('angara_gradient_state', JSON.stringify(state));
    }

    function loadState() {
        const savedState = localStorage.getItem('angara_gradient_state');
        if (savedState) {
            const state = JSON.parse(savedState);
            inputText.value = state.text || 'RedRanger';
            colors = state.colors || ['#f97316', '#ef4444'];
            shadowColors = state.shadowColors || ['#000000'];
            formats = state.formats || formats;
            colorFormat.value = state.formatType || '&#rrggbb';
            lowercaseToggle.checked = state.lowercase || false;
            colorAmountInput.value = state.colorAmount || 2;
            shadowColorAmountInput.value = state.shadowColorAmount || 1;

            // Update UI buttons active state
            if (formats.bold) boldBtn.classList.add('active');
            if (formats.italic) italicBtn.classList.add('active');
            if (formats.underline) underlineBtn.classList.add('active');
            if (formats.strikethrough) strikethroughBtn.classList.add('active');
            if (formats.obfuscated) obfuscatedBtn.classList.add('active');
            
            shadowToggle.checked = formats.shadow;
            
            if (formats.shadow) {
                extraShadowOptions.style.display = 'block';
            }
        }
    }

    function renderColors() {
        colorInputs.innerHTML = '';
        colors.forEach((color, index) => {
            const div = document.createElement('div');
            div.className = 'color-item';
            div.innerHTML = `
                <div class="color-controls">
                    <button class="move-up" data-index="${index}" title="Move Up"><i class="fas fa-chevron-up"></i></button>
                    <button class="move-down" data-index="${index}" title="Move Down"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="color-content">
                    <label class="color-label">Color ${index + 1}</label>
                    <div class="color-input-row">
                        <div class="color-picker-wrapper" style="background-color: ${color}">
                            <input type="color" value="${color}" data-index="${index}">
                            <input type="text" class="color-hex" value="${color.toUpperCase()}" data-index="${index}" spellcheck="false">
                        </div>
                        ${colors.length > 2 ? `<button class="remove-color" data-index="${index}" title="Remove"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
            `;
            colorInputs.appendChild(div);
        });

        // Add event listeners
        colorInputs.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = e.target.dataset.index;
                let val = e.target.value.trim();
                
                if (e.target.type === 'text') {
                    // Remove any spaces and ensure it starts with #
                    val = val.replace(/\s/g, '');
                    if (val && !val.startsWith('#')) val = '#' + val;
                    
                    // Allow both 3-digit and 6-digit hex
                    const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(val);
                    
                    if (isHex) {
                        // Expand 3-digit hex to 6-digit if needed
                        let finalHex = val;
                        if (val.length === 4) {
                            finalHex = '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
                        }
                        
                        colors[index] = finalHex;
                        // Only update color picker, NOT the entire list to avoid focus loss
                        const colorPicker = colorInputs.querySelector(`input[type="color"][data-index="${index}"]`);
                        if (colorPicker) colorPicker.value = finalHex;
                        
                        // Also update the wrapper background
                        const wrapper = e.target.closest('.color-picker-wrapper');
                        if (wrapper) wrapper.style.backgroundColor = finalHex;
                        
                        updateGradient();
                        saveState();
                    }
                } else {
                    colors[index] = val;
                    const hexInput = colorInputs.querySelector(`input[type="text"][data-index="${index}"]`);
                    if (hexInput) hexInput.value = val.toUpperCase();
                    
                    // Also update the wrapper background
                    const wrapper = e.target.closest('.color-picker-wrapper');
                    if (wrapper) wrapper.style.backgroundColor = val;
                    
                    updateGradient();
                    saveState();
                }
            });

            // Handle paste specifically to clean up input
            if (input.type === 'text') {
                input.addEventListener('paste', (e) => {
                    // Short delay to let the paste happen then clean it up
                    setTimeout(() => {
                        let val = input.value.trim().replace(/\s/g, '');
                        if (val && !val.startsWith('#')) val = '#' + val;
                        
                        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                            // Let the 'input' event handle the logic
                            input.dispatchEvent(new Event('input'));
                        }
                    }, 10);
                });

                // Normalize on blur
                input.addEventListener('blur', (e) => {
                    const index = e.target.dataset.index;
                    let val = colors[index].toUpperCase();
                    e.target.value = val;
                });
            }
        });

        colorInputs.querySelectorAll('.remove-color').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                colors.splice(index, 1);
                colorAmountInput.value = colors.length;
                renderColors();
                updateGradient();
                saveState();
            });
        });

        colorInputs.querySelectorAll('.move-up').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (index > 0) {
                    [colors[index], colors[index - 1]] = [colors[index - 1], colors[index]];
                    renderColors();
                    updateGradient();
                    saveState();
                }
            });
        });

        colorInputs.querySelectorAll('.move-down').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (index < colors.length - 1) {
                    [colors[index], colors[index + 1]] = [colors[index + 1], colors[index]];
                    renderColors();
                    updateGradient();
                    saveState();
                }
            });
        });
    }

    function renderShadowColors() {
        shadowColorInputs.innerHTML = '';
        shadowColors.forEach((color, index) => {
            const div = document.createElement('div');
            div.className = 'color-item';
            div.innerHTML = `
                <div class="color-controls">
                    <button class="shadow-move-up" data-index="${index}" title="Move Up"><i class="fas fa-chevron-up"></i></button>
                    <button class="shadow-move-down" data-index="${index}" title="Move Down"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="color-content">
                    <label class="color-label">Shadow Color ${index + 1}</label>
                    <div class="color-input-row">
                        <div class="color-picker-wrapper" style="background-color: ${color}">
                            <input type="color" value="${color}" data-index="${index}">
                            <input type="text" class="color-hex" value="${color.toUpperCase()}" data-index="${index}" spellcheck="false">
                        </div>
                        ${shadowColors.length > 1 ? `<button class="remove-shadow-color" data-index="${index}" title="Remove"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
            `;
            shadowColorInputs.appendChild(div);
        });

        // Add event listeners
        shadowColorInputs.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = e.target.dataset.index;
                let val = e.target.value.trim();
                
                if (e.target.type === 'text') {
                    val = val.replace(/\s/g, '');
                    if (val && !val.startsWith('#')) val = '#' + val;
                    const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(val);
                    if (isHex) {
                        let finalHex = val;
                        if (val.length === 4) {
                            finalHex = '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
                        }
                        shadowColors[index] = finalHex;
                        const colorPicker = shadowColorInputs.querySelector(`input[type="color"][data-index="${index}"]`);
                        if (colorPicker) colorPicker.value = finalHex;
                        const wrapper = e.target.closest('.color-picker-wrapper');
                        if (wrapper) wrapper.style.backgroundColor = finalHex;
                        updateGradient();
                        saveState();
                    }
                } else {
                    shadowColors[index] = val;
                    const hexInput = shadowColorInputs.querySelector(`input[type="text"][data-index="${index}"]`);
                    if (hexInput) hexInput.value = val.toUpperCase();
                    const wrapper = e.target.closest('.color-picker-wrapper');
                    if (wrapper) wrapper.style.backgroundColor = val;
                    updateGradient();
                    saveState();
                }
            });

            if (input.type === 'text') {
                input.addEventListener('paste', (e) => {
                    setTimeout(() => {
                        let val = input.value.trim().replace(/\s/g, '');
                        if (val && !val.startsWith('#')) val = '#' + val;
                        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                            input.dispatchEvent(new Event('input'));
                        }
                    }, 10);
                });
                input.addEventListener('blur', (e) => {
                    const index = e.target.dataset.index;
                    let val = shadowColors[index].toUpperCase();
                    e.target.value = val;
                });
            }
        });

        shadowColorInputs.querySelectorAll('.remove-shadow-color').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                shadowColors.splice(index, 1);
                shadowColorAmountInput.value = shadowColors.length;
                renderShadowColors();
                updateGradient();
                saveState();
            });
        });

        shadowColorInputs.querySelectorAll('.shadow-move-up').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (index > 0) {
                    [shadowColors[index], shadowColors[index - 1]] = [shadowColors[index - 1], shadowColors[index]];
                    renderShadowColors();
                    updateGradient();
                    saveState();
                }
            });
        });

        shadowColorInputs.querySelectorAll('.shadow-move-down').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (index < shadowColors.length - 1) {
                    [shadowColors[index], shadowColors[index + 1]] = [shadowColors[index + 1], shadowColors[index]];
                    renderShadowColors();
                    updateGradient();
                    saveState();
                }
            });
        });
    }

    // Shadow Card Collapse
    shadowHeader.addEventListener('click', () => {
        const isHidden = shadowSettings.style.display === 'none' || shadowSettings.style.display === '';
        shadowSettings.style.display = isHidden ? 'block' : 'none';
        shadowChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    shadowToggle.addEventListener('change', () => {
        formats.shadow = shadowToggle.checked;
        extraShadowOptions.style.display = formats.shadow ? 'block' : 'none';
        updateGradient();
    });

    decreaseShadowColorBtn.addEventListener('click', () => {
        if (shadowColors.length > 1) {
            shadowColors.pop();
            shadowColorAmountInput.value = shadowColors.length;
            renderShadowColors();
            updateGradient();
            saveState();
        }
    });

    increaseShadowColorBtn.addEventListener('click', () => {
        if (shadowColors.length < 10) {
            shadowColors.push('#000000');
            shadowColorAmountInput.value = shadowColors.length;
            renderShadowColors();
            updateGradient();
            saveState();
        }
    });

    shadowColorAmountInput.addEventListener('change', () => {
        let val = parseInt(shadowColorAmountInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 10) val = 10;
        shadowColorAmountInput.value = val;
        while (shadowColors.length < val) shadowColors.push('#000000');
        while (shadowColors.length > val) shadowColors.pop();
        renderShadowColors();
        updateGradient();
        saveState();
    });

    randomizeShadowBtn.addEventListener('click', () => {
        shadowColors = shadowColors.map(() => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
        renderShadowColors();
        updateGradient();
        saveState();
    });

    copyShadowColorsBtn.addEventListener('click', () => {
        const colorsStr = shadowColors.join(', ');
        navigator.clipboard.writeText(colorsStr);
        const originalText = copyShadowColorsBtn.title;
        copyShadowColorsBtn.title = 'Copied!';
        setTimeout(() => copyShadowColorsBtn.title = originalText, 2000);
    });

    reverseShadowBtn.addEventListener('click', () => {
        shadowColors.reverse();
        renderShadowColors();
        updateGradient();
        saveState();
    });

    invertShadowBtn.addEventListener('click', () => {
        shadowColors = shadowColors.map(c => {
            const rgb = hexToRgb(c);
            return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
        });
        renderShadowColors();
        updateGradient();
        saveState();
    });

    decreaseColorBtn.addEventListener('click', () => {
        if (colors.length > 2) {
            colors.pop();
            colorAmountInput.value = colors.length;
            renderColors();
            updateGradient();
            saveState();
        }
    });

    increaseColorBtn.addEventListener('click', () => {
        if (colors.length < 10) {
            colors.push('#ffffff');
            colorAmountInput.value = colors.length;
            renderColors();
            updateGradient();
            saveState();
        }
    });

    colorAmountInput.addEventListener('change', () => {
        let val = parseInt(colorAmountInput.value);
        if (isNaN(val) || val < 2) val = 2;
        if (val > 10) val = 10;
        colorAmountInput.value = val;
        while (colors.length < val) colors.push('#ffffff');
        while (colors.length > val) colors.pop();
        renderColors();
        updateGradient();
        saveState();
    });

    // Utility buttons
    randomizeBtn.addEventListener('click', () => {
        colors = colors.map(() => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
        renderColors();
        updateGradient();
        saveState();
    });

    reverseBtn.addEventListener('click', () => {
        colors.reverse();
        renderColors();
        updateGradient();
        saveState();
    });

    invertBtn.addEventListener('click', () => {
        colors = colors.map(c => {
            const rgb = hexToRgb(c);
            return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
        });
        renderColors();
        updateGradient();
        saveState();
    });

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function interpolateColor(color1, color2, factor) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
        const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
        const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
        return rgbToHex(r, g, b);
    }

    function getGradientColor(index, total, colorArray) {
        if (total <= 1) return colorArray[0];
        const section = (colorArray.length - 1) * index / (total - 1);
        const i = Math.floor(section);
        const factor = section - i;
        if (i >= colorArray.length - 1) return colorArray[colorArray.length - 1];
        return interpolateColor(colorArray[i], colorArray[i + 1], factor);
    }

    function formatColor(hex, formatType) {
        let cleanHex = hex.replace('#', '');
        if (lowercaseToggle.checked) {
            cleanHex = cleanHex.toLowerCase();
        } else {
            cleanHex = cleanHex.toUpperCase();
        }

        switch (formatType) {
            case '&#rrggbb': return `&#${cleanHex}`;
            case '<#rrggbb>': return `<#${cleanHex}>`;
            case 'JSON': return `{"text":"$text$","color":"#${cleanHex}"}`;
            case 'MiniMessage': return `<#${cleanHex}>`;
            case '§x§r§r§g§g§b§b':
                return '§x' + cleanHex.split('').map(c => '§' + c).join('');
            case '&x&r&r&g&g&b&b':
                return '&x' + cleanHex.split('').map(c => '&' + c).join('');
            case '[COLOR=#rrggbb][/COLOR]':
                return `[COLOR=#${cleanHex}]$text$[/COLOR]`;
            case '#rrggbb': return `#${cleanHex}`;
            default: return `&#${cleanHex}`;
        }
    }

    function updateGradient() {
        const text = inputText.value;
        if (!text) {
            previewArea.innerHTML = '';
            outputText.value = '';
            return;
        }

        let previewHtml = '';
        let outputStr = '';
        const formatType = colorFormat.value;

        let legacyFormatCodes = '';
        if (formats.bold) legacyFormatCodes += '§l';
        if (formats.italic) legacyFormatCodes += '§o';
        if (formats.underline) legacyFormatCodes += '§n';
        if (formats.strikethrough) legacyFormatCodes += '§m';
        if (formats.obfuscated) legacyFormatCodes += '§k';

        let jsonParts = [];

        for (let i = 0; i < text.length; i++) {
            const color = getGradientColor(i, text.length, colors);
            const shadowColor = getGradientColor(i, text.length, shadowColors);
            let formattedColor = formatColor(color, formatType);
            const char = text[i];
            
            // Preview
            let styles = `color: ${color};`;
            if (formats.bold) styles += 'font-weight: bold;';
            if (formats.italic) styles += 'font-style: italic;';
            if (formats.underline) styles += 'text-decoration: underline;';
            if (formats.strikethrough) styles += 'text-decoration: line-through;';
            if (formats.underline && formats.strikethrough) styles += 'text-decoration: underline line-through;';
            if (formats.shadow) styles += `text-shadow: 2px 2px 4px ${shadowColor};`;
            
            let previewChar = char;
            if (formats.obfuscated) {
                previewChar = '<span class="obfuscated">' + char + '</span>';
            }

            previewHtml += `<span style="${styles}">${previewChar}</span>`;

            // Output
            if (formatType === 'JSON') {
                let part = { text: char, color: color };
                if (formats.bold) part.bold = true;
                if (formats.italic) part.italic = true;
                if (formats.underline) part.underlined = true;
                if (formats.strikethrough) part.strikethrough = true;
                if (formats.obfuscated) part.obfuscated = true;
                if (formats.shadow) part.shadow_color = shadowColor;
                jsonParts.push(part);
            } else if (formatType === 'MiniMessage') {
                let mmTags = `<${color}>`;
                if (formats.bold) mmTags += '<bold>';
                if (formats.italic) mmTags += '<italic>';
                if (formats.underline) mmTags += '<underlined>';
                if (formats.strikethrough) mmTags += '<strikethrough>';
                if (formats.obfuscated) mmTags += '<obfuscated>';
                if (formats.shadow) mmTags += `<shadow:${shadowColor}>`;
                outputStr += `${mmTags}${char}`;
            } else if (formattedColor.includes('$text$')) {
                outputStr += formattedColor.replace('$text$', char);
            } else {
                outputStr += `${formattedColor}${legacyFormatCodes}${char}`;
            }
        }

        if (formatType === 'JSON') {
            outputText.value = JSON.stringify(jsonParts);
        } else {
            outputText.value = outputStr;
        }
        previewArea.innerHTML = previewHtml;
        saveState();
    }

    inputText.addEventListener('input', updateGradient);
    colorFormat.addEventListener('change', updateGradient);
    lowercaseToggle.addEventListener('change', updateGradient);

    [boldBtn, italicBtn, underlineBtn, strikethroughBtn, obfuscatedBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.id.replace('Btn', '');
            formats[type] = !formats[type];
            btn.classList.toggle('active');
            updateGradient();
        });
    });

    copyBtn.addEventListener('click', () => {
        outputText.select();
        document.execCommand('copy');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => copyBtn.innerText = originalText, 2000);
    });

    setInterval(() => {
        const obfuscatedElements = document.querySelectorAll('.obfuscated');
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        obfuscatedElements.forEach(el => {
            el.innerText = chars.charAt(Math.floor(Math.random() * chars.length));
        });
    }, 50);

    init();
});
