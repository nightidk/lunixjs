class Interval {
    constructor(ms, func) {
        this.timer = setInterval(func, ms);
    }

    async stop() {
        clearInterval(this.timer);
    }
}
