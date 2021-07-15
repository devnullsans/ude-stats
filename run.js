const Data = JSON.parse(localStorage.getItem('UDEsave')) ?? {};

const showLS = document.getElementById('ls');
const searchOP = document.getElementById('op');
const priceIN = document.getElementById('dp');
const nameIN = document.getElementById('dn');
const pushFM = document.getElementById('pd');

searchOP.onclick = function(ev) {
  nameIN.value = ev.target.textContent;
  priceIN.focus();
};

nameIN.oninput = function() {
  searchOP.innerHTML = Object.keys(Data).filter(name => name.startsWith(nameIN.value.toLowerCase())).map(text => `<p>${text}</p>`).join('');
};

nameIN.onfocus = function() {
  searchOP.innerHTML = Object.keys(Data).filter(name => name.startsWith(nameIN.value.toLowerCase())).map(text => `<p>${text}</p>`).join('');
  searchOP.style.visibility = 'visible';
}

nameIN.onblur = function() {
  setTimeout(() => {
    searchOP.innerHTML = '';
    searchOP.style.visibility = 'hidden';
  }, 50);
};


pushFM.onsubmit = function(ev) {
  ev.preventDefault();
  if (nameIN.value.length < 1 || priceIN.value.length < 1) return;
  const name = nameIN.value.toLowerCase();
  const price = Number(priceIN.value);
  const got = Data[name];
  if (got) {
    got.red.push(price);
    got.min = Math.min(...got.red);
    got.max = Math.max(...got.red);
    got.dif = Math.floor((got.max + got.min) / 2);
    got.avg = Math.round(got.red.reduce((s, n) => s + n) / got.red.length);
    const el = document.getElementById(name);
    el.children[1].innerText = got.min;
    el.children[2].innerText = got.avg;
    el.children[3].innerText = got.dif;
    el.children[4].innerText = got.max;
  } else {
    Data[name] = {
      red: [price],
      min: price,
      max: price,
      dif: price,
      avg: price,
    };
    const el = document.createElement('article');
    el.innerHTML = `<div class="tx"></div><div class="mv">${price}</div><div class="mv">${price}</div><div class="mv">${price}</div><div class="mv">${price}</div>`;
    el.firstElementChild.innerText = el.id = name;
    showLS.appendChild(el);
  }
  pushFM.reset();
  nameIN.focus();
};

window.onload = function() {
  showLS.innerHTML = Object.entries(Data).map(([key, { min, avg, dif, max }]) => `<article id="${key}"><div class="tx">${key}</div><div class="mv">${min}</div><div class="mv">${avg}</div><div class="mv">${dif}</div><div class="mv">${max}</div></article>`).join('');
};

window.onbeforeunload = function() {
  localStorage.setItem('UDEsave', JSON.stringify(Data));
};
