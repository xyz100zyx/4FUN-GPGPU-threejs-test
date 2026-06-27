import "./style.css";
import { Tick } from "./shared/tick";
import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";

import { initSimpleCube } from "@components/simple-cube";
import { initSimulatedTorus } from "@components/simulated-torus";
import { initOrbitControls } from "@core/controls";

async function bootstrap() {
  const scene = new Scene();
  scene.background = new Color(0x000000);

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const gridHelper = new GridHelper(10, 20, 0x888888, 0x444444);
  scene.add(gridHelper);

  const axesHelper = new AxesHelper(3);
  scene.add(axesHelper);

  const ambientLight = new AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 3, 4);
  scene.add(directionalLight);

  const pointLight = new PointLight(0xff00ff, 0.5);
  pointLight.position.set(-1, 1, 2);
  scene.add(pointLight);

  initSimpleCube(scene);
  initOrbitControls(camera, renderer);
  initSimulatedTorus(scene, renderer, { isDebugCalculation: true });

  const tick = new Tick();

  tick.addTickCallback(() => {
    renderer.render(scene, camera);
  });

  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
