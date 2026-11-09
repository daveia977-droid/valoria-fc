import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// A real, locally authored garment mesh. No hosted viewer, remote API or HDRI.
export async function createJerseyViewer({ dialog, signal, paused, onError }) {
  const mount = dialog.querySelector(".jersey-canvas");
  const stage = dialog.querySelector(".jersey-stage");
  const slider = dialog.querySelector("#jersey-angle");
  const output = dialog.querySelector("#jersey-angle-value");
  const autoButton = dialog.querySelector("#jersey-auto");
  const motionNote = dialog.querySelector("#jersey-motion-note");
  const events = new AbortController();
  let renderer;
  let model;
  let resize;
  let motionObserver;
  let frame = 0;
  let disposed = false;
  let automatic = false;
  let previousTime = 0;
  let angle = 0;
  let tilt = 0;
  let zoom = 1;
  let pointer;

  const scene = new THREE.Scene();
  const pivot = new THREE.Group();
  scene.add(pivot);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 30);
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const listen = (element, type, fn, options = {}) =>
    element.addEventListener(type, fn, { ...options, signal: events.signal });

  function releaseModel() {
    if (!model) return;
    const materials = new Set();
    const textures = new Set();
    model.traverse((object) => {
      object.geometry?.dispose();
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.filter(Boolean).forEach((material) => materials.add(material));
    });
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) textures.add(value);
      });
      material.dispose();
    });
    textures.forEach((texture) => {
      texture.source?.data?.close?.();
      texture.dispose();
    });
    pivot.remove(model);
    model = undefined;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    frame = 0;
    events.abort();
    resize?.disconnect();
    motionObserver?.disconnect();
    releaseModel();
    renderer?.dispose();
    renderer?.domElement.remove();
    renderer?.forceContextLoss();
    stage.dataset.rotating = "false";
  }

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 761 ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Maillot domicile V1 en trois dimensions, à faire tourner");
    canvas.setAttribute("aria-describedby", "jersey-help");
    mount.replaceChildren(canvas);
    listen(canvas, "webglcontextlost", (event) => {
      event.preventDefault();
      onError();
    });

    scene.add(new THREE.AmbientLight(0xffeadb, 1.4));
    const key = new THREE.DirectionalLight(0xffe5c5, 2.5);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.2);
    fill.position.set(3, 0.7, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xf2c77d, 2);
    rim.position.set(0, 2, -3);
    scene.add(rim);

    const response = await fetch(`${import.meta.env.BASE_URL}models/domicile-v1.glb`, { signal });
    if (!response.ok) throw new Error("Model unavailable");
    const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
    model = gltf.scene;
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const centre = bounds.getCenter(new THREE.Vector3());
    model.position.sub(centre);
    pivot.add(model);

    function render() {
      if (disposed || !dialog.open || document.hidden) return;
      pivot.rotation.set(tilt, THREE.MathUtils.degToRad(angle), 0);
      renderer.render(scene, camera);
    }

    function fit() {
      if (disposed) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const distance = Math.max(size.y / (2 * Math.tan(halfFov)), size.x / (2 * Math.tan(halfFov) * camera.aspect)) * 1.2;
      camera.position.set(0, 0.02, distance / zoom);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      stage.dataset.zoom = zoom.toFixed(2);
      render();
    }

    function updatePose() {
      angle = ((angle % 360) + 360) % 360;
      const rounded = Math.round(angle) % 360;
      slider.value = String(rounded);
      output.value = `${rounded}°`;
      stage.dataset.angle = String(rounded);
      dialog.querySelectorAll("[data-view]").forEach((button) =>
        button.setAttribute("aria-pressed", String(Math.abs(Number(button.dataset.view) - angle) < 1)),
      );
      render();
    }

    function stopAutomatic() {
      automatic = false;
      syncMotion();
    }

    function tick(time) {
      frame = 0;
      if (!automatic || paused() || preference.matches || document.hidden || disposed || !dialog.open) return;
      if (previousTime) angle += Math.min(time - previousTime, 64) * 0.018;
      previousTime = time;
      updatePose();
      frame = requestAnimationFrame(tick);
    }

    function syncMotion() {
      const blocked = paused() || preference.matches;
      if (blocked) automatic = false;
      autoButton.disabled = blocked;
      autoButton.setAttribute("aria-pressed", String(automatic));
      motionNote.textContent = blocked ? "Rotation automatique désactivée selon vos préférences d’animation. Les commandes manuelles restent disponibles." : "La rotation automatique est facultative.";
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      const running = automatic && !blocked && !document.hidden && dialog.open && !disposed;
      stage.dataset.rotating = String(running);
      if (running) frame = requestAnimationFrame(tick);
      else render();
    }

    dialog.querySelectorAll("[data-view]").forEach((button) => listen(button, "click", () => {
      stopAutomatic();
      angle = Number(button.dataset.view);
      tilt = 0;
      updatePose();
    }));
    listen(slider, "input", () => {
      stopAutomatic();
      angle = Number(slider.value);
      updatePose();
    });
    dialog.querySelectorAll("[data-zoom]").forEach((button) => listen(button, "click", () => {
      const action = button.dataset.zoom;
      if (action === "reset") {
        stopAutomatic();
        angle = 0; tilt = 0; zoom = 1;
        updatePose();
      } else zoom = THREE.MathUtils.clamp(zoom + (action === "in" ? 0.1 : -0.1), 0.8, 1.5);
      fit();
    }));
    listen(autoButton, "click", () => {
      automatic = !automatic;
      syncMotion();
    });
    listen(canvas, "pointerdown", (event) => {
      if (event.isPrimary === false || event.button > 0) return;
      stopAutomatic();
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(event.pointerId);
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, angle, tilt };
    });
    listen(canvas, "pointermove", (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      angle = pointer.angle + (event.clientX - pointer.x) * 0.6;
      tilt = THREE.MathUtils.clamp(pointer.tilt + (event.clientY - pointer.y) * 0.003, -0.25, 0.25);
      updatePose();
    });
    const endDrag = () => { pointer = undefined; };
    listen(canvas, "pointerup", endDrag);
    listen(canvas, "pointercancel", endDrag);
    listen(canvas, "lostpointercapture", endDrag);
    listen(canvas, "keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "+", "=", "-"].includes(event.key)) return;
      event.preventDefault();
      stopAutomatic();
      if (event.key === "ArrowLeft") angle -= 15;
      if (event.key === "ArrowRight") angle += 15;
      if (event.key === "ArrowUp") tilt = Math.max(-0.25, tilt - 0.05);
      if (event.key === "ArrowDown") tilt = Math.min(0.25, tilt + 0.05);
      if (event.key === "Home") { angle = 0; tilt = 0; }
      if (event.key === "End") { angle = 180; tilt = 0; }
      if (["+", "="].includes(event.key)) zoom = Math.min(1.5, zoom + 0.1);
      if (event.key === "-") zoom = Math.max(0.8, zoom - 0.1);
      updatePose();
      fit();
    });
    listen(document, "visibilitychange", syncMotion);
    listen(preference, "change", syncMotion);
    motionObserver = new MutationObserver(syncMotion);
    motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    resize = new ResizeObserver(fit);
    resize.observe(mount);
    updatePose();
    fit();
    syncMotion();
    return { dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
