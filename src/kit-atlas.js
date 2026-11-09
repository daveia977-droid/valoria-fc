// Reuse the supplied atlas without generating or inventing garment details.
const crops = [
  { aspect: 0.566, center: 0.1326 },
  { aspect: 0.5, center: 0.3837 },
  { aspect: 0.5, center: 0.619 },
  { aspect: 0.56, center: 0.8701 },
];

export function positionAtlas(viewport, image, index) {
  const crop = crops[index];
  // Trim empty top/bottom margins only; preserve every garment pixel and its ratio.
  const sourceHeight = 859;
  const visibleHeight = 648;
  viewport.style.setProperty(
    "--atlas-height",
    `${(sourceHeight / visibleHeight) * 100}%`,
  );
  viewport.style.setProperty("--atlas-top", `${(-96 / visibleHeight) * 100}%`);
  viewport.style.aspectRatio = (crop.aspect * sourceHeight) / visibleHeight;
  if (!viewport.clientWidth || !image.clientWidth) return;
  image.style.transform = `translateX(${viewport.clientWidth / 2 - crop.center * image.clientWidth}px)`;
}

export function initComparison(motion) {
  const comparison = document.querySelector("#home-comparison");
  const viewports = [...comparison.querySelectorAll("[data-atlas-kit]")];
  function update() {
    for (const viewport of viewports)
      positionAtlas(
        viewport,
        viewport.querySelector("img"),
        Number(viewport.dataset.atlasKit),
      );
  }
  const observer = new ResizeObserver(update);
  viewports.forEach((viewport) => {
    observer.observe(viewport);
    viewport.querySelector("img").addEventListener("load", update);
  });
  comparison.addEventListener("toggle", () => {
    if (!comparison.open) return;
    update();
    motion.animate(
      comparison.querySelector(".comparison-grid"),
      [
        { opacity: 0.5, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 300, easing: "cubic-bezier(.16,1,.3,1)" },
    );
  });
}
