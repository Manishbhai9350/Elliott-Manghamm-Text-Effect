import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./style.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(SplitText, ScrollTrigger);

const lenis = new Lenis();

lenis.on("scroll", () => ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

const TotalImages = 6;

window.addEventListener("DOMContentLoaded", () => {
  const ImageContainer = document.querySelector(".hero-section .images");
  const HeroTexts = gsap.utils.toArray(".hero-section .texts h1");
  const SplitedHeroWords = [];

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
  gsap.set([".hero-word-2", ".hero-word-3"], {
    yPercent: 100,
  });

  // const TL1 = gsap.timeline({
  //   onComplete() {
  //     gsap.to(SplitedHeroWords[0], {
  //       yPercent: 100,
  //     });
  //     gsap.to(SplitedHeroWords[1], {
  //       yPercent: 0,
  //     });
  //     gsap.to(SplitedHeroWords[2], {
  //       yPercent: 100,
  //     });
  //   },
  //   onReverseComplete(){
  //     gsap.to(SplitedHeroWords[2], {
  //       yPercent: 100,
  //     });
  //     gsap.to(SplitedHeroWords[1], {
  //       yPercent: 100,
  //     });
  //     gsap.to(SplitedHeroWords[0], {
  //       yPercent: 0,
  //     });
  //   },
  //   onUpdate(){
  //     gsap.to(SplitedHeroWords[2], {
  //       yPercent: 100,
  //     });
  //   },
  //   scrollTrigger: {
  //     trigger: ".hero-section",
  //     start: `top top`,
  //     end: `+=${(innerHeight * 7) / 3}px`,
  //     markers: {
  //       startColor: "yellow",
  //       endColor: "purple",
  //     },
  //     scrub:true
  //   },
  // });
  // TL1.to(
  //   SplitedHeroWords[0],
  //   {
  //     yPercent: 100,
  //     stagger: 0.1,
  //   }
  //   // "<"
  // );
  // TL1.to(
  //   SplitedHeroWords[1],
  //   {
  //     yPercent: 0,
  //     stagger: 0.1,
  //   }
  //   // "<"
  // );
  // const TL2 = gsap.timeline({
  //   onComplete() {
  //     gsap.to(SplitedHeroWords[0], {
  //       yPercent: 100,
  //     });
  //     gsap.to(SplitedHeroWords[1], {
  //       yPercent: 100,
  //     });
  //     gsap.to(SplitedHeroWords[2], {
  //       yPercent: 0,
  //     });
  //   },
  //   onReverseComplete(){
  //     gsap.to(SplitedHeroWords[2], {
  //       yPercent: 100,
  //     });
  //     gsap.to(SplitedHeroWords[1], {
  //       yPercent: 0,
  //     });
  //     gsap.to(SplitedHeroWords[0], {
  //       yPercent: 100,
  //     });
  //   },
  //   onUpdate(){
  //     gsap.to(SplitedHeroWords[0], {
  //       yPercent: 100,
  //     });
  //   },
  //   scrollTrigger: {
  //     trigger: ".hero-section",
  //     start: `top -${(innerHeight * 7) / 2}px`,
  //     end: `+=${(innerHeight * 7) / 3}px`,
  //     scrub:true
  //   },
  // });
  // TL2.to(SplitedHeroWords[1], {
  //   yPercent: 100,
  //   stagger: 0.1,
  // });
  // TL2.to(
  //   SplitedHeroWords[2],
  //   {
  //     yPercent: 0,
  //     stagger: 0.1,
  //   }
  //   // "<"
  // );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: `+=${innerHeight * 10}px`,
      scrub: 2,
      pin: true,
      markers: true,
    },
  });

  // 1️⃣ Word 1 out
  tl.to(SplitedHeroWords[0], { stagger:.1,yPercent: 100 });

  // 2️⃣ Word 2 in
  tl.to(SplitedHeroWords[1], { stagger:.1,yPercent: 0 },'<');

  // 3️⃣ Word 2 out
  tl.to(SplitedHeroWords[1], { stagger:.1,yPercent: 100 });

  // 4️⃣ Word 3 in
  tl.to(SplitedHeroWords[2], { stagger:.1,yPercent: 0 },'<');

  // ScrollTrigger.create({
  //   trigger: ".hero-section",
  //   start: "top top",
  //   end: `+=${innerHeight * 7}px`,
  //   pin: true,
  // });
});


// const overlapCount = 3;

// const getWOrdProgress = (phaseProgress, wordIndex, totalWords) => {
// const totalLength = 1 + overlapCount / totalWords;

// const scale = 1 / Math.min(
// totalLength, 1 + (totalWords - 1) / totalWords + overlapCount / totalWords
// );

// const startTime = (wordIndex / totalWords) * scale;
// const endTime = startTime + overlapCount / totalWords * scale
// const duration = endTime - startTime;

// if(phaseProgress <= startTime) return 0
// if(phaseProgress >= endTime) return 1
// return (endTime - startTime) / duration 

// }

// First tell me what problem is this funcion solving