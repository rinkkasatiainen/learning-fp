module.exports = function () {
    return {
        files: [
            { pattern: '**/src/**/*.ts'},
            { pattern: '**/test/**/*-helpers.ts', },
        ],
        tests: [
            {pattern: '/**/test/**/*.test.ts' },
            // {pattern: '/**/test/**/*.ts' }
        ],
        testFramework: "mocha",
        env: { type: 'node' }
    };
};
