module.exports = function () {
    return {
        files: [
            '**/src/**/*.ts',
        ],
        tests: [
            '/**/*.test.ts',
        ],
        testFramework: "mocha",
        env: { type: 'node' }
    };
};
