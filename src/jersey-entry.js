// Keep WebGL, Three.js and the model out of the initial page load.
export function initJersey(motion) {
  const dialog = document.querySelector("#jersey-dialog");
  const stage = dialog.querySelector(".jersey-stage");
  const status = dialog.querySelector(".jersey-status");
  const fallback = dialog.querySelector(".jersey-fallback");
  const controls = dialog.querySelector(".jersey-controls");
  let generation = 0;
  let viewer;
  let abort;

  function clear() {
    generation++;
    abort?.abort();
    viewer?.dispose();
    viewer = undefined;
    controls.disabled = true;
    stage.setAttribute("aria-busy", "false");
  }

  async function load() {
    clear();
    const current = generation;
    abort = new AbortController();
    stage.dataset.state = "loading";
    stage.setAttribute("aria-busy", "true");
    status.textContent = "Chargement du maillot 3D…";
    fallback.hidden = true;
    const fail = () => {
      if (current !== generation || !dialog.open) return;
      clear();
      stage.dataset.state = "error";
      status.textContent = "La vue 3D n’est pas disponible sur cet appareil ou n’a pas pu se charger.";
      fallback.hidden = false;
    };
    try {
      const { createJerseyViewer } = await import("./jersey-viewer.js");
      if (current !== generation || !dialog.open) return;
      const instance = await createJerseyViewer({
        dialog,
        signal: abort.signal,
        paused: () => motion.paused,
        onError: fail,
      });
      if (current !== generation || !dialog.open) {
        instance.dispose();
        return;
      }
      viewer = instance;
      controls.disabled = false;
      stage.dataset.state = "ready";
      stage.setAttribute("aria-busy", "false");
      status.textContent = "Vue 3D prête. Faites tourner le maillot.";
    } catch (error) {
      if (error.name !== "AbortError") fail();
    }
  }

  document.querySelector("#jersey-open").addEventListener("click", () => {
    dialog.showModal();
    load();
  });
  dialog.querySelectorAll("[data-jersey-close]").forEach((button) =>
    button.addEventListener("click", () => dialog.close()),
  );
  dialog.addEventListener("close", clear);
  dialog.querySelector("#jersey-retry").addEventListener("click", load);
}
