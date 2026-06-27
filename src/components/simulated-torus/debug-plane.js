import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import calculationShader from "./shaders/debug-plane.glsl";

export const initDebugPlane = (scene, renderer) => {
  const planeGeometry = new PlaneGeometry(2, 2);
  const material = new MeshBasicMaterial({
    color: "#FFFFFF",
    side: DoubleSide,
  });
  const mesh = new Mesh(planeGeometry, material);

  mesh.position.x -= 2;

  scene.add(mesh);

  return {
    mesh,
    material,
    geometry: planeGeometry,
  };
};
