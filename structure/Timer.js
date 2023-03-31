const Timer = async (client, name, fn, delay, ...args) => {
    let timerId = setTimeout(() => {
        fn(...args)
            .then(() => {
                clearTimeout(timerId);
                client.loops.set(name, Timer(client, name, fn, delay, ...args));
            });
    }, delay);
    return timerId;
}

module.exports = Timer;