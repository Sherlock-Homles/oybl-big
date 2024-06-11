/**
 * 使用RequestAnimationFrame实现setTimeout和setInterval
 * 代码来源：https://zhuanlan.zhihu.com/p/34868095
 */
export class RAF {
  constructor() {
    this.init();
  }
  init() {
    this._timerIdMap = {
      timeout: {},
      interval: {}
    };
  }
  run(type = 'interval', cb, interval = 16.7) {
    const now = Date.now;
    let startTime = now();
    let endTime = startTime;
    const timerSymbol = Symbol();
    const loop = () => {
      this.setIdMap(timerSymbol, type, loop);
      endTime = now();
      if (endTime - startTime >= interval) {
        if (type === 'interval') {
          startTime = now();
          endTime = startTime;
        }
        cb();
        type === 'timeout' && this.clearTimeout(timerSymbol);
      }
    };
    this.setIdMap(timerSymbol, type, loop);
    return timerSymbol;
  }
  setIdMap(timerSymbol, type, loop) {
    const id = requestAnimationFrame(loop);
    this._timerIdMap[type][timerSymbol] = id;
  }
  setTimeout(cb, interval) {
    return this.run('timeout', cb, interval);
  }
  clearTimeout(timer) {
    cancelAnimationFrame(this._timerIdMap.timeout[timer]);
  }
  setInterval(cb, interval) {
    return this.run('interval', cb, interval);
  }
  clearInterval(timer) {
    cancelAnimationFrame(this._timerIdMap.interval[timer]);
  }
}
