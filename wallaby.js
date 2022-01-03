module.exports = function () {
    return {
        files: [
            { pattern: '**/src/**/*.ts'},
            { pattern: '**/test/**/*-helpers.ts', },
            { pattern: '**/test/**/*.ts', },
            { pattern: '**/test/**/*.test.ts', ignore: true },
        ],
        tests: [
            {pattern: '/**/test/**/*.test.ts' },
            // {pattern: '/**/test/**/*.ts' }
        ],
        testFramework: "mocha",
        env: { type: 'node' }
    };
};
