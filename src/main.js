import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./style.css";

gsap.registerPlugin(SplitText);

const TotalImages = 6;

window.addEventListener("DOMContentLoaded", () => {
  let ScrollValue = 0;
  let TargetScrollValue = 0;
  let Velocity = 0;
  let MaxVelocity = 4;
  let EasingFactors = {
    Scroll: 0.001,
  };
  let Progress = 0;

  const ImageContainer = document.querySelector(".hero-section .images");
  const HeroTexts = gsap.utils.toArray(".hero-section .texts h1");
  const SplitedHeroTexts = [];
  const AllWords = []

  function AddImages(onLoad = () => {}) {
    let loaded = 0;
    ImageContainer.innerHTML = "";
    for (let i = 1; i <= TotalImages; i++) {
      const src = `/${i}.jpg`;
      const imagecon = document.createElement("div");
      imagecon.classList.add("image");
      const image = new Image();
      image.src = src;
      imagecon.appendChild(image);
      ImageContainer.appendChild(imagecon);
      image.onload = () => {
        loaded++;
        if (loaded == TotalImages) onLoad();
      };
    }
  }
  function Split() {
    HeroTexts.forEach((HeroText, i) => {
      const Splited = new SplitText(HeroText, {
        type: ["words", "lines"],
        wordsClass: `hero-word-${i + 1}`,
        mask: "lines",
      });
      AllWords.push(...Splited.words)
      SplitedHeroTexts.push(Splited);
    });
  }
  AddImages(Update);
  Split();
  gsap.set([".hero-word-2", ".hero-word-3"], {
    yPercent: 100,
  });

  let Time = 0;

  function UpdateDom(p = 0) {
    AllWords.forEach((Word,i) => {
      const WordP = (i + 1) / AllWords.length;
      
    })
  }

  function Update(t = 0) {
    let DT = t - Time;
    Time = t;
    let PrevScroll = ScrollValue;

    ScrollValue +=
      (TargetScrollValue - ScrollValue) * DT * EasingFactors.Scroll;
    Progress = Math.min(Math.max(ScrollValue / 100, 0), 1);

    Velocity = ScrollValue - PrevScroll;

    if (ScrollValue - Math.floor(ScrollValue) >= 0.999) {
      ScrollValue = Math.ceil(ScrollValue);
    }

    UpdateDom(Progress);

    requestAnimationFrame(Update);
  }

  window.addEventListener("wheel", (e) => {
    TargetScrollValue += e.deltaY / 100;
    // console.log(Math.max(Math.min(TargetScrollValue,100),0))
    TargetScrollValue = Math.max(Math.min(TargetScrollValue, 100), 0);
  });
});
