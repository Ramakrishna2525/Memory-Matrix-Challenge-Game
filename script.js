const cards = document.querySelectorAll(".card"),
  timeTag = document.querySelector(".time b"),
  flipsTag = document.querySelector(".flips b"),
  accuracyBtn = document.querySelector(".accuracy-btn"),
  accuracyDisplay = document.getElementById("accuracy-display"),
  refreshBtn = document.querySelector(".details button"),
  startBtn = document.getElementById("start-game");

let maxTime = 50;
let timeLeft = maxTime;
let flips = 0;
let matchedCards = 0;
let hintsRemaining = 3;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

function initTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    timeTag.innerText = "0";
    alert("Your time is over!");
    return;
  }
  timeLeft--;
  timeTag.innerText = timeLeft;
}

function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(initTimer, 1000);
  }
  if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
    flips++;
    flipsTag.innerText = flips;
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneIcon = cardOne.querySelector(".back-view i").classList.value;
    cardTwoIcon = cardTwo.querySelector(".back-view i").classList.value;
    matchCards(cardOneIcon, cardTwoIcon);
  }
}

function matchCards(icon1, icon2) {
  if (icon1 === icon2) {
    matchedCards++;
    if (matchedCards == 6 && timeLeft > 0) {
      clearInterval(timer);
      calculateAccuracy();
      displayGrade();
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCards() {
  timeLeft = maxTime;
  flips = matchedCards = 0;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = timeLeft;
  flipsTag.innerText = flips;
  accuracyBtn.innerText = "Show Accuracy";
  disableDeck = isPlaying = false;

  let arr = [
    "bxl-tiktok",
    "bxl-instagram-alt",
    "bxl-facebook-circle",
    "bxl-twitter",
    "bxl-whatsapp",
    "bxl-youtube",
    "bxl-tiktok",
    "bxl-instagram-alt",
    "bxl-facebook-circle",
    "bxl-twitter",
    "bxl-whatsapp",
    "bxl-youtube"
  ];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let iconTag = card.querySelector(".back-view i");
    setTimeout(() => {
      iconTag.classList.value = `bx ${arr[index]}`;
    }, 500);
    card.addEventListener("click", flipCard);
  });
}

function calculateAccuracy() {
  const accuracy = ((matchedCards / flips) * 100).toFixed(2);
  accuracyBtn.innerText = `Accuracy: ${accuracy}%`;
}

function displayGrade() {
  const accuracy = parseFloat(((matchedCards / flips) * 100).toFixed(2));
  let grade = "";
  if (accuracy >= 50) {
    grade = "Pro";
  } else if (accuracy >= 40) {
    grade = "Good";
  } else if (accuracy >= 30) {
    grade = "Average";
  } else if (accuracy >= 20) {
    grade = "Pretty normal";
  } else {
    grade = "Low";
  }
  alert(`Your grade: ${grade}`);
}

startBtn.addEventListener("click", () => {
  const inputTime = parseInt(document.getElementById("max-time").value);
  if (!isNaN(inputTime) && inputTime > 0) {
    maxTime = inputTime;
    shuffleCards();
  } else {
    alert("Please enter a valid positive number for max time.");
  }
});

refreshBtn.addEventListener("click", shuffleCards);

cards.forEach(card => {
  card.addEventListener("click", flipCard);
});
