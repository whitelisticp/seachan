const { anonymizeBalance } = require('./anonymizeBalance');

test("anonymizes ICP balance", () => {
    expect(anonymizeBalance(10.01)).toBe("10")
    expect(anonymizeBalance(1.2345)).toBe("1")
    expect(anonymizeBalance(1234.56789)).toBe("1,000")
});
