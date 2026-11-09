// Native, reversible motion. Scroll only schedules one read/write pass per frame.
export function initMotion() {
  const root = document.documentElement;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 760px)");
  const toggle = document.querySelector("#motion-toggle");
  const hero = document.querySelector(".hero");
  const crest = document.querySelector(".hero-crest");
  const scene = document.querySelector(".hero-scene");
  const transient = new Set();
  const scrollAnimations = new Map();
  const visible = new Set();
  let manualPause = false;
  let heroVisible = true;
  let frame = 0;
  let currentChapter = "";
  const chapters = [...document.querySelectorAll("main > section[id]")];
  const chapterLinks = [
    ...document.querySelectorAll(
      '.desktop-nav a[href^="#"], #mobile-menu a[href^="#"]',
    ),
  ];
  const paused = () => manualPause || preference.matches;

  function animate(element, frames, options) {
    if (paused() || !element) return null;
    const animation = element.animate(frames, options);
    transient.add(animation);
    animation.finished.then(
      () => transient.delete(animation),
      () => transient.delete(animation),
    );
    return animation;
  }

  const ambient = [
    scene.animate(
      [
        { transform: "scale(1.02) translate(-0.5%, 0)" },
        { transform: "scale(1.06) translate(0.5%, -0.5%)" },
      ],
      {
        duration: 14000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    ),
    crest
      .querySelector("img")
      .animate(
        [
          { transform: "translateY(0) rotate(-0.4deg)" },
          { transform: "translateY(-6px) rotate(0.4deg)" },
        ],
        {
          duration: 6500,
          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out",
        },
      ),
  ];

  for (const element of document.querySelectorAll(".reveal")) {
    const animation = element.animate(
      [
        { opacity: 0.28, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 1000, fill: "both", easing: "linear" },
    );
    animation.pause();
    animation.currentTime = 1000;
    scrollAnimations.set(element, animation);
  }

  function pose(element, progress) {
    const animation = scrollAnimations.get(element);
    if (animation) animation.currentTime = progress * 1000;
  }

  function render() {
    frame = 0;
    // Read geometry together, then write transforms and animation times together.
    const height = innerHeight;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - height,
    );
    const chapterPositions = chapters.map((section) => [
      section.id,
      section.getBoundingClientRect(),
    ]);
    const heroRect =
      !paused() && heroVisible ? hero.getBoundingClientRect() : null;
    const measurements = (paused() ? [] : [...visible]).map((element) => {
      // Measure the layout anchor, not the animated translation itself.
      // Otherwise each scroll pass feeds its previous pose back into the next one.
      const transform = getComputedStyle(element).transform;
      const offset =
        transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
      return [element, element.getBoundingClientRect().top - offset];
    });
    root.style.setProperty(
      "--read-progress",
      String(Math.min(1, Math.max(0, scrollY / maxScroll))),
    );
    const activeChapter =
      chapterPositions.find(
        ([, rect]) => rect.top <= height * 0.45 && rect.bottom > height * 0.45,
      )?.[0] || "accueil";
    if (activeChapter !== currentChapter) {
      currentChapter = activeChapter;
      chapterLinks.forEach((link) => {
        if (link.hash === `#${activeChapter}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    if (paused()) return;
    if (heroRect) {
      const progress = Math.min(
        1,
        Math.max(0, -heroRect.top / (heroRect.height * 0.8)),
      );
      const travel = mobile.matches ? -18 : -40;
      const tilt = mobile.matches ? 4 : 8;
      crest.style.transform = `perspective(1100px) translateY(${progress * travel}px) rotateY(${progress * tilt}deg) rotateZ(${-progress * 1.5}deg) scale(${1 - progress * 0.05})`;
      scene.style.opacity = String(0.38 + progress * 0.1);
    }
    for (const [element, top] of measurements) {
      const progress = Math.min(
        1,
        Math.max(0, (height * 0.94 - top) / Math.min(220, height * 0.3)),
      );
      pose(element, progress);
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else {
        visible.delete(entry.target);
        pose(
          entry.target,
          paused() || entry.boundingClientRect.top < 0 ? 1 : 0,
        );
      }
    }
    schedule();
  });
  scrollAnimations.forEach((_, element) => observer.observe(element));

  function sync() {
    root.classList.toggle("motion-paused", paused());
    toggle.setAttribute("aria-pressed", String(paused()));
    toggle.disabled = preference.matches;
    toggle.textContent = preference.matches
      ? "Animations réduites (système)"
      : paused()
        ? "Activer les animations"
        : "Mettre en pause les animations";
    ambient.forEach((animation) =>
      paused() || !heroVisible || document.hidden
        ? animation.pause()
        : animation.play(),
    );
    if (paused()) {
      transient.forEach((animation) => animation.finish());
      scrollAnimations.forEach((animation) => {
        animation.currentTime = 1000;
      });
      crest.style.transform = "";
      scene.style.opacity = "";
    }
    schedule();
  }

  const entrances = [
    [".hero .eyebrow", 80, 12],
    [".hero-word", 160, 20],
    [".hero-crest", 260, 0],
    [".site-header .brand, .site-header nav, .menu-toggle", 420, 6],
    [".hero-motto", 540, 12],
    [".hero-description", 620, 12],
    [".hero .button", 700, 10],
    [".hero-bottom", 760, 6],
  ];
  for (const [selector, delay, distance] of entrances) {
    document.querySelectorAll(selector).forEach((element, index) => {
      const frames =
        selector === ".hero-crest"
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translateY(${distance}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ];
      animate(element, frames, {
        duration: 850,
        delay: delay + index * 90,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "both",
      });
    });
  }
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    sync();
  }).observe(hero);
  toggle.addEventListener("click", () => {
    manualPause = !manualPause;
    sync();
  });
  preference.addEventListener("change", sync);
  mobile.addEventListener("change", schedule);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  document.addEventListener("focusin", (event) => {
    const element = event.target.closest(".reveal");
    if (element) pose(element, 1);
  });
  sync();
  return {
    get paused() {
      return paused();
    },
    animate,
  };
}
