import { BoxGeometry, Mesh, ShaderMaterial, Uniform } from "three";
import { Tick } from "@shared/tick";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export const initSimpleCube = (scene) => {
  const uniforms = {
    uTime: new Uniform(0),
  };

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  });
  const mesh = new Mesh(geometry, material);
  console.log({ scene });
  scene.add(mesh);

  const tick = new Tick();

  tick.addTickCallback((elapsed) => {
    uniforms.uTime = new Uniform(elapsed);
    material.uniforms.needsUpdate = true;
  });
};
