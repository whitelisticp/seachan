export function anonymizeBalance(balance) {
    if (balance == 0) { return 0 }
    if (balance > 0 && balance <= 10) { var roundBy = 1 }
    else if (balance > 10 && balance <= 100) { var roundBy = 5 }
    else if (balance > 100 && balance <= 1000) { var roundBy = 50 }
    else if (balance > 1000 && balance <= 10000) { var roundBy = 500 }
    else if (balance > 10000 && balance <= 100000) { var roundBy = 5000 }
    var rounded = Math.floor(balance / roundBy) * roundBy;
    var anonymized = numberWithCommas(rounded).toString();
    var anonymizedDecimal = anonymized;
    return anonymizedDecimal;
}

function numberWithCommas(x) {
    return x.toLocaleString();
}