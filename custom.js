document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const inputs = form.querySelectorAll("input");
  const phoneInput = form.querySelector("input[name='telefonas']");

  function validateField(input) {
    const value = input.value.trim();
    const errorBox = input.parentElement.querySelector(".error-text");

    input.classList.remove("input-error");
    if (errorBox) errorBox.textContent = "";

    if (value === "") {
      input.classList.add("input-error");
      if (errorBox) errorBox.textContent = "Šis laukas negali būti tuščias.";
      return false;
    }

    if ((input.name === "vardas" || input.name === "pavarde") &&
        !/^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/.test(value)) {
      input.classList.add("input-error");
      if (errorBox) errorBox.textContent = "Laukas turi būti sudarytas tik iš raidžių.";
      return false;
    }

    if (input.name === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      input.classList.add("input-error");
      if (errorBox) errorBox.textContent = "Neteisingas el. pašto formatas.";
      return false;
    }

    if (input.name === "adresas" &&
        !/^[A-Za-z0-9ĄČĘĖĮŠŲŪŽąčęėįšųūž .,-]+$/.test(value)) {
      input.classList.add("input-error");
      if (errorBox) errorBox.textContent =
        "Adresą turi sudaryti tik raidės, skaičiai ir tarpai.";
      return false;
    }

    return true;
  }

  function checkFormValidity() {
    let formIsValid = true;

    inputs.forEach(input => {
      if (input.name !== "telefonas") {
        const value = input.value.trim();
        if (value === "" || input.classList.contains("input-error")) {
          formIsValid = false;
        }
      } else {
        // telefono skaitmenys
        const digits = input.value.replace(/\D/g, "");
        if (digits.length < 11) { // 3706 + 7 skaičiai
          formIsValid = false;
        }
      }
    });

    if (formIsValid) {
      submitBtn.removeAttribute("disabled");
    } else {
      submitBtn.setAttribute("disabled", "true");
    }
  }

  inputs.forEach(input => {
    if (input.name !== "telefonas") {
      input.addEventListener("input", function () {
        validateField(input);
        checkFormValidity();
      });
    }
  });

phoneInput.addEventListener("input", function () {
    let cursorPos = this.selectionStart;

    let digits = this.value.replace(/\D/g, "");

    if (!digits.startsWith("3706")) {
        if (digits.startsWith("6")) {
            digits = "370" + digits;
        } else if (digits.startsWith("370")) {
            if (digits.length === 3) digits = "3706";
        } else {
            digits = "3706";
        }
    }

    digits = digits.slice(0, 11);

    let formatted = "+370 ";

    if (digits.length >= 4)
        formatted += digits[3];

    if (digits.length >= 6)
        formatted += digits.slice(4, 6);
    else if (digits.length > 4)
        formatted += digits.slice(4);

    if (digits.length > 6)
        formatted += " " + digits.slice(6);

    this.value = formatted;

    let newCursorPos = cursorPos + (this.value.length - formatted.length);
    this.setSelectionRange(this.value.length, this.value.length);

    checkFormValidity();
});

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    checkFormValidity();
    if (submitBtn.disabled) return;

    const formData = {
      vardas: form.querySelector("[name='vardas']").value.trim(),
      pavarde: form.querySelector("[name='pavarde']").value.trim(),
      email: form.querySelector("[name='email']").value.trim(),
      telefonas: form.querySelector("[name='telefonas']").value.trim(),
      adresas: form.querySelector("[name='adresas']").value.trim(),
      klausimas1: form.querySelector("[name='klausimas1']").value,
      klausimas2: form.querySelector("[name='klausimas2']").value,
      klausimas3: form.querySelector("[name='klausimas3']").value
    };

    console.log("Formos duomenys:", formData);

    const resultsBox = document.getElementById("form-results");
    const resultsContent = document.getElementById("results-content");

    const vidurkis =
      (Number(formData.klausimas1) +
       Number(formData.klausimas2) +
       Number(formData.klausimas3)) / 3;

    resultsContent.innerHTML = `
      <p><strong>Vardas:</strong> ${formData.vardas}</p>
      <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
      <p><strong>El. paštas:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
      <p><strong>Tel. numeris:</strong> ${formData.telefonas}</p>
      <p><strong>Adresas:</strong> ${formData.adresas}</p>
      <p><strong>Klausimas 1:</strong> ${formData.klausimas1}/10</p>
      <p><strong>Klausimas 2:</strong> ${formData.klausimas2}/10</p>
      <p><strong>Klausimas 3:</strong> ${formData.klausimas3}/10</p>
      <hr>
      <p><strong>${formData.vardas} ${formData.pavarde}:</strong> vidurkis ${vidurkis.toFixed(1)}</p>
    `;

    resultsBox.style.display = "block";

    const popup = document.getElementById("success-popup");
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000);
  });

});

const icons = ["🍎", "🍌", "🍒", "🍇", "🍉", "🥝"];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let ejimai = 0;
let poros = 0;

const gameBoard = document.getElementById("gameBoard");
const ejimaiEl = document.getElementById("ejimai");
const porosEl = document.getElementById("poros");
const difficultySelect = document.getElementById("sudetingumas");
const winMessage = document.getElementById("winMessage");

function generateBoard() {
  let difficulty = difficultySelect.value;

  let totalCards = difficulty === "easy" ? 12 : 24;
  let uniqueCount = totalCards / 2;

  let pool = [];
  for (let i = 0; i < uniqueCount; i++) {
    pool.push(icons[i % icons.length]);
  }

  cards = [...pool, ...pool];

  cards.sort(() => Math.random() - 0.5);

  gameBoard.innerHTML = "";
  winMessage.textContent = "";
  ejimai = 0;
  poros = 0;
  ejimaiEl.textContent = 0;
  porosEl.textContent = 0;

  gameBoard.style.gridTemplateColumns =
    difficulty === "easy" ? "repeat(4, 90px)" : "repeat(6, 90px)";

  cards.forEach((icon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.textContent = icon;

    card.addEventListener("click", () => flipCard(card));

    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard) return;
  if (card === firstCard) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  ejimai++;
  ejimaiEl.textContent = ejimai;

  checkMatch();
}

function checkMatch() {
  let match = firstCard.dataset.icon === secondCard.dataset.icon;

  if (match) {
    poros++;
    porosEl.textContent = poros;

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    if (poros === cards.length / 2) {
      winMessage.textContent = "You won! 🎉";
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 800);
  }
}

document.getElementById("startGame").addEventListener("click", function () {
  startTimer();
  generateBoard();
});

document.getElementById("restartGame").addEventListener("click", function () {
  stopTimer();
  startTimer();
  generateBoard();
});

let timer = null;
let seconds = 0;
const laikasEl = document.getElementById("laikas");

function startTimer() {
  seconds = 0;
  laikasEl.textContent = "0";

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    seconds++;
    laikasEl.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

const geriausiasEl = document.getElementById("geriausias");

function getBestScore(level) {
  return localStorage.getItem("best_" + level);
}

function saveBestScore(level, value) {
  localStorage.setItem("best_" + level, value);
}

function showBestScore() {
  let level = difficultySelect.value;
  let best = getBestScore(level);

  geriausiasEl.textContent = best ? best : "-";
}

const originalGenerateBoard = generateBoard;

generateBoard = function () {
  originalGenerateBoard();
  startTimer();
  showBestScore();
};

const originalCheckMatch = checkMatch;

checkMatch = function () {
  originalCheckMatch();

  if (poros === cards.length / 2) {

    stopTimer();

    let level = difficultySelect.value;
    let best = getBestScore(level);

    // naujas rekordas?
    if (!best || ejimai < best) {
      saveBestScore(level, ejimai);
      geriausiasEl.textContent = ejimai;
    }
  }
};