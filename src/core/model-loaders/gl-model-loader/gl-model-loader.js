import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { printError } from "./utils/printError";

export class GLModelLoader {
  #gltfLoader;

  constructor() {
    this.#gltfLoader = new GLTFLoader();
  }

  async loadGLModel(url, onSuccess, onError, onProgress) {
    try {
      const loadingResult = await this.#gltfLoader.loadAsync(url, onProgress);

      onSuccess(loadingResult);

      return loadingResult;
    } catch (e) {
      printError(e);
      onError();

      return null;
    }
  }

  dispose() {}
}
