import { OrbitControls } from "three/examples/jsm/Addons.js";

function initOrbitControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  return controls;
}

export default initOrbitControls;