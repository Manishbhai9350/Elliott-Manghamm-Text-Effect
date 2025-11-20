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
  const SplitedHeroWords = [];

  function InRange(t, range = [0, 0]) {
    if (t >= range[0] && t < range[1])
      return (t - range[0]) / (range[1] - range[0]);
    else return -1;
  }

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
      SplitedHeroWords.push(Splited.words);
    });
  }
  AddImages(Update);
  Split();
  gsap.set([".hero-word-2", ".hero-word-3"], {
    yPercent: 100,
  });

  let Time = 0;

  function UpdateDom(Progress = 0) {
    if (Progress < 0.0009) {
      Progress = 0;
    }
    if (Progress > 0.99) {
      Progress = 1;
    }
    if (Progress <= 0.5) {
      let WordsLength = SplitedHeroWords[0].length + SplitedHeroWords[1].length;
      const Phase2Range = [SplitedHeroWords[0].length / WordsLength / 2,SplitedHeroWords[0].length / 2 / WordsLength + SplitedHeroWords[1].length / WordsLength / 2];
      const RangedProgress = InRange(Progress, Phase2Range);
      if (RangedProgress >= 0) {
        SplitedHeroWords[0].forEach((word, i) => {
          const totalWords = SplitedHeroWords[0].length;
          const wordProgress = i / (totalWords - 1);
          let wordRangedProgress = Math.max(Math.min(Progress - wordProgress,wordProgress),0)
          console.log(wordRangedProgress / wordProgress * 100)
          gsap.set(word,{
            yPercent:wordRangedProgress / wordProgress * 100
          })
        });
      }
    } else if (Progress > 0.5) {
      let WordsLength = SplitedHeroWords[1].length + SplitedHeroWords[2].length;
      const Phase2Range = [
        0.5 + SplitedHeroWords[1].length / WordsLength / 2,
        0.5 +
          SplitedHeroWords[1].length / WordsLength / 2 +
          SplitedHeroWords[2].length / WordsLength / 2,
      ];
      const RangedProgress = InRange(Progress, Phase2Range);
      if (RangedProgress >= 0) {
      }
    }
  }

  function Update(t = 0) {
    let DT = t - Time;
    Time = t;
    let PrevScroll = ScrollValue;

    ScrollValue +=
      (TargetScrollValue - ScrollValue) * DT * EasingFactors.Scroll;
    Progress = Math.min(Math.max(ScrollValue / 100, 0), 1);

    // if(Progress - Math.floor(Progress) >= .99) Progress = Math.ceil(Progress)

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
