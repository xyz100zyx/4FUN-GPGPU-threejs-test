import { Clock } from "three";

let tick;

class RAFController {
  #rafID;

  constructor() {
    this.#rafID = null;
  }

  callRAF(fn) {
    this.#rafID = requestAnimationFrame(fn);
  }

  canelRAF() {
    cancelAnimationFrame(this.#rafID);
  }
}

/**
 * Класс для управления подписками на обновление кадра сцены.
 * Позволяет добавлять callback-функции, которые будут вызываться на каждом кадре анимации.
 *
 * ** Объект класса - синглтон **
 *
 * @example
 * // Создание экземпляра Tick
 * const tick = new Tick();
 *
 * // Подписка на обновление кадра
 * tick.addTickCallback((elapsedTime, delta) => {
 *   console.log(`Время: ${elapsedTime}с, дельта: ${delta}с`);
 * });
 *
 */
export class Tick {
  #tickCallbacks = new Set();
  #rafController = new RAFController();
  #clock = new Clock();

  constructor() {
    if (tick) return tick;

    this.#start();
  }

  /**
   * Добавляет функцию обратного вызова в стадию рендера сцены.
   *
   * @param {(elapsedTime: number, delta: number) => void} callback - Функция, которая будет вызываться на каждом кадре анимации.
   * @param {number} callback.elapsedTime - Общее время в секундах, прошедшее с момента инстанцирования Tick.
   * @param {number} callback.delta - Время в секундах, прошедшее между текущим и предыдущим кадром анимации.
   *
   * @returns {VoidFunction} unsubscribeFn - отписка от обновления кадра сцены.
   *
   * @example
   * // Пример использования:
   * const tickCallback = (elapsedTime, delta) => {
   *   console.log(`Прошло времени: ${elapsedTime}с`);
   *   console.log(`Дельта времени: ${delta}с`);
   * };
   *
   * addTickCallback(tickCallback);
   */
  addTickCallback(callback) {
    this.#tickCallbacks.add(callback);

    return () => this.removeTickCallback(callback);
  }

  removeTickCallback(callback) {
    this.#tickCallbacks.delete(callback);
  }

  #executeTickCallbacks() {
    this.#tickCallbacks.forEach((cb) =>
      cb(this.#clock.getElapsedTime(), this.#clock.getDelta()),
    );
  }

  #start() {
    this.#rafController.callRAF(() => this.#start());

    this.#executeTickCallbacks();
  }

  destructor() {
    this.#tickCallbacks.clear();
    this.#rafController.canelRAF();
  }
}
