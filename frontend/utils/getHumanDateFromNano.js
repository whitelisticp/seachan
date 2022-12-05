export function getHumanDateFromNano(nanoseconds) {
    const nanosecondNumber = Number(BigInt(nanoseconds));
    const seconds = nanosecondNumber / 1000000;
    var dateObject = new Date(seconds);
    const humanDateFormat = dateObject.toLocaleString().replace(/,/g, "") //2019-12-9 10:30:15
    return humanDateFormat;
}