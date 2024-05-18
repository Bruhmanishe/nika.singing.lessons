"use strict";

const wrapper = document.querySelector(".wrapper");
const loadinfScreen = document.getElementById("loadingScreen");

const navButtons = document.querySelectorAll(".header__nav-button");
const siteBlocks = document.querySelectorAll(".main-block");
const nav = document.querySelector("header");

const burgerMenu = createElement("div", "burger-menu");
const btnsDiv = navButtons[0].parentElement;
btnsDiv.parentElement.append(burgerMenu);

const btnsDivClone = btnsDiv.cloneNode(true);

const navBtnVolume = document.querySelector(".header__no-sound-btn");

const showFullTextBtns = document.querySelectorAll(".main-block__showtxt-btn");

let volumeOff = false;
let smallWindow = false;
let arrayOfBtns = [];
let burgerMenuShowed = false;
let freq = [
  261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995,
  415.305, 440.0, 466.164, 493.883,
];
let windowLoaded = false;

class Bounds {
  constructor(el) {
    this.left = el.getBoundingClientRect().left + scrollX;
    this.right = el.getBoundingClientRect().left + scrollX + el.offsetWidth;
    this.top = el.getBoundingClientRect().top + scrollY;
    this.bottom = el.getBoundingClientRect().top + scrollY + el.offsetHeight;
    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
  }
}

function loadinScreeen() {
  if (!windowLoaded) {
    wrapper.classList.add("display-none");
  } else {
    wrapper.classList.remove("display-none");
    loadinfScreen.classList.add("display-none");
  }
}

loadinScreeen();

window.onload = () => {
  windowLoaded = true;
  adaptiveSize();
  window.addEventListener("scroll", attachHeader);
  navButtons.forEach((el) =>
    el.addEventListener("click", (e) => {
      arrayOfBtns = navButtons;
      clickOnButtonNav(e);
    })
  );
  navBtnVolume.addEventListener("click", offNavBtnSound);
  window.addEventListener("resize", adaptiveSize);
  showFullTextBtns.forEach((el) => el.addEventListener("click", showFullText));

  setTimeout(() => {
    loadinScreeen();
  }, 1000);
};

function attachHeader(e) {
  let navBounds = new Bounds(nav);
  if (navBounds.top - scrollY < 0 && !document.querySelector(".headerClone")) {
    const clone = nav.cloneNode(true);
    let burgerMenu = clone.querySelector(".burger-menu");
    let buttons = clone.querySelectorAll(".header__nav-button");
    buttons.forEach((el) =>
      el.addEventListener("click", (e) => {
        arrayOfBtns = buttons;
        clickOnButtonNav(e);
      })
    );
    clone.classList.add("headerClone");
    clone.style.position = "fixed";
    clone.style.zIndex = "1000";
    wrapper.append(clone);
    nav.children[0].style.display = "none";
    const navBtnVolume = document.querySelector(
      ".headerClone .header__no-sound-btn"
    );
    navBtnVolume.addEventListener("click", offNavBtnSound);
    burgerMenu.addEventListener("click", openBurgerMenu);
  } else if (
    navBounds.top - scrollY === 0 &&
    document.querySelector(".headerClone")
  ) {
    document.querySelector(".headerClone").remove();
    nav.children[0].style.display = "flex";
  }
}

function clickOnButtonNav(e) {
  if (!volumeOff) {
    for (let i = 0; arrayOfBtns.length > i; i++) {
      if (e.target == arrayOfBtns[i]) {
        let duration = 0.4;
        let audioCtx = new AudioContext();
        let osc = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.2,
          audioCtx.currentTime + 0.005
        );
        gainNode.gain.linearRampToValueAtTime(
          0,
          audioCtx.currentTime + duration
        );

        osc.frequency.value = freq[i];
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        audioCtx = null;
      }
    }
  }

  for (let i = 0; siteBlocks.length > i; i++) {
    if (e.target == arrayOfBtns[i]) {
      const blockBounds = new Bounds(siteBlocks[i]);

      scrollTo({
        top: blockBounds.top - 100,
        left: 0,
        behavior: "smooth",
      });
    }
  }
}

function offNavBtnSound(e) {
  if (volumeOff === false) {
    volumeOff = true;
    e.target.textContent = "🔈";
  } else {
    volumeOff = false;
    e.target.textContent = "🔊";
  }
}

function createElement(type, clas) {
  const element = document.createElement(type);
  element.classList.add(clas);
  return element;
}

function createCloneElement(elem) {
  return elem.cloneNode(true);
}

function adaptiveSize(e) {
  if (window.matchMedia("(max-width: 750px)").matches && !smallWindow) {
    btnsDiv.classList.add("display-none");
    burgerMenu.classList.remove("display-none");
    burgerMenu.addEventListener("click", openBurgerMenu);
  } else if (window.matchMedia("(min-width: 750px)").matches) {
    btnsDiv.classList.remove("display-none");
    burgerMenu.classList.add("display-none");
  }
}

function openBurgerMenu(e) {
  btnsDivClone.classList.add("burger-menu-nav");
  btnsDivClone.classList.remove("display-none");
  btnsDivClone.style.left = "100%";

  if (!burgerMenuShowed) {
    let buttons = btnsDivClone.querySelectorAll(".header__nav-button");
    let offVolumeBtn = btnsDivClone.querySelector(".header__no-sound-btn");
    offVolumeBtn.addEventListener("click", offNavBtnSound);
    wrapper.append(btnsDivClone);
    buttons.forEach((el) =>
      el.addEventListener("click", (e) => {
        arrayOfBtns = buttons;
        clickOnButtonNav(e);
      })
    );
    burgerMenuShowed = true;
    btnsDivClone.style.animation = "none";
    btnsDivClone.style.animation =
      "burger-menu-entry 0.5s linear 0.05s forwards";
  } else {
    burgerMenuShowed = false;
    btnsDivClone.style.animation = "none";
    btnsDivClone.style.animation = "burger-menu-out 0.5s linear 0.05s forwards";
    setTimeout(() => {
      btnsDivClone.remove();
    }, 550);
  }
}

function showFullText(e) {
  e.stopImmediatePropagation();
  const content = e.target.parentElement;
  const text = content.querySelector(".main-block__txt");
  if (!text.hasAttribute("opened")) {
    text.setAttribute("opened", "");
    let textHeight = 0;
    let textChildren = text.children;
    for (let child of textChildren) {
      const height = new Bounds(child).height;
      textHeight += height;
    }

    text.style.height = `${textHeight}px`;
    e.target.textContent = "Скрыть текст";
  } else {
    text.removeAttribute("opened");
    text.style.height = `${70}px`;
    e.target.textContent = "Развернуть текст";
  }

  console.log(text);
}
