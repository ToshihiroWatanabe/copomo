module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "false",
        useBuiltIns: "usage",
        targets: "> 0.25%, not dead",
      },
    ],
    ["@babel/preset-react", { targets: { node: "current" } }],
  ],
  env: {
    test: {
      presets: [["@babel/preset-env", { targets: { node: "current" } }]],
    },
  },
};
