module.exports = {
  purge: ["./src/index", "./src/components/Timer"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundColor: (theme) => ({
      primary: "#FFFFFF",
    }),
    textColor: {
      primary: "#000000",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
