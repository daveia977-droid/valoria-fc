import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Direct manipulation only. No automatic rotation or permanent animation loop.
export async function createJerseyViewer({ stage, mount, signal, onError }) {
  const events = new AbortController();
  const scene = new THREE.Scene();
  const pivot = new THREE.Group();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 30);
  scene.add(pivot);
  let renderer;
  let model;
  let resize;
  let disposed = false;
  let angle = 0;
  let pointer;
  let size;
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
      Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); });
      material.dispose();
    });
    textures.forEach((texture) => { texture.source?.data?.close?.(); texture.dispose(); });
    pivot.remove(model);
    model = undefined;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    events.abort();
    resize?.disconnect();
    releaseModel();
    renderer?.dispose();
    renderer?.domElement.remove();
    renderer?.forceContextLoss();
  }

  function render() {
    if (disposed || !model || document.hidden) return;
    pivot.rotation.y = THREE.MathUtils.degToRad(angle);
    stage.dataset.angle = String(Math.round(((angle % 360) + 360) % 360));
    renderer.render(scene, camera);
  }

  function fit() {
    if (disposed || !size) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const distance = Math.max(size.y / (2 * Math.tan(halfFov)), size.x / (2 * Math.tan(halfFov) * camera.aspect)) * 1.12;
    camera.position.set(0, 0.02, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    render();
  }

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 761 ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Domicile V1, prototype 3D à faire tourner par glissement ou avec les flèches du clavier");
    mount.replaceChildren(canvas);
    listen(signal, "abort", dispose);
    listen(canvas, "webglcontextlost", (event) => { event.preventDefault(); dispose(); onError(); });

    scene.add(new THREE.AmbientLight(0xffeadb, 1.4));
    const key = new THREE.DirectionalLight(0xffe5c5, 2.5);
    key.position.set(-2, 3, 4); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.2);
    fill.position.set(3, 0.7, 2); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xf2c77d, 2);
    rim.position.set(0, 2, -3); scene.add(rim);

    const response = await fetch(`${import.meta.env.BASE_URL}models/domicile-v1.glb`, { signal });
    if (!response.ok) throw new Error("Model unavailable");
    const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
    model = gltf.scene;
    if (signal.aborted || disposed) {
      releaseModel();
      throw new DOMException("Aborted", "AbortError");
    }
    const bounds = new THREE.Box3().setFromObject(model);
    size = bounds.getSize(new THREE.Vector3());
    model.position.sub(bounds.getCenter(new THREE.Vector3()));
    pivot.add(model);

    // Horizontal touch movement rotates; a vertical gesture scrolls the page.
    listen(canvas, "pointerdown", (event) => {
      if (!event.isPrimary || event.button > 0) return;
      stage.focus({ preventScroll: true });
      pointer = { id: event.pointerId, x: event.clientX, angle };
      canvas.setPointerCapture(event.pointerId);
    });
    listen(canvas, "pointermove", (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      angle = pointer.angle + (event.clientX - pointer.x) * 0.65;
      render();
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) =>
      listen(canvas, type, () => { pointer = undefined; }),
    );
    listen(stage, "keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") angle = 0;
      else angle += event.key === "ArrowRight" ? 15 : -15;
      render();
    });
    listen(document, "visibilitychange", render);
    resize = new ResizeObserver(fit);
    resize.observe(mount);
    return { dispose, fit };
  } catch (error) {
    dispose();
    throw error;
  }
}
