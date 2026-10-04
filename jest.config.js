/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      { tsconfig: { module: "commonjs", moduleResolution: "node", esModuleInterop: true } },
    ],
  },
};