import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./style.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import GUI from "lil-gui";

gsap.registerPlugin(SplitText, ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  const ImageContainer = document.querySelector(".images");
  const HeroTexts = gsap.utils.toArray(".hero-section .texts h1");
  const SplitedHeroWords = [];
  const Images = [];

  const TotalImages = 6 * 4;
  let Velocity = 0;
  let TargetVelocity = 0;
  let MaxVelocity = 100;
  let aspect = 4 / 3;
  const { width: ImageWidth, height: ImageHeight } = CalculateImageDimensions();

  // const lil = new GUI();

  const rad = {
    factor: 1,
    phi: 0,
    gap: 7,
  };

  // lil
  //   .add(rad, "factor")
  //   .min(0)
  //   .max(100)
  //   .name("Radius factor")
  //   .onChange((e) => {
  //     PlaceImages();
  //   });
  // lil
  //   .add(rad, "phi")
  //   .min(0)
  //   .max(2 * Math.PI)
  //   .name("PHI Offset")
  //   .onChange((e) => {
  //     PlaceImages();
  //   });
  // lil
  //   .add(rad, "gap")
  //   .min(0)
  //   .max(50)
  //   .name("Gap")
  //   .onChange((e) => {
  //     PlaceImages();
  //   });

  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    update({ p: e.progress, v: e.velocity });
    ScrollTrigger.update();
  });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  function Radius(size = 0, gap = 0, numberOfImages = 0) {
    return (2 * (size + gap)) / ((2 * Math.PI) / numberOfImages);
  }

  function CalculateImageDimensions() {
    const width = innerWidth <= 900 ? 100 : 300;
    const height = width * aspect;
    return { width, height };
  }

  function CalculateOrigin(radius = 0, gap = 0) {
    const x = innerWidth / 2;
    const y = innerWidth <= 900 ? innerHeight * 0.7 : innerHeight * 0.8;

    return [x, y + radius + 50];
  }

  function PlaceImages() {
    const radius = Radius(ImageWidth, rad.gap, TotalImages);
    const Origin = CalculateOrigin(radius, rad.gap);
    for (let i = 0; i < TotalImages; i++) {
      const theta = (i / TotalImages) * 2 * Math.PI + Math.PI / 2 + rad.phi;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;

      const fx = innerWidth / 2 + x - ImageWidth / 2;
      const fy = innerHeight / 2 + y - ImageHeight / 2;

      gsap.set(".images", {
        left: Origin[0] - innerWidth / 2,
        top: Origin[1] - innerHeight / 2,
      });

      gsap.set(Images[i], {
        position: "absolute",
        left: fx,
        top: fy,
        width: ImageWidth,
        height: ImageHeight,
        transform: `rotate(${theta + Math.PI / 2}rad) translateX(0)`,
      });
    }
  }

  function AddImages(onLoad = () => {}) {
    let loaded = 0;
    ImageContainer.innerHTML = "";
    for (let i = 1; i <= TotalImages / 4; i++) {
      const src = `/${i}.jpg`;
      const imagecon = document.createElement("div");
      imagecon.classList.add("image");
      const image = new Image();
      image.src = src;
      imagecon.appendChild(image);
      Images.push(imagecon);
      image.onload = () => {
        loaded++;
        if (loaded == TotalImages) onLoad();
      };
    }
    Images.forEach((img) => Images.push(img.cloneNode(true)));
    Images.forEach((img) => Images.push(img.cloneNode(true)));
    Images.forEach((img) => ImageContainer.appendChild(img));
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
  PlaceImages();
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

  const update = ({ p = 0, v = 0 }) => {
    TargetVelocity = Math.min(Math.abs(v), MaxVelocity);

    if (p <= 0.5) {
      SplitedHeroWords[0].forEach((w, i, a) => {
        const wordProgress = getWordProgress(p / 0.5, i, a.length);
        gsap.to(w, {
          yPercent: wordProgress * 100,
        });
      });
      SplitedHeroWords[1].forEach((w, i, a) => {
        const wordProgress = getWordProgress(p / 0.5, i, a.length);
        gsap.to(w, {
          yPercent: (1 - wordProgress) * 100,
        });
      });
      gsap.to(SplitedHeroWords[2], { yPercent: 100 });
    } else {
      SplitedHeroWords[1].forEach((w, i, a) => {
        const wordProgress = getWordProgress((p - 0.5) / 0.5, i, a.length);
        gsap.to(w, {
          yPercent: wordProgress * 100,
        });
      });
      SplitedHeroWords[2].forEach((w, i, a) => {
        const wordProgress = getWordProgress((p - 0.5) / 0.5, i, a.length);
        gsap.to(w, {
          yPercent: (1 - wordProgress) * 100,
        });
      });
      gsap.to(SplitedHeroWords[0], { yPercent: 100 });
    }
  };

  const Animate = (t = 0) => {
    Velocity += (TargetVelocity - Velocity) * 0.5;
    gsap.set("nav .velocity .line", {
      scaleX: Velocity / MaxVelocity,
    });

    rad.phi += 0.45;
    rad.phi += (Velocity / MaxVelocity);
    gsap.set(".images", {
      transform: `rotate(${rad.phi}deg)`,
    });

    requestAnimationFrame(Animate);
  };
  requestAnimationFrame(Animate);

  ScrollTrigger.create({
    trigger: ".hero-section",
    start: "top top",
    end: `+=${innerHeight * 10}px`,
    pin: true,
  });
});
