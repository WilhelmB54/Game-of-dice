// Constants
const stateGame = {
  player01Count: 0,
  countCurrentPlayer01: 0,
  player02Count: 0,
  countCurrentPlayer02: 0,
  turnCount: 0,
  objectifGame: 100,
};

const holdButton = document.querySelector("#holdButton");
const rollButton = document.querySelector("#rollButton");
const newGameButton = document.querySelector("#newGameButton");
const currentCountPlayer = document.querySelectorAll(".round p");
const playersCount = document.querySelectorAll(".playerCount");
const selectPlayer = document.querySelectorAll(".selectPlayer");
const audioDice = new Audio("audio/diceNoise.mp3");

// Modal window
function showModal(player) {
  const modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal" tabindex="-1" id="mymodal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content ">     
          <div class="modal-body">
            <p class="fs-1 fw-bolder mb-0">${player} wins !</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.append(modalWrap);

  const myModal = new bootstrap.Modal(document.querySelector("#mymodal"));

  myModal.show();
  setTimeout(() => {
    myModal.hide();
    document.body.removeChild(modalWrap);
  }, 2000);
}

function checkWinner(count, objectif, player) {
  if (count >= objectif) {
    showModal(player);
    addNoClickClass(holdButton);
    addNoClickClass(rollButton);
    removeNoClickClass(newGameButton);
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

function addActiveClass(arr, index) {
  arr[index].classList.add("active");
}

function removeActiveClass(arr) {
  arr.forEach((elem) => elem.classList.remove("active"));
}

function addNoClickClass(element) {
  element.classList.add("noclick");
}

function removeNoClickClass(element) {
  element.classList.remove("noclick");
}

// Add result conditions
function addAnimationStack(index, number) {
  const containerCount = document.querySelectorAll(".containerCount");
  const span = document.createElement("span");
  span.innerHTML = `+${number}`;
  span.classList.add("addNumber");
  containerCount[index].appendChild(span);
  setTimeout(() => {
    containerCount[index].removeChild(span);
  }, 1500);
}

// New Game button click
newGameButton.addEventListener("click", (event) => {
  stateGame.player01Count = 0;
  stateGame.player02Count = 0;
  stateGame.playerCurrentPlayer01 = 0;
  stateGame.playerCurrentPlayer02 = 0;
  stateGame.turnCount = Math.round(Math.random());

  currentCountPlayer[0].innerHTML = 0;
  currentCountPlayer[1].innerHTML = 0;
  playersCount[0].innerHTML = 0;
  playersCount[1].innerHTML = 0;

  removeActiveClass(selectPlayer);
  addActiveClass(selectPlayer, stateGame.turnCount);

  addNoClickClass(event.target);

  removeNoClickClass(holdButton);
  removeNoClickClass(rollButton);
});

// Roll button click + Dice conditions
rollButton.addEventListener("click", (e) => {
  audioDice.play();
  const dice = document.querySelector("#diceModel");
  const classIndex = dice.classList.length - 1;
  const randomNumber = Math.round(Math.random() * (6 - 1) + 1);
  const diceClasslistNumber = dice.classList[classIndex].slice(-1);
  const newClass = dice.classList[classIndex].replace(
    diceClasslistNumber,
    randomNumber
  );

  dice.classList.remove(dice.classList[classIndex]);
  dice.classList.add(newClass);

  if (stateGame.turnCount % 2 != 0) {
    if (randomNumber != 1) {
      stateGame.countCurrentPlayer02 += randomNumber;
      currentCountPlayer[1].innerHTML = stateGame.countCurrentPlayer02;
    } else {
      stateGame.countCurrentPlayer02 = 0;
      stateGame.turnCount += 1;
      currentCountPlayer[1].innerHTML = stateGame.countCurrentPlayer02;
      removeActiveClass(selectPlayer);
      addActiveClass(selectPlayer, 0);
    }
  } else {
    if (randomNumber != 1) {
      stateGame.countCurrentPlayer01 += randomNumber;
      currentCountPlayer[0].innerHTML = stateGame.countCurrentPlayer01;
    } else {
      stateGame.countCurrentPlayer01 = 0;
      stateGame.turnCount += 1;
      currentCountPlayer[0].innerHTML = stateGame.countCurrentPlayer01;
      removeActiveClass(selectPlayer);
      addActiveClass(selectPlayer, 1);
    }
  }
});

// Hold button click + checkWinner conditions
holdButton.addEventListener("click", (e) => {
  if (stateGame.turnCount % 2 != 0) {
    stateGame.player02Count += stateGame.countCurrentPlayer02;
    addAnimationStack(1, stateGame.countCurrentPlayer02);
    playersCount[1].innerHTML = stateGame.player02Count;
    stateGame.countCurrentPlayer02 = 0;
    currentCountPlayer[1].innerHTML = stateGame.countCurrentPlayer02;
    stateGame.turnCount += 1;

    checkWinner(stateGame.player02Count, stateGame.objectifGame, "Player 2");
    removeActiveClass(selectPlayer);
    addActiveClass(selectPlayer, 0);
  } else {
    stateGame.player01Count += stateGame.countCurrentPlayer01;
    addAnimationStack(0, stateGame.countCurrentPlayer01);
    playersCount[0].innerHTML = stateGame.player01Count;
    stateGame.countCurrentPlayer01 = 0;
    currentCountPlayer[0].innerHTML = stateGame.countCurrentPlayer01;
    stateGame.turnCount += 1;

    checkWinner(stateGame.player01Count, stateGame.objectifGame, "Player 1");
    removeActiveClass(selectPlayer);
    addActiveClass(selectPlayer, 1);
  }
});
