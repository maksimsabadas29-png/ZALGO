
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

const horrorLevel = document.getElementById('horrorLevel');
const fontSelect = document.getElementById('fontSelect');

const topLevel = document.getElementById('topLevel');
const middleLevel = document.getElementById('middleLevel');
const bottomLevel = document.getElementById('bottomLevel');

const topValue = document.getElementById('topValue');
const middleValue = document.getElementById('middleValue');
const bottomValue = document.getElementById('bottomValue');

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const toast = document.getElementById('toast');

// ZALGO SYMBOLS

const topMarks = [
    '\u030d', '\u030e', '\u0304', '\u0305',
    '\u033f', '\u0311', '\u0306', '\u0310',
    '\u0352', '\u0357', '\u0351', '\u0307',
    '\u0308', '\u030a', '\u0342', '\u0343',
    '\u0344', '\u034a', '\u034b', '\u034c',
    '\u0303', '\u0302', '\u030c', '\u0350'
];

const middleMarks = [
    '\u0315', '\u031b', '\u0340', '\u0341',
    '\u0358', '\u0321', '\u0322', '\u0327',
    '\u0328', '\u0334', '\u0335', '\u0336',
    '\u034f', '\u035c', '\u035d', '\u035e',
    '\u035f', '\u0360', '\u0362'
];

const bottomMarks = [
    '\u0316', '\u0317', '\u0318', '\u0319',
    '\u031c', '\u031d', '\u031e', '\u031f',
    '\u0320', '\u0324', '\u0325', '\u0326',
    '\u0329', '\u032a', '\u032b', '\u032c',
    '\u032d', '\u032e', '\u032f', '\u0330',
    '\u0331', '\u0332', '\u0333', '\u0339',
    '\u033a', '\u033b', '\u033c'
];

// RANDOM NUMBER

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

// UPDATE SLIDER LABELS

function updateSliderLabels() {
    topValue.textContent = topLevel.value + '%';
    middleValue.textContent = middleLevel.value + '%';
    bottomValue.textContent = bottomLevel.value + '%';
}

[topLevel, middleLevel, bottomLevel].forEach(slider => {
    slider.addEventListener('input', updateSliderLabels);
});

// GET INTENSITY

function getIntensity() {
    const level = Number(horrorLevel.value);

    if (level === 1) return 1;
    if (level === 2) return 3;
    return 7;
}

// ADD ZALGO MARKS

function addMarks(character, marks, amount) {
    let result = character;

    for (let i = 0; i < amount; i++) {
        result += marks[randomNumber(marks.length)];
    }

    return result;
}

// GENERATE ZALGO

function generateZalgo() {
    const text = inputText.value;

    if (!text.trim()) {
        showToast('Спочатку введи текст!');
        inputText.focus();
        return;
    }

    const intensity = getIntensity();

    const topAmount = Math.round(
        intensity * Number(topLevel.value) / 100
    );

    const middleAmount = Math.round(
        intensity * Number(middleLevel.value) / 100
    );

    const bottomAmount = Math.round(
        intensity * Number(bottomLevel.value) / 100
    );

    let result = '';

    for (const character of text) {

        // Не спотворюємо пробіли та переноси рядків
        if (character === ' ' || character === '\n' || character === '\t') {
            result += character;
            continue;
        }

        let corrupted = character;

        corrupted = addMarks(
            corrupted,
            topMarks,
            randomNumber(topAmount + 1)
        );

        corrupted = addMarks(
            corrupted,
            middleMarks,
            randomNumber(middleAmount + 1)
        );

        corrupted = addMarks(
            corrupted,
            bottomMarks,
            randomNumber(bottomAmount + 1)
        );

        result += corrupted;
    }

    outputText.textContent = result;
    outputText.style.fontFamily = getFont();
}

// FONT SELECTION

function getFont() {
    const font = fontSelect.value;

    if (font === 'Gothic') {
        return 'Georgia, serif';
    }

    return font;
}

// BUTTON: GENERATE

generateBtn.addEventListener('click', generateZalgo);

// BUTTON: COPY

copyBtn.addEventListener('click', async () => {
    const result = outputText.textContent;

    if (!result || result.includes('Тут з\'явиться')) {
        showToast('Немає тексту для копіювання!');
        return;
    }

    try {
        await navigator.clipboard.writeText(result);
        showToast('Текст скопійовано!');
    } catch (error) {
        showToast('Не вдалося скопіювати текст.');
    }
});

// BUTTON: CLEAR

clearBtn.addEventListener('click', () => {
    inputText.value = '';

    outputText.textContent = 'Тут з\'явиться твій Zalgo-текст...';
    outputText.style.fontFamily = 'Inter, sans-serif';

    showToast('Поля очищено!');
});

// TOAST MESSAGE

let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

// INITIALIZATION

updateSliderLabels();
