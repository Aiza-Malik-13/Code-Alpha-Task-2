const display = document.getElementById('display');
let current = '';
let resultDisplayed = false;

function updateDisplay(val) {
  display.textContent = val;
}

function safeEval(expr) {
  try {
    // Only allow numbers, operators, and decimal
    if (/^[0-9+\-*/.() ]+$/.test(expr)) {
      // Replace multiple operators
      let sanitized = expr.replace(/\u2212/g, '-');
      let res = Function('return ' + sanitized)();
      if (res === Infinity || res === -Infinity) return '∞';
      if (isNaN(res)) return 'Error';
      return res;
    }
    return 'Error';
  } catch {
    return 'Error';
  }
}

function handleInput(val) {
  if (resultDisplayed && /[0-9.]/.test(val)) {
    current = '';
    resultDisplayed = false;
  }
  if (val === 'clear') {
    current = '';
    updateDisplay('0');
    resultDisplayed = false;
    return;
  }
  if (val === 'sqrt') {
    let num = safeEval(current);
    if (typeof num === 'number' || (!isNaN(num) && num !== 'Error')) {
      let sqrtVal = Math.sqrt(Number(num));
      updateDisplay(sqrtVal);
      current = sqrtVal.toString();
      resultDisplayed = true;
    } else {
      updateDisplay('Error');
      resultDisplayed = true;
    }
    return;
  }
  if (val === '=') {
    let res = safeEval(current);
    updateDisplay(res);
    current = res.toString();
    resultDisplayed = true;
    return;
  }
  if (/[+\-*/.]/.test(val)) {
    if (current === '' && val !== '-') return;
    if (/[+\-*/.]$/.test(current) && /[+\-*/.]/.test(val)) {
      current = current.slice(0, -1) + val;
    } else {
      current += val;
    }
  } else {
    current += val;
  }
  // Only show the input expression, not the evaluated result
  updateDisplay(current === '' ? '0' : current);
}

document.querySelectorAll('button[data-action]').forEach(btn => {
  btn.addEventListener('click', e => {
    let val = btn.getAttribute('data-action');
    handleInput(val);
  });
});

// Keyboard support
document.addEventListener('keydown', e => {
  let key = e.key;
  if (key === 'Enter' || key === '=') {
    handleInput('=');
    e.preventDefault();
  } else if (key === 'Escape' || key.toLowerCase() === 'c') {
    handleInput('clear');
    e.preventDefault();
  } else if (key.toLowerCase() === 'r') {
    handleInput('sqrt');
    e.preventDefault();
  } else if ('0123456789.+-*/'.includes(key)) {
    handleInput(key);
    e.preventDefault();
  }
});

// Calculator cover open/close logic
window.addEventListener('DOMContentLoaded', () => {
  const cover = document.getElementById('calc-cover');
  const calculator = document.getElementById('calculator');
  let isOpen = false;
  if (cover && calculator) {
    cover.addEventListener('click', () => {
      isOpen = !isOpen;
      calculator.classList.toggle('open', isOpen);
      cover.textContent = isOpen ? 'Close Calculator' : 'Open Calculator';
    });
  }
}); 