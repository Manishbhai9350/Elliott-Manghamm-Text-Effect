import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./style.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(SplitText, ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  const ImageContainer = document.querySelector(".hero-section .images");
  const HeroTexts = gsap.utils.toArray(".hero-section .texts h1");
  const SplitedHeroWords = [];

  const TargetVelocity = 0;
  const Velocity = 0;

  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    update({p:e.progress,v:e.velocity})
    ScrollTrigger.update();
  });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const TotalImages = 6;

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
  AddImages();
  Split();
  gsap.set([SplitedHeroWords[1], SplitedHeroWords[2]], {
    yPercent: 100,
  });

  
  const overlapCount = 3;

  const getWordProgress = (phaseProgress, wordIndex, totalWords) => {
    const totalLength = 1 + overlapCount / totalWords;
    
    
    const scale =
    1 /
    Math.min(
      totalLength,
      1 + (totalWords - 1) / totalWords + overlapCount / totalWords
    );
    
    const startTime = (wordIndex / totalWords) * scale;
    const endTime = startTime + (overlapCount / totalWords) * scale;
    const duration = endTime - startTime;

    if (phaseProgress <= startTime) return 0;
    if (phaseProgress >= endTime) return 1;
    return (endTime - startTime) / duration;
  };

  const update = ({p = 0,v = 0}) => {
    gsap.set("nav .velocity .line", {
      scaleX: Math.min(Math.abs(v) * 0.01, 1),
    });

    if(p <= .5) {
      SplitedHeroWords[0].forEach((w,i,a) => {
        const wordProgress = getWordProgress(p/.5,i,a.length)
        gsap.to(w,{
          yPercent:wordProgress * 100
        })
      })
      SplitedHeroWords[1].forEach((w,i,a) => {
        const wordProgress = getWordProgress(p/.5,i,a.length)
        gsap.to(w,{
          yPercent:(1-wordProgress) * 100
        })
      })
      gsap.to(SplitedHeroWords[2],{yPercent:100})
    } else {
      SplitedHeroWords[1].forEach((w,i,a) => {
        const wordProgress = getWordProgress((p-.5)/.5,i,a.length)
        gsap.to(w,{
          yPercent:wordProgress * 100
        })
      })
      SplitedHeroWords[2].forEach((w,i,a) => {
        const wordProgress = getWordProgress((p-.5)/.5,i,a.length)
        gsap.to(w,{
          yPercent:(1-wordProgress) * 100
        })
      })
      gsap.to(SplitedHeroWords[0],{yPercent:100})
    }

  }

  ScrollTrigger.create({
    trigger: ".hero-section",
    start: "top top",
    end: `+=${innerHeight * 10}px`,
    pin: true,
  });
});

