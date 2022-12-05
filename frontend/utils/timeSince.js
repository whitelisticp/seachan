

export function timeSince(nanoseconds) {
    const nanosecondNumber = Number(BigInt(nanoseconds));
    const secondsNumber = nanosecondNumber / 1000000;
    var dateObject = new Date(secondsNumber);

    var seconds = Math.floor((new Date() - dateObject) / 1000);

    var interval = seconds / 31536000;
    if (interval > 1) {
        const descriptor = ((Math.floor(interval) == 1) ? ' year' : ' years');
        return Math.floor(interval) + descriptor;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const descriptor = ((Math.floor(interval) == 1) ? ' month' : ' months');
        return Math.floor(interval) + descriptor;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const descriptor = ((Math.floor(interval) == 1) ? ' day' : ' days');
        return Math.floor(interval) + descriptor;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const descriptor = ((Math.floor(interval) == 1) ? ' hour' : ' hours');
        return Math.floor(interval) + descriptor;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const descriptor = ((Math.floor(interval) == 1) ? ' minute' : ' minutes');
        return Math.floor(interval) + descriptor;
    }
    const descriptor = ((Math.floor(interval) == 1) ? ' second' : ' seconds');
    return Math.floor(seconds) + descriptor;
}