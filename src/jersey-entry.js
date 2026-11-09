// Only V1 has a real model. The other garments keep their original front image.
export function initJersey(motion) {
  const stage = document.querySelector("#kit-panel");
  const image = stage.querySelector(".kit-window");
  const mount = stage.querySelector(".jersey-canvas");
  const note = stage.querySelector(".kit-motion-note");
  let selected = 0;
  let visible = false;
  let generation = 0;
  let viewer;
  let abort;
  let failed = false;

  function resetPerspective() {
    stage.style.setProperty("--kit-tilt-x", "0deg");
    stage.style.setProperty("--kit-tilt-y", "0deg");
  }

  function clear() {
    generation++;
    abort?.abort();
    viewer?.dispose();
    viewer = undefined;
    mount.hidden = true;
    image.removeAttribute("aria-hidden");
    stage.dataset.presentation = "2d";
    stage.removeAttribute("data-angle");
    stage.removeAttribute("aria-keyshortcuts");
    note.textContent = "Visuel 2D";
    resetPerspective();
  }

  async function load() {
    if (!visible || selected !== 0 || failed || viewer || abort) return;
    const current = generation;
    abort = new AbortController();
    const signal = abort.signal;
    const fail = () => {
      if (current !== generation) return;
      clear();
      failed = true;
    };
    try {
      const { createJerseyViewer } = await import("./jersey-viewer.js");
      if (signal.aborted) return;
      const instance = await createJerseyViewer({ stage, mount, signal, onError: fail });
      if (signal.aborted || current !== generation || !visible || selected !== 0) {
        instance.dispose();
        return;
      }
      viewer = instance;
      mount.hidden = false;
      stage.dataset.presentation = "3d";
      stage.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight Home");
      image.setAttribute("aria-hidden", "true");
      note.textContent = "Prototype 3D · Glissez pour tourner · ← → au clavier";
      resetPerspective();
      viewer.fit();
    } catch (error) {
      if (error.name !== "AbortError") fail();
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) load();
    else {
      clear();
      abort = undefined;
    }
  }, { threshold: 0.05 });
  observer.observe(stage);

  // A bounded tilt of the same front image. Vertical touch gestures stay native.
  stage.addEventListener("pointermove", (event) => {
    if (motion.paused || stage.dataset.presentation === "3d") return;
    if (event.pointerType === "touch" && !event.buttons) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    stage.style.setProperty("--kit-tilt-x", `${-y * 3}deg`);
    stage.style.setProperty("--kit-tilt-y", `${x * 4}deg`);
  });
  ["pointerleave", "pointerup", "pointercancel"].forEach((name) =>
    stage.addEventListener(name, resetPerspective),
  );
  new MutationObserver(() => {
    if (motion.paused) resetPerspective();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  return {
    select(index) {
      if (index === selected) return;
      clear();
      abort = undefined;
      selected = index;
      load();
    },
  };
}
