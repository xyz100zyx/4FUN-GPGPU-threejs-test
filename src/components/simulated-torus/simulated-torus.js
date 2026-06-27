import {
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Points,
  TorusGeometry,
  TorusKnotGeometry,
  BufferAttribute,
  ShaderMaterial,
  Uniform,
} from "three";

import { Tick } from "@shared/tick";

import { initDebugPlane } from "./debug-plane";

import vertexShader from "./shaders/torus-vertex.glsl";
import fragmentShader from "./shaders/torus-fragment.glsl";
import computingPlaneShader from "./shaders/debug-plane.glsl";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

export const initSimulatedTorus = (scene, renderer, options) => {
  const torusGeometry = new TorusKnotGeometry();
  const torusMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uParticlesTexture: new Uniform(),
    },
  });

  const positions = torusGeometry.attributes.position.array;
  const particleCount = Math.round(
    torusGeometry.attributes.position.array.length / 3,
  );
  const matrixSize = Math.ceil(Math.sqrt(particleCount));

  const particlesGeometry = new BufferGeometry();
  const particlePositions = new Float32Array(positions);
  particlesGeometry.setAttribute(
    "position",
    new BufferAttribute(particlePositions, 3),
  );

  const mesh = new Points(particlesGeometry, torusMaterial);

  mesh.position.x += 2.5;

  scene.add(mesh);

  let debugPlaneData = null;
  if (options.isDebugCalculation) {
    debugPlaneData = initDebugPlane(scene, renderer);
  }

  const particlesUVs = new Float32Array(particleCount * 2);

  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      const i = y * matrixSize + x;
      const i2 = i * 2;

      const uvX = (x + 0.5) / matrixSize;
      const uvY = (y + 0.5) / matrixSize;

      particlesUVs[i2 + 0] = uvX;
      particlesUVs[i2 + 1] = uvY;
    }
  }

  const particlesCalculatedGeometry = new BufferGeometry();
  particlesCalculatedGeometry.setDrawRange(0, particleCount);
  particlesCalculatedGeometry.setAttribute(
    "aParticleUV",
    new BufferAttribute(particlesUVs, 2),
  );
  /**
   * GPGPU Setup
   */
  const gpgpuRenderer = new GPUComputationRenderer(
    matrixSize,
    matrixSize,
    renderer,
  );

  const particlesTexture = gpgpuRenderer.createTexture();

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    particlesTexture.image.data[i4 + 0] = particlePositions[i3 + 0];
    particlesTexture.image.data[i4 + 1] = particlePositions[i3 + 1];
    particlesTexture.image.data[i4 + 2] = particlePositions[i3 + 2];
    particlesTexture.image.data[i4 + 3] = 0;
  }

  const particlesVariable = gpgpuRenderer.addVariable(
    "uParticles",
    computingPlaneShader,
    particlesTexture,
  );
  gpgpuRenderer.setVariableDependencies(particlesVariable, [particlesVariable]);

  gpgpuRenderer.init();

  const computedTexture =
    gpgpuRenderer.getCurrentRenderTarget(particlesVariable).texture;

  debugPlaneData.material.map = computedTexture;

  const tick = new Tick();

  tick.addTickCallback((elapsedTime, delta) => {
    gpgpuRenderer.compute();

    torusMaterial.uniforms.uParticlesTexture.value =
      gpgpuRenderer.getCurrentRenderTarget(particlesVariable).texture;
  });
};
