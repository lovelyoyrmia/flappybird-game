import { updateBird, setupBird, getBirdRect } from "./bird.js";
import {
  updatePipes,
  setupPipes,
  getPassedPipesCount,
  getPipeRects,
} from "./pipe.js";

document.addEventListener("keypress", handleStart, { once: true });
const title = document.querySelector("[data-title]");
const subtitle = document.querySelector("[data-subtitle]");
const subheader = document.querySelector("[data-subheader]");
// const score = document.querySelector("[data-score]");
const flySound = new Audio();
const scoreSound = new Audio();

flySound.src = "sounds/fly.mp3";
scoreSound.src = "sounds/score.mp3";

// let pipesCount = 0;
let lastTime;

function updateLoop(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
    return;
  }
  const delta = time - lastTime;
  updateBird(delta);
  updatePipes(delta);

  if (checkLose()) {
    return handleLose();
  }
  // pipesCount += 1;
  lastTime = time;
  window.requestAnimationFrame(updateLoop);
}

function checkLose() {
  const birdRect = getBirdRect();
  const insidePipe = getPipeRects().some((rect) => isCollision(birdRect, rect));
  const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight;

  return outsideWorld || insidePipe;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function handleStart() {
  title.classList.add("hide");
  subheader.classList.remove("hide");
  // score.classList.remove("hide");
  // score.textContent = `${pipesCount}`;
  flySound.play();
  setupBird();
  setupPipes();
  lastTime = null;
  window.requestAnimationFrame(updateLoop);
}

function handleLose() {
  setTimeout(() => {
    title.classList.remove("hide");
    subtitle.classList.remove("hide");
    subheader.classList.add("hide");
    subtitle.textContent = `You've got ${getPassedPipesCount()} pipes`;
    document.addEventListener("keypress", handleStart, { once: true });
  }, 100);
}
