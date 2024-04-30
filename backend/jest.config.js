module.exports = {
    verbose: true,
    bail: true,
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    globalSetup: './tests/bootstrap.js',
    setupFilesAfterEnv: ['./tests/setup.js']
};
