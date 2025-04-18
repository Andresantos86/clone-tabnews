const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const nextjest = require("next/jest");
const createJestConfig = nextjest({
  dir: ".",
});
const jastConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jastConfig;
